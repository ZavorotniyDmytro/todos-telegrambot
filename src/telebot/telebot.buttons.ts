import { SelectedCity } from "src/entity/cities.entity";
import { Markup } from "telegraf";
import { Button } from "./telebot.enum";

export function ActionButtons(){
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

export function CitiesButtons(cities: SelectedCity[]){
	const citiesButtons = []
	for (let i = 0; i < cities.length; i++){
		citiesButtons.push(Markup.button.callback(cities[i].city_name, cities[i].city_name))
	}
	return Markup.keyboard(citiesButtons, {columns: 2}).resize()
}
