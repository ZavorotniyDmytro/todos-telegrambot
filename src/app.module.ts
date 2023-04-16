import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TelebotModule } from './telebot/telebot.module';

@Module({
	imports: [
		ConfigModule.forRoot({			
			envFilePath: ['.env',],			
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().required().default(4999),
				TELEGRAM_BOT_TOKEN: Joi.string().required(),
			})
		}),
		TelebotModule,
	],
	controllers: [],
	providers: [ConfigService],
})
export class AppModule {}
