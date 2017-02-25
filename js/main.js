var backEventListener = null;

var unregister = function() {
	if (backEventListener !== null) {
		document.removeEventListener('tizenhwkey', backEventListener);
		backEventListener = null;
		window.tizen.application.getCurrentApplication().exit();
	}
}

// Initialize function
var init = function() {
	// register once
	if (backEventListener !== null) {
		return;
	}

	// TODO:: Do your initialization job
	console.log("init() called");

	var backEvent = function(e) {
		if (e.keyName == "back") {
			try {
				if ($.mobile.urlHistory.activeIndex <= 0) {
					// if first page, terminate app
					unregister();
				} else {
					// move previous page
					$.mobile.urlHistory.activeIndex -= 1;
					$.mobile.urlHistory.clearForward();
					window.history.back();
				}
			} catch (ex) {
				unregister();
			}
		}
	}

	openDB();
	getAndShowData();
	getAndUpdateData();
	geolocationWeather();
	$("#btn_search").bind(
			"click",
			function(event, ui) {
				var cityName = $("#input_search").val();
				getWeatherByName(cityName, onSearchSuccess, onSearchError,
						onSearchComplete);
			});
	$("#refresh_btn").bind("click", function(event, ui) {
		getAndUpdateData();
	});
	// add eventListener for tizenhwkey (Back Button)
	document.addEventListener('tizenhwkey', backEvent);
	backEventListener = backEvent;
};

var onSearchSuccess = function(data) {
	putWeatherCity(data.city.id, data.city.name, data, inputData, onPutError);
}

var inputData = function(data) {
	$('#weather-list')
			.append(
					'<li id = "'
							+ data.city.id
							+ '">'
							+ '<div class="w3-row w3-card-2 w3-round-small w3-border w3-border-blue">'
							+ '<div class = " w3-panel w3-col s8">'
							+ '<h3 id="'
							+ data.city.id
							+ '_name">'
							+ data.city.name
							+ '</h3>'
							+ '</div>'
							+ '<div class = "w3-col s4 w3-white w3-display-container" align = "center">'
							+ '<span id="'
							+ data.city.id
							+ '_btn" class="w3-closebtn w3-medium w3-display-topright w3-padding-small">&times;</span>'
							+ '<h3 id="' + data.city.id + '_temp">'
							+ Math.round(data.list[0].main.temp - 273.15)
							+ ' °C</h3>' + '<img id="' + data.city.id
							+ '_img" src = "http://openweathermap.org/img/w/'
							+ data.list[0].weather[0].icon + '.png">'
							+ '</div>' + '</div>' + '</li>');
	$('#' + data.city.id + '_btn').bind("click", function(event, ui) {
		removeWeatherByCityId(data.city.id, onDeleteSuccess, onDeleteError);
	});
	$('#' + data.city.id).bind("click", function(event, ui) {
		localStorage.param = data.city.id;
		window.open('city-info.html');
	});
}

var getAndShowData = function() {
	getWeatherFromDatabase(getAndShowDataSuccess, getDataError);
}

var getAndUpdateData = function() {
	getWeatherFromDatabase(getAndUpdateDataSuccess, getDataError);
}

var getAndRefreshData = function() {
	getWeatherFromDatabase(getAndRefreshDataSuccess, getDataError);
}

var getData = function(result) {
	var list = [];
	var count = result.rows.length;
	var i;
	for (i = 0; i < count; i++) {
		var data = JSON.parse(result.rows.item(i).city_weather);
		list.push(data);
	}
	return list;
}

var getAndShowDataSuccess = function(result) {
	var list = getData(result);
	showData(list);
}

var getAndUpdateDataSuccess = function(result) {
	var list = getData(result);
	updateData(list);
}

var getAndRefreshDataSuccess = function(result) {
	var list = getData(result);
	refreshData(list);
}

var updateData = function(list) {
	list.forEach(function(item, i, arr) {
		getWeatherById(item.city.id, onSearchUpdateSuccess, onSearchError,
				onSearchComplete);
	});
	getAndRefreshData();
}

var onSearchUpdateSuccess = function(data) {
	updateWeatherByCityId(data.city.id, data, onUpdateSuccess, onUpdateError);
}

var refreshData = function(list) {
	list.forEach(function(item, i, arr) {
		$('#' + item.city.id + '_name').html(item.city.name);
		$('#' + item.city.id + '_temp').html(
				Math.round(item.list[0].main.temp - 273.15) + ' °C');
		$('#' + item.city.id + '_img').attr(
				'src',
				'http://openweathermap.org/img/w/'
						+ item.list[0].weather[0].icon + '.png');
		$('#' + item.city.id + '_btn').bind(
				"click",
				function(event, ui) {
					removeWeatherByCityId(item.city.id, onDeleteSuccess,
							onDeleteError);
				});
	});
}

var onDeleteSuccess = function(id) {
	$('#' + id).remove();
}

var onDeleteError = function() {
	alert("Can't delete");
}

var onUpdateSuccess = function() {
	console.log("Updated");
}

var onUpdateError = function() {
	alert("Can't update data");
}

var getDataError = function() {
	console.log("Database is empty");
}

var showData = function(data) {
	data.forEach(function(item, i, arr) {
		inputData(item);
	});
}

var onSearchError = function() {
	alert("Connection error");
}

var onPutError = function() {
	alert("City already exists");
}

var onSearchComplete = function() {
}

var geolocationWeather = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(findLocationSuccess,
				findLocationError, options);
	} else {
		$('#main')
				.append(
						'<div id = "current-weather-container" class="w3-card-2 w3-blue w3-round-small w3-center w3-padding">'
								+ '<h3>Sorry, but geolocation are not available</h3>'
								+ '</div>');
	}
}

var findLocationSuccess = function(position) {
	var lon = position.coord.longitude;
	var lat = position.coord.latitude;
	getWeatherByCoordinats(55.79, 49.12, onGeolocationSuccess,
			onGeolocationError, onComplete);
}

var findLocationError = function(error) {
	$('#current-weather-container')
			.append(
					'<div id = "current-weather-container" class="w3-card-2 w3-blue w3-round-small w3-center w3-padding">'
							+ '<h3>Sorry, but geolocation are not available</h3>'
							+ '</div>');
}

var onGeolocationSuccess = function(data) {
	$('#current-weather-container')
			.append(
					'<div id = "current-weather-container" class="w3-row w3-card-2 w3-blue w3-round-small">'
							+ '<div class = " w3-panel w3-col s8">'
							+ '<h3 id="geo_city"></h3>'
							+ '</div>'
							+ '<div class = "w3-col s4 w3-white w3-padding-large" align = "center">'
							+ '<h3 id="geo_temp"></h3>'
							+ '<img id="geo_img" src = "">'
							+ '</div>'
							+ '</div>')
	$("#geo_city").text(data.city.name);
	var temp = Math.round(data.list[0].main.temp - 273.15);
	var image = "http://openweathermap.org/img/w/"
			+ data.list[0].weather[0].icon + ".png";
	$("#geo_img").attr('src', image);
	$("#geo_temp").text(temp + " °C");
}

var onGeolocationError = function() {
	$('#current-weather-container')
			.append(
					'<div id = "current-weather-container" class="w3-card-2 w3-blue w3-round-small w3-center w3-padding">'
							+ '<h3>Sorry, but internet are not available</h3>'
							+ '</div>');
}

var onComplete = function() {

}

var options = {
	enableHighAccuracy : true,
	timeout : 10000,
	maximumAge : 0
};

$(document).bind('pageinit', init);
$(document).unload(unregister);
