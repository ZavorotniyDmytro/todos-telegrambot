export function airQualityIndexToString(index: 1 | 2 | 3 | 4 | 5): string{
	let result = undefined
	switch (index) {
		case 1: result = 'Good'; break;
		case 2: result = 'Fair'; break;
		case 3: result = 'Moderate'; break;
		case 4: result = 'Poor'; break;
		case 5: result = 'Very Poor'; break;		
	}
	return result
}