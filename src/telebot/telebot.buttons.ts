import { Markup } from "telegraf";

export enum Button {
	WEATHER_NOW = 'Weather now',
	WEATHER_HERE = 'Weather in my location',
	WEATHER_FORECAST_WEEK = 'Weekly forecast',
	WEATHER_FORECAST_TODAY = 'Forecast for today',
	AIR_QUALITY = 'Air quality',
	COMPARE_WEATHER = 'Compare weather',
	HELP = 'Help'
}

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

export enum ButtonChoice {
	BY_CITY_NAME = 'By city name',
	BY_LOCATION = 'By location',
}

export function inlineChoiceButtons(){
	return Markup.inlineKeyboard([
		Markup.button.callback(ButtonChoice.BY_CITY_NAME, '/city'),
		Markup.button.callback(ButtonChoice.BY_LOCATION, '/location')
	])
}
