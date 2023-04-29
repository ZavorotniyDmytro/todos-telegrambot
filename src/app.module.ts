import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TelebotModule } from './telebot/telebot.module';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [
		ConfigModule.forRoot({			
			envFilePath: ['.env',],			
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().required().default(4999),
				POSTGRES_HOST: Joi.string().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required().default(5432),
				TELEGRAM_BOT_TOKEN: Joi.string().required(),
				OPENWEATHER_API_KEY: Joi.string().required(),
				OPENWEATHERMAP_BASE_URL: Joi.string().required(),
			})
		}),
		TelebotModule,
		DatabaseModule,
	],
	controllers: [],
	providers: [ConfigService],
})
export class AppModule {}
