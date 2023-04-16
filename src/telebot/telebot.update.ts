

import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelebotService } from './telebot.service';
import { Context } from './context.interface';

const todos = [
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

@Update()
export class TelebotUpdate {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly telebotService: TelebotService
	){	}

	@Start()
	async startCommand(ctx: Context){
		this.telebotService.start(ctx)
	}
	
	@Hears('TO-DO list')
	async getAll(ctx: Context){
		this.telebotService.getAll(ctx)
	}

	@Hears('Edit')
	async editTask(ctx: Context){
		this.telebotService.editTask(ctx)
	}

	@Hears('Complete')
	async completeTask(ctx: Context){
		this.telebotService.completeTask(ctx)
	}

	@Hears('Remove')
	async removeTask(ctx: Context){
		this.telebotService.removeTask(ctx)
	}

	@On('text')
	async getMessage(@Message('text') message:string, @Ctx() ctx: Context){
		this.telebotService.getMessage(Number(message), ctx)
	}
}
