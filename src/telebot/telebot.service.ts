import { Injectable } from '@nestjs/common';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from './context.interface';
import { actionButtons } from './telebot.buttons';

@Injectable()
export class TelebotService {
	

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

	async messageHandler(message, ctx: Context){
		if (!ctx.session.type) return

		if (ctx.session.type === 'current'){
			await ctx.reply(await this.weatherNow(message))			
		}

		// ToDO buttons logic
		if (ctx.session.type === 'current'){
			await ctx.reply(await this.weatherNow(message))			
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
				//await ctx.replyWithLocation(latitude, longitude)
			}	
		}
	}

	private async weatherNow(town: string): Promise<string>{		
		//todo OpenWeather logic
		return town
	}

	private async weatherByLocation(latitude: number, longitude: number): Promise<string>{		
		//todo OpenWeather logic		
		return `latitude = ${latitude}, longitude = ${longitude}`
	}

	async weatherForecastToday(ctx: Context){
		if (ctx.session.type === 'today'){
			//todo OpenWeather logic
		}
	}

	async weatherForecastWeek(ctx: Context){
		if (ctx.session.type === 'week'){
			//todo OpenWeather logic
		}
	}

	async weatherAir(ctx: Context){
		if (ctx.session.type === 'air'){
			//todo OpenWeather logic
		}
	}

	async weatherCompare(ctx: Context){
		if (ctx.session.type === 'air'){
			//todo OpenWeather logic
		}
	}
	
}
