import { Injectable } from '@nestjs/common';
import { IAirQualityData, IWeatherData, IWeatherForecastData } from 'src/weather/weather.interface';
import { WeatherService } from 'src/weather/weather.service';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from './context.interface';
import { MessageService } from './message.service';
import { SelectedCityService } from './selectedCity.service';
import { ActionButtons, CitiesButtons } from './telebot.buttons';

@Injectable()
export class TelebotService {

	constructor(private readonly weatherService: WeatherService,
					private readonly messageService: MessageService,
					private readonly selectedCityService: SelectedCityService){}

	async start(ctx: Context):Promise<void>{
		await ctx.reply(`Hello. Let me help you`, ActionButtons())
	}

	async askTown(ctx: Context):Promise<void>{
		const cities = await this.selectedCityService.getSelectedCitiesByUserId(ctx.from.id)
		if (cities.length === 0)
			await ctx.reply(`Okey. Please enter your town or /help`);
		else
			await ctx.reply(`Okey. Please enter your town or /help`, CitiesButtons(cities));
	}

	async askTowns(ctx: Context):Promise<void>{		
		await ctx.reply(`Okey. Please enter your cities separated by a space or /help`);
	}

	async askLocation(ctx: Context):Promise<void>{
		await ctx.reply(`Okey. Please send me your location or /help`);
	}

	async helpHandler(ctx: Context):Promise<void>{
		if (!ctx.session.type){
			ctx.reply(`To start, enter /start and click on one of the offered buttons`, ActionButtons())
		}

		if (ctx.session.type === 'location' || ctx.session.type === 'air'){
			ctx.reply('To send your coordinates, you need to click on the "Attach file" button (or the "File" icon on a mobile device) in a chat with the bot and select the "Location" option (or "Location" on a mobile device). After that, you can select your current location on the map that will appear in the chat window.')
		}

		if (ctx.session.type === 'compare'){
			ctx.reply('To compare the weather in different cities, specify these two cities separated by a space.\nFor example:\nKyiv London')
		}
	
		if (ctx.session.type === 'current' || ctx.session.type === 'week' || ctx.session.type === 'today'){
			ctx.reply(`To get the information you are interested in, enter the name of your city in English`)
		}		
	}

	async messageHandler(message: string, ctx: Context):Promise<void>{
		if (!ctx.session.type) 
			await this.helpHandler(ctx)

		if (ctx.session.type === 'current'){
			this.selectedCityService.addSelectedCity(ctx.from.id, message)
			await ctx.reply(await this.weatherNow(message), ActionButtons())
		}		

		if (ctx.session.type === 'today'){
			this.selectedCityService.addSelectedCity(ctx.from.id, message)
			await ctx.reply(await this.weatherForecastToday(message), ActionButtons())			
		}

		if (ctx.session.type === 'week'){
			this.selectedCityService.addSelectedCity(ctx.from.id, message)
			await ctx.reply(await this.weatherForecastWeek(message), ActionButtons())	
		}		

		if (ctx.session.type === 'compare'){
			const response = await this.weatherCompare(message)
			if (response === `Invalid input. /help`)
				return
			await ctx.reply(response, ActionButtons())
		}
		
		delete ctx.session.type
	}
	
	async locationHandler(ctx: Context):Promise<void>{
		if (ctx.session.type === 'air'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				ctx.reply(await this.airQuality(latitude, longitude))
			}			
		}
			
		if (ctx.session.type === 'location'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				ctx.reply(await this.weatherNowByLocation(latitude, longitude))
			}	
		}
	}

	private async weatherNow(town: string): Promise<string>{		
		const data: IWeatherData = await this.weatherService.getWeatherByCityName(town)
		return this.messageService.weatherNowMessage(data)
	}

	private async weatherNowByLocation(latitude: number, longitude: number): Promise<string>{		
		const data: IWeatherData = await this.weatherService.getWeatherByLocation(latitude, longitude)		
		return this.messageService.weatherNowMessage(data)
	}	

	private async weatherForecastToday(town: string): Promise<string>{		
		const intervals: IWeatherForecastData[] = await this.weatherService.getWeatherForecast(town)
		return this.messageService.weatherForecastMessage(intervals, town)
	}

	private async weatherForecastWeek(town: string): Promise<string>{
		const intervals: IWeatherForecastData[] = await this.weatherService.getWeatherForecast(town, 5)
		return this.messageService.weatherForecastMessage(intervals, town)
	}	

	private async airQuality(latitude: number, longitude: number): Promise<string>{
		const airQuality: IAirQualityData = await this.weatherService.getAirQuality(latitude, longitude)
		return this.messageService.airQuelityMessage(airQuality)
	}	

	private async weatherCompare(towns: string): Promise<string>{
		const pair: string[] = towns.split(' ')

		// TODO fix bug, when towns mb "London Nova Odesa", where after towns.split will be ['London', 'Nova', 'Odesa']. must be ['London', 'Nova Odesa'] 
		// TODO use two messages to write cities OR use "" to mark city
		if (pair.length != 2){
			return `Invalid input. /help`
		}
		const firstCity: IWeatherData = await this.weatherService.getWeatherByCityName(pair[0])
		const secondCity: IWeatherData = await this.weatherService.getWeatherByCityName(pair[1])
		return this.messageService.weatherCompareMessage(firstCity, secondCity)
	}
}
