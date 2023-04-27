

import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelebotService } from './telebot.service';
import { Context } from './context.interface';
import { Button } from './telebot.buttons';
import { runInThisContext } from 'vm';

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
	
	@Hears(Button.WEATHER_NOW)
	async weatherNow(ctx: Context){
		this.telebotService.weatherNow(ctx)
	}

	@Hears(Button.WEATHER_HERE)
	async weatherNowInLocation(ctx: Context){
		this.telebotService.weatherNowInLocation(ctx)
	}

	@Hears('/help')
	async helpHandler(ctx: Context){
		this.telebotService.helpHandler(ctx)
	}

	// @Hears('Edit')
	// async editTask(ctx: Context){
	// 	this.telebotService.editTask(ctx)
	// }

	// @Hears('Complete')
	// async completeTask(ctx: Context){
	// 	this.telebotService.completeTask(ctx)
	// }

	// @Hears('Remove')
	// async removeTask(ctx: Context){
	// 	this.telebotService.removeTask(ctx)
	// }

	@On('text')
	async getMessage(@Message('text') message, @Ctx() ctx: Context){
		await this.telebotService.MessageHandler(message, ctx)
	}

	@On('location')
	async locationHandling(@Ctx() ctx: Context){
		await this.telebotService.locationHandler(ctx)
	}
}
