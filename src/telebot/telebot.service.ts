import { Injectable } from '@nestjs/common';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from './context.interface';
import { actionButtons } from './telebot.buttons';

@Injectable()
export class TelebotService {
	

	async start(ctx: Context){
		await ctx.reply(`Hello. Let me help you`, actionButtons().oneTime())
	}

	async weatherNow(ctx: Context){
		ctx.session.type = 'current';
		await ctx.reply(`Okey. Please enter your town or /help`);
	}

	async weatherNowInLocation(ctx: Context)
	{
		ctx.session.type = 'location'
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
	// async editTask(ctx: Context){
	// 	await ctx.reply(`Enter task id:`)
		
	// 	ctx.session.type = 'edit'
	// }

	// async completeTask(ctx: Context){
	// 	await ctx.reply(`Enter task id:`)

	// 	ctx.session.type = 'complete'
	// }

	// async removeTask(ctx: Context){
	// 	await ctx.reply(`Enter task id:`)

	// 	ctx.session.type = 'remove'
	// }

	async MessageHandler(message, ctx: Context){
		if (!ctx.session.type) return

		if (ctx.session.type === 'current'){
			await ctx.reply(this.currentWeather(message))			
		}		

		// if (ctx.session.type == 'complete'){
		// 	const todo = this.todos.find(t => t.id === id)

		// 	if (!todo){
		// 		ctx.deleteMessage()
		// 		ctx.reply('Task with this ID does not exist')
		// 		return
		// 	}
		// 	todo.isCompleted = !todo.isCompleted
		// 	await ctx.reply(showTodos(this.todos))
		// }
		delete ctx.session.type
	}
	
	async locationHandler(ctx: Context){
		if (ctx.session.type === 'location'){
			const message = ctx.message as Message.LocationMessage;
			if (message.location) {
				const latitude = message.location.latitude;
				const longitude = message.location.longitude;
				await ctx.reply(`x = ${latitude} y = ${longitude}`)
			}	
		}
	}

	private currentWeather(town: string): string{
		// todo use OpenWeather API
		return `${town}`
	}
	
}
