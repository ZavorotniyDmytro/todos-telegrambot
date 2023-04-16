import { Injectable } from '@nestjs/common';
import { Context } from './context.interface';
import {  showTodos } from './telebot.utils';
import { actionButtons } from './telebot.buttons';

@Injectable()
export class TelebotService {
	todos: Todo[] = [
		{
			id: 1,
			name: 'Buy eggs',
			isCompleted: false,
		},
		{
			id: 2,
			name: 'Read book',
			isCompleted: false,
		},
		{
			id: 3,
			name: 'Learn eng',
			isCompleted: true,
		}
	]


	async start(ctx: Context){
		await ctx.reply(`Hello. Let me help you`, actionButtons())
	}

	async getAll(ctx: Context){
		return await ctx.reply(showTodos(this.todos))
	}

	async editTask(ctx: Context){
		await ctx.reply(`Enter task id:`)
		
		ctx.session.type = 'edit'
	}

	async completeTask(ctx: Context){
		await ctx.reply(`Enter task id:`)

		ctx.session.type = 'complete'
	}

	async removeTask(ctx: Context){
		await ctx.reply(`Enter task id:`)

		ctx.session.type = 'remove'
	}

	async getMessage(id: number, ctx: Context){
		if (!ctx.session.type) return

		if (ctx.session.type == 'complete'){
			const todo = this.todos.find(t => t.id === id)

			if (!todo){
				ctx.deleteMessage()
				ctx.reply('Task with this ID does not exist')
				return
			}
			todo.isCompleted = !todo.isCompleted
			await ctx.reply(showTodos(this.todos))
		}
	}
}
