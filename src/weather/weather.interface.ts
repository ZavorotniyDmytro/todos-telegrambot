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

export interface IAirQualityData{
	time: number
	air_quality_index: 1 | 2 | 3 | 4 | 5
	co: number
	no: number
	no2: number
	o3: number
	so2: number
	pm2_5: number
	pm10: number
	nh3: number
}