import { Markup } from "telegraf";
import { Button } from "./telebot.enum";

export function actionButtons(){
	return Markup.keyboard([
		Markup.button.callback(Button.WEATHER_NOW, '/current'),
		Markup.button.callback(Button.WEATHER_HERE, '/here'),
		Markup.button.callback(Button.WEATHER_FORECAST_TODAY, '/today'),
		Markup.button.callback(Button.WEATHER_FORECAST_WEEK, '/week'),
		Markup.button.callback(Button.AIR_QUALITY, '/air'),
		Markup.button.callback(Button.COMPARE_WEATHER, '/compare'),
	],
	{
		columns: 2,
	})
	.resize();
}
