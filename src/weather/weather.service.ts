import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { IAirQualityData, IWeatherData, IWeatherForecastData } from './weather.interface';

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

		return this.getWeatherData(response)
		} catch (error) {
			console.error(error);
		}
	}

	async getWeatherByCityName(cityName: string): Promise<IWeatherData> {
		const url = `${this.baseUrl}/weather?q=${cityName}&appid=${this.apiKey}&units=metric`;
		try {
			const response: AxiosResponse = await axios.get(url);
			return this.getWeatherData(response);
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

	async getAirQuality(latitude: number, longitude: number): Promise<IAirQualityData>{
		const url = `${this.baseUrl}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
		try {	
			const response: AxiosResponse = await axios.get(url);			

			return this.getAirQualityData(response)
		} catch (error) {
			console.error(error); 
		}
		
	}

	private getAirQualityData(response: AxiosResponse):IAirQualityData{
		const data = response.data.list[0]
		const airQualityData: IAirQualityData = {
			time: data.dt,
			air_quality_index: data.main.aqi,
			co: data.components.co,
			no: data.components.no,
			no2: data.components.no2,
			o3: data.components.o3,
			so2: data.components.so2,
			pm2_5: data.components.pm2_5,
			pm10: data.components.pm10,
			nh3: data.components.nh3,
		}
		return airQualityData
	}

	private getWeatherData(response: AxiosResponse): IWeatherData{
		const { main } = response.data;
		const { sys } = response.data;

		const data: IWeatherData = { 
			weather: response.data.weather[0].main,
			weather_description: response.data.weather[0].description,
			temp: main.temp, 
			feels_like: main.feels_like,
			pressure: main.pressure,
			sunrise: sys.sunrise + response.data.timezone,
			sunset: sys.sunset + response.data.timezone,
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
