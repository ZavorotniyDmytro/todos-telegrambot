import { Injectable } from '@nestjs/common';
import { IWeatherData, WeatherService } from 'src/weather/weather.service';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from './context.interface';
import { actionButtons } from './telebot.buttons';

@Injectable()
export class TelebotService {
	constructor(private readonly weatherService: WeatherService){}

	async start(ctx: Context){
		await ctx.reply(`Hello. Let me help you`, actionButtons().oneTime())
	}

	async askTown(ctx: Context){
		await ctx.reply(`Okey. Please enter your town or /help`);
	}

	async askLocation(ctx: Context){
		await ctx.reply(`Okey. Please send me your location or /help`);
	}

	async helpHandler(ctx: Context){
		if (!ctx.session.type){}
			//todo оброблюємо загальний випадок
		if (ctx.session.type === 'location'){
			ctx.reply('To send your coordinates, you need to click on the "Attach file" button (or the "File" icon on a mobile device) in a chat with the bot and select the "Location" option (or "Location" on a mobile device). After that, you can select your current location on the map that will appear in the chat window.')
		}

		if (ctx.session.type === 'compare'){
			ctx.reply('To compare the weather in different cities, specify these two cities separated by a space.\nFor example\nKyiv London')
		}
	
		// todo обробити випадки пов'язані з вводом тільки одного міста
		// ctx.reply()
	}

	async messageHandler(message: string, ctx: Context){
		if (!ctx.session.type) 
			await ctx.reply(await this.weatherNow(message), actionButtons())

		if (ctx.session.type === 'current')
			await ctx.reply(await this.weatherNow(message), actionButtons())				

		if (ctx.session.type === 'today')
			await ctx.reply(await this.weatherForecastToday(message), actionButtons())			

		if (ctx.session.type === 'week')
			await ctx.reply(await this.weatherForecastWeek(message), actionButtons())			

		if (ctx.session.type === 'air')
			await ctx.reply(await this.weatherAir(message), actionButtons())				

		if (ctx.session.type === 'compare'){
			const response = await this.weatherCompare(message)
			if (response === `Invalid input. /help`)
				return
			await ctx.reply(response, actionButtons())			
		}
		
		delete ctx.session.type
	}
	
	async locationHandler(ctx: Context){
		if (ctx.session.type === 'location'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				ctx.reply(await this.weatherByLocation(latitude, longitude))
			}	
		}
	}

	private async weatherNow(town: string): Promise<string>{		
		const data: IWeatherData = await this.weatherService.getWeatherByCityName(town)
		return this.weatherMessage(data)
	}

	private async weatherByLocation(latitude: number, longitude: number): Promise<string>{		
		const data: IWeatherData = await this.weatherService.getWeatherByLocation(latitude, longitude)		
		return this.weatherMessage(data)
	}

	private weatherMessage(data: IWeatherData):string{
		const sunrise = new Date(data.sunrise*1000)
		const sunset = new Date(data.sunset*1000)
		return `In ${data.name}:\n
		Weather: ${data.weather} - ${data.weather_description}
		Temperature - ${data.temp}°C
		Feels like - ${data.feels_like}°C
		Pressure - ${data.pressure} Pa
		Sunrise - ${sunrise.getHours()+':'+sunrise.getMinutes()+', '+sunrise.toDateString()}
		Sunset - ${sunset.getHours()+':'+sunset.getMinutes()+', '+sunset.toDateString()}`
	}

	private async weatherForecastToday(town: string): Promise<string>{
		//todo OpenWeather logic
		return town
	}

	private async weatherForecastWeek(town: string): Promise<string>{
		//todo OpenWeather logic
		return town
	}

	private async weatherAir(town: string): Promise<string>{
		//todo OpenWeather logic
		return town
	}

	private async weatherCompare(towns: string): Promise<string>{
		//todo OpenWeather logic
		const pair: string[] = towns.split(' ')
		if (pair.length != 2)
			return `Invalid input. /help`
		return `First - ${pair[0]}, Second - ${pair[1]}`
	}	
}
