import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectedCity } from 'src/entity/cities.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SelectedCityService {
	constructor(@InjectRepository(SelectedCity) 
					private readonly selectedCityRepository: Repository<SelectedCity>){}

	async getSelectedCitiesByUserId(id: number): Promise<SelectedCity[]>{
		const cities = await this.selectedCityRepository.find({
			where: {
				user_telegram_id: id
			}
		})
		return cities
	}

	async getSelectedCitiesByUserIdAndCityName(id: number, city_name: string): Promise<SelectedCity>{
		const city = await this.selectedCityRepository.findOne({
			where: {
				user_telegram_id: id,
				city_name:city_name
			}
		})
		return city
	}

	async addSelectedCity(id: number, city_name: string):Promise<void>{
		const cities = await this.getSelectedCitiesByUserId(id)

		if (!this.isAlreadyInDB(cities, city_name)){
			if (cities.length !== 5){
				await this.selectedCityRepository.save({
					user_telegram_id: id,
					city_name: city_name,
					usage_counter: 1,
				})
			}
			else {
				const uselessCity = this.getMostUnusedCity(cities)

				await this.selectedCityRepository.update({id: uselessCity.id},{
					city_name:city_name,
					usage_counter: 1
				})
			}
		} else {
			const city = await this.getSelectedCitiesByUserIdAndCityName(id, city_name)
			await this.selectedCityRepository.update({id: city.id},{
				usage_counter: city.usage_counter += 1
			})
		}
		
	}

	private isAlreadyInDB(selectedCities: SelectedCity[], city_name:string): boolean{
	   for (let i = 0; i < selectedCities.length; i++){
			if (selectedCities[i].city_name === city_name)
				return true;
		}
		return false;
	}

	private getMostUnusedCity(selectedCities: SelectedCity[]): SelectedCity{
		let selectedCityWithMinUsageCounter = selectedCities[0];
	  
		for (let i = 1; i < selectedCities.length; i++) {
			const currentSelectedCity = selectedCities[i];
	  
			if (currentSelectedCity.usage_counter < selectedCityWithMinUsageCounter.usage_counter) {
			  	selectedCityWithMinUsageCounter = currentSelectedCity;
			} else if (currentSelectedCity.usage_counter === selectedCityWithMinUsageCounter.usage_counter) {
				if (currentSelectedCity.updated_at.getTime() < selectedCityWithMinUsageCounter.updated_at.getTime()) {
					selectedCityWithMinUsageCounter = currentSelectedCity;
				}
			}
		}
	  
		return selectedCityWithMinUsageCounter;
	}

}
