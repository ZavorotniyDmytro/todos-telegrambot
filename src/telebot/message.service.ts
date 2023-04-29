import { Injectable } from '@nestjs/common';
import { AirQualityComponents } from 'src/weather/weather.enum';
import { IAirQualityData, IWeatherData, IWeatherForecastData } from 'src/weather/weather.interface';
import { airQualityIndexToString } from 'src/weather/weather.utils';
import { ForecastDays } from './telebot.enum'

@Injectable()
export class MessageService {
	
	weatherNowMessage(data: IWeatherData):string{
		const sunrise = new Date(data.sunrise*1000)
		const sunset = new Date(data.sunset*1000)
		return `In ${data.name}:\n
		Weather: ${data.weather} - ${data.weather_description}
		Temperature - ${data.temp}°C
		Feels like - ${data.feels_like}°C
		Pressure - ${data.pressure} Pa
		Sunrise - ${sunrise.getHours()+':'+sunrise.getMinutes()+', '+sunrise.toDateString()}
		Sunset - ${sunset.getHours()+':'+sunset.getMinutes()+', '+sunset.toDateString()}`
	}
	
	weatherForecastMessage(intervals: IWeatherForecastData[], town:string): string{
		let message: string = `In ${town}:\n`
		message+=ForecastDays.DAY_0
		for (let i = 0, k = 1; i < Math.floor(intervals.length / 8);i++){
			for (let j = 0; j < 8; j++){
				const interval = intervals[i*8+j]

				if (i*8+j){
					const previous = new Date(intervals[i*8+j-1].slice_timestamp*1000)
					const current = new Date(interval.slice_timestamp*1000)
					
					if (previous.toDateString() !== current.toDateString()){
						switch (k) {
							case 1:	message+=ForecastDays.DAY_1; break;
							case 2:	message+=ForecastDays.DAY_2; break;
							case 3:	message+=ForecastDays.DAY_3; break;
							case 4:	message+=ForecastDays.DAY_4; break;
							case 5:	message+=ForecastDays.DAY_5; break;
							default:	break;
						}
						k++
					}
				}
				const date = new Date(interval.slice_timestamp*1000)
				let hours = date.getHours().toString();
				(hours.length == 1)?hours='0'+hours:hours
				message+= `${date.toDateString()}, ${hours}:00 - ${interval.temp}°C, ${interval.weather_description}\n`
			}
		}
		return message
	}

	airQuelityMessage(airQuality: IAirQualityData): string{
		const message:string = ` Air quality in this location:
		Air quality index - ${airQuality.air_quality_index} (${airQualityIndexToString(airQuality.air_quality_index)})
		Concentration of CO (${AirQualityComponents.CO}): ${airQuality.co} μg/m3
		Concentration of NO (${AirQualityComponents.NO}): ${airQuality.no} μg/m3
		Concentration of NO2 (${AirQualityComponents.NO2}): ${airQuality.no2} μg/m3
		Concentration of O3 (${AirQualityComponents.O3}): ${airQuality.o3} μg/m3
		Concentration of SO2 (${AirQualityComponents.SO2}): ${airQuality.so2} μg/m3
		Concentration of PM 2.5 (${AirQualityComponents.PM2_5}): ${airQuality.pm2_5} μg/m3
		Concentration of PM 10 (${AirQualityComponents.PM10}): ${airQuality.pm10} μg/m3
		Concentration of NH3 (${AirQualityComponents.NH3}): ${airQuality.nh3} μg/m3`
		return message
	}

	weatherCompareMessage(firstCity: IWeatherData, secondCity: IWeatherData): string{
		return ` ${firstCity.name} vs ${secondCity.name}
		Weather - ${firstCity.weather_description} vs ${secondCity.weather_description}
		Temperature - ${firstCity.temp}°C vs ${secondCity.temp}°C
		Feels like - ${firstCity.feels_like}°C vs ${secondCity.feels_like}°C
		Pressure - ${firstCity.pressure} Pa vs ${secondCity.pressure} Pa`
	}
}
