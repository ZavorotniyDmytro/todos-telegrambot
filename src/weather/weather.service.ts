import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

export interface IWeatherData{
	weather: string
	weather_description: string
	temp: number
	feels_like: number
	pressure: number
	sunrise: number
	sunset: number
	name: string
}

@Injectable()
export class WeatherService {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
		this.baseUrl = this.configService.get('OPENWEATHERMAP_BASE_URL');
	}

	async getWeatherByLocation(latitude: number, longitude: number): Promise<IWeatherData>{
		const url = `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
		try {
		const response: AxiosResponse = await axios.get(url);

		return this.getData(response)
		} catch (error) {
			console.error(error);
		}
	}

	async getWeatherByCityName(cityName: string): Promise<IWeatherData> {
		const url = `${this.baseUrl}/weather?q=${encodeURIComponent(
		  cityName,
		)}&appid=${this.apiKey}&units=metric`;
		try {
		  const response: AxiosResponse = await axios.get(url);
		  return this.getData(response);
		} catch (error) {
		  console.error(error);
		}
	}

	private getData(response: AxiosResponse): IWeatherData{
		const { main } = response.data;
		const { sys } = response.data;

		const data: IWeatherData = { 
			weather: response.data.weather[0].main,
			weather_description: response.data.weather[0].description,
			temp: main.temp, 
			feels_like: main.feels_like,
			pressure: main.pressure,
			sunrise: sys.sunrise,
			sunset: sys.sunset,
			name: response.data.name,
		};
		return data
	}
}
