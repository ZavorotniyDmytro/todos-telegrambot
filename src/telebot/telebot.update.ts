

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
		ctx.session.type = 'current';
		this.telebotService.askTown(ctx);
	}

	@Hears(Button.WEATHER_HERE)
	async weatherNowInLocation(ctx: Context){
		ctx.session.type = 'location'
		this.telebotService.askLocation(ctx)
	}

	@Hears(Button.WEATHER_FORECAST_TODAY)
	async weatherForecastToday(ctx: Context){
		ctx.session.type = 'today'
		this.telebotService.askTown(ctx)
	}

	@Hears(Button.WEATHER_FORECAST_WEEK)
	async weatherForecastWeek(ctx: Context){
		ctx.session.type = 'week'
		this.telebotService.askTown(ctx)
	}

	@Hears(Button.AIR_QUALITY)
	async weatherAirQuality(ctx: Context){
		ctx.session.type = 'week'
		this.telebotService.askTown(ctx)
	}

	@Hears(Button.COMPARE_WEATHER)
	async weatherCompare(ctx: Context){
		ctx.session.type = 'compare'
		this.telebotService.askTown(ctx)
	}

	@Hears('/help')
	async helpHandler(ctx: Context){
		this.telebotService.helpHandler(ctx)
	}

	@On('text')
	async getMessage(@Message('text') message, @Ctx() ctx: Context){
		await this.telebotService.messageHandler(message, ctx)
	}

	@On('location')
	async locationHandling(@Ctx() ctx: Context){
		await this.telebotService.locationHandler(ctx)
	}
}
