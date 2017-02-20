var apiAddress = 'http://api.openweathermap.org/data/2.5/forecast';
var appId = '199e51a7251d81ae172475ea5b313f94';

//НЕ ЮЗАТЬ
function getWeather(params,onError,onComplete){
	$(document).ready(function() {
		$.ajax({
			url : apiAddress,
			type :   'GET',
			dataType : 'json',
			data: params,
			success : function(json) {
				/*$.each(json,function(key,val){
					console.log(key+" "+val);
				});*/
				return json;
			},
			error : onError,
			complete : onComplete
		});
	});
}

//Выводит погоду по названию
function getWeatherByName(nameCity,onError,onComplete) {
	return getWeather({
		'q': nameCity,
		'APPID':appId
	},onError,onComplete);
}

//Выводит погоду по координатам. Можно припилить GPS.
function getWeatherByCoordinates(lat,lon,onError,onComplete){
	return getWeather({
		'lat':lat,
		'lon':lon,
		'APPID':appId
	},onError,onComplete);
}



