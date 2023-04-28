
import { date } from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { AirQualityComponents, airQualityIndexToString, IAirQualityData, IWeatherData, IWeatherForecastData, WeatherService } from 'src/weather/weather.service';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from './context.interface';
import { actionButtons } from './telebot.buttons';

export enum ForecastDays {
	DAY_0='Today:\n',
	DAY_1='Tomorrow:\n',
	DAY_2='After 2 days:\n',
	DAY_3='After 3 days:\n',
	DAY_4='After 4 days:\n',
	DAY_5='After 5 days:\n',
}

@Injectable()
export class TelebotService {
	constructor(private readonly weatherService: WeatherService){}

	async start(ctx: Context):Promise<void>{
		await ctx.reply(`Hello. Let me help you`, actionButtons().oneTime())
	}

	async askTown(ctx: Context):Promise<void>{
		await ctx.reply(`Okey. Please enter your town or /help`);
	}

	async askLocation(ctx: Context):Promise<void>{
		await ctx.reply(`Okey. Please send me your location or /help`);
	}

	async helpHandler(ctx: Context):Promise<void>{
		if (!ctx.session.type){}
			//todo обробити загальний випадок + .actionButtons()
		if (ctx.session.type === 'location' || ctx.session.type === 'air'){
			ctx.reply('To send your coordinates, you need to click on the "Attach file" button (or the "File" icon on a mobile device) in a chat with the bot and select the "Location" option (or "Location" on a mobile device). After that, you can select your current location on the map that will appear in the chat window.')
		}

		if (ctx.session.type === 'compare'){
			ctx.reply('To compare the weather in different cities, specify these two cities separated by a space.\nFor example\nKyiv London')
		}
	
		// todo обробити випадки пов'язані з вводом тільки одного міста
		// ctx.reply()
	}

	async messageHandler(message: string, ctx: Context):Promise<void>{
		if (!ctx.session.type) 
			await this.helpHandler(ctx)

		if (ctx.session.type === 'current')
			await ctx.reply(await this.weatherNow(message), actionButtons())				

		if (ctx.session.type === 'today')
			await ctx.reply(await this.weatherForecastToday(message), actionButtons())			

		if (ctx.session.type === 'week')
			await ctx.reply(await this.weatherForecastWeek(message), actionButtons())			

		if (ctx.session.type === 'compare'){
			const response = await this.weatherCompare(message)
			if (response === `Invalid input. /help`)
				return
			await ctx.reply(response, actionButtons())			
		}
		
		delete ctx.session.type
	}
	
	async locationHandler(ctx: Context):Promise<void>{
		if (ctx.session.type === 'air'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				ctx.reply(await this.weatherAir(latitude, longitude))
			}			
		}
			
		if (ctx.session.type === 'location'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				ctx.replyWithLocation(latitude, longitude)
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
		const intervals: IWeatherForecastData[] = await this.weatherService.getWeatherForecast(town)
		return this.weatherForecastMessage(intervals, town)
	}

	private async weatherForecastWeek(town: string): Promise<string>{
		const intervals: IWeatherForecastData[] = await this.weatherService.getWeatherForecast(town, 5)
		return this.weatherForecastMessage(intervals, town)
	}

	
	private weatherForecastMessage(intervals: IWeatherForecastData[], town:string): string{
		let message: string = `In ${town}:\n`
		message+=ForecastDays.DAY_0
		for (let i = 0, k = 1; i < Math.floor(intervals.length / 8);i++){
			for (let j = 0; j < 8; j++){
				const interval = intervals[i*8+j]

				if (i*8+j){
					const previous = new Date(intervals[i*8+j-1].slice_timestamp*1000)
					const current = new Date(interval.slice_timestamp*1000)
					
					if (previous.toDateString() !== current.toDateString()){
						switch (k) {
							case 1:	message+=ForecastDays.DAY_1; break;
							case 2:	message+=ForecastDays.DAY_2; break;
							case 3:	message+=ForecastDays.DAY_3; break;
							case 4:	message+=ForecastDays.DAY_4; break;
							case 5:	message+=ForecastDays.DAY_5; break;
							default:	break;
						}
						k++
					}
				}
				const date = new Date(interval.slice_timestamp*1000)
				let hours = date.getHours().toString();
				(hours.length == 1)?hours='0'+hours:hours
				message+= `${date.toDateString()}, ${hours}:00 - ${interval.temp}°C, ${interval.weather_description}\n`
			}
		}
		return message
	}

	private async weatherAir(latitude: number, longitude: number): Promise<string>{
		const airQuality: IAirQualityData = await this.weatherService.getAirQuality(latitude, longitude)
		return this.airQuelityMessage(airQuality)
	}

	private airQuelityMessage(airQuality: IAirQualityData): string{
		const message:string = ` Air quality in this location:
		Air quality index - ${airQuality.air_quality_index} (${airQualityIndexToString(airQuality.air_quality_index)})
		Concentration of CO (${AirQualityComponents.CO}): ${airQuality.co} μg/m3
		Concentration of NO (${AirQualityComponents.NO}): ${airQuality.no} μg/m3
		Concentration of NO2 (${AirQualityComponents.NO2}): ${airQuality.no2} μg/m3
		Concentration of O3 (${AirQualityComponents.O3}): ${airQuality.o3} μg/m3
		Concentration of SO2 (${AirQualityComponents.SO2}): ${airQuality.so2} μg/m3
		Concentration of PM 2.5 (${AirQualityComponents.PM2_5}): ${airQuality.pm2_5} μg/m3
		Concentration of PM 10 (${AirQualityComponents.PM10}): ${airQuality.pm10} μg/m3
		Concentration of NH3 (${AirQualityComponents.NH3}): ${airQuality.nh3} μg/m3`
		return message
	}

	private async weatherCompare(towns: string): Promise<string>{
		const pair: string[] = towns.split(' ')
		if (pair.length != 2){
			return `Invalid input. /help`
		}
		const firstCity = this.weatherService.getWeatherByCityName(pair[0])
		const secondCity = this.weatherService.getWeatherByCityName(pair[1])
		return ``
	}
}
