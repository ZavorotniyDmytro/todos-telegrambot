import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf'
import * as LocalSession from 'telegraf-session-local'
import { ConfigService } from '@nestjs/config';
import { TelebotUpdate } from './telebot.update';
import { TelebotService } from './telebot.service';
import { WeatherModule } from 'src/weather/weather.module';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectedCity } from 'src/entity/cities.entity';
import { SelectedCityService } from './selectedCity.service';

const session = new LocalSession({database: 'session_db.json'})

@Module({
	imports: [
		TypeOrmModule.forFeature([SelectedCity]),
		TelegrafModule.forRootAsync({
			useFactory: async (configService: ConfigService) => ({
				middlewares: [session.middleware()],
				token: configService.get<string>('TELEGRAM_BOT_TOKEN')
			}),
			inject:[ConfigService]
		}),
		WeatherModule,	
	],
	controllers: [],
	providers: [TelebotService, MessageService, TelebotUpdate, SelectedCityService],
})
export class TelebotModule {}
