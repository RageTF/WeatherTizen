var apiAddress = 'http://api.openweathermap.org/data/2.5/forecast';
var appId = '199e51a7251d81ae172475ea5b313f94';

//onSuccess(data) - вызывается при успешном ответе от сервера. data - JSON объект.
//onError - вызывается при ошибке.
//onComplete - вызывается при завершении запроса.

// НЕ ЮЗАТЬ
function getWeather(params,onSuccess,onError, onComplete) {
	$(document).ready(function() {
		$.ajax({
			url : apiAddress,
			type : 'GET',
			dataType : 'json',
			data : params,
			success : onSuccess,
			error : onError,
			complete : onComplete
		});
	});
}

//onSuccess, onError, onComplete - передаются в качестве параметра.

// Выводит погоду по названию
function getWeatherByName(nameCity,onSuccess,onError, onComplete) {
	return getWeather({
		'q' : nameCity,
		'APPID' : appId
	},onSuccess,onError,onComplete);
}

// Выводит погоду по координатам. Можно припилить GPS.
function getWeatherByCoordinates(lat, lon,onSuccess,onError,onComplete) {
	return getWeather({
		'lat' : lat,
		'lon' : lon,
		'APPID' : appId
	},onSuccess,onError,onComplete);
}