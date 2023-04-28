import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

export interface IWeatherData{
	weather: string
	weather_description: string
	temp: number
	feels_like: number
	pressure: number
	sunrise?: number
	sunset?: number
	name: string
}

export interface IWeatherForecastData{
	slice_timestamp: number
	slice_timestamp_string: string
	temp: number
	weather_description: string
}

@Injectable()
export class WeatherService {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
		this.baseUrl = this.configService.get('OPENWEATHERMAP_BASE_URL');
	}

	// location button
	async getWeatherByLocation(latitude: number, longitude: number): Promise<IWeatherData>{
		const url = `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
		try {
		const response: AxiosResponse = await axios.get(url);

		return this.getData(response)
		} catch (error) {
			console.error(error);
		}
	}

	// weather now button
	async getWeatherByCityName(cityName: string): Promise<IWeatherData> {
		const url = `${this.baseUrl}/weather?q=${cityName}&appid=${this.apiKey}&units=metric`;
		try {
		  const response: AxiosResponse = await axios.get(url);
		  return this.getData(response);
		} catch (error) {
		  console.error(error);
		}
	}

	async getWeatherForecast(cityName: string, days = 1):Promise<IWeatherForecastData[]>{
		const url = `${this.baseUrl}/forecast?q=${cityName}&cnt=${days*8}&units=metric&appid=${this.apiKey}`;
		 try {	
			const response: AxiosResponse = await axios.get(url);			

			return this.getForecastData(response)
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

	private getForecastData(response: AxiosResponse): IWeatherForecastData[]{
		let weatherDatas: IWeatherForecastData[] = []
		for(let i = 0; i < response.data.cnt; i++)
		{
			const slice = response.data.list[i]

			weatherDatas.push({
				slice_timestamp: slice.dt,
				slice_timestamp_string: slice.dt_txt,
				temp: slice.main.temp,
				weather_description: slice.weather[0].description,
			})
		}
		return weatherDatas
	}
}
