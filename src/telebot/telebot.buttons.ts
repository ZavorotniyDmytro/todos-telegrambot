import { Markup } from "telegraf";

export function actionButtons(){
	return Markup.keyboard([
		Markup.button.callback('TO-DO list', '/list'),
		Markup.button.callback('Edit', 'edit'),		
		Markup.button.callback('Complete', 'complete'),
		Markup.button.callback('Remove', 'remove'),
	],
	{
		columns: 2,
	})
}