window.addEventListener('tizenhwkey', function onTizenHwKey(e) {
    if (e.keyName === 'back') {
    	window.open("index.html");
    }
});
(function() {
	window.addEventListener("pageshow", function() {
		var id=localStorage.param-0.01;
		openDB();
		getWeatherFromDatabaseByCityId(id.toFixed(1),onGetSuccess,onGetError);
	});
}());

var onGetSuccess = function(data){
	data=JSON.parse(data.rows.item(0).city_weather);
	var now=new Date();
	now=now.getTime()-(1000*60*60*3);
	$('#city-name').html(data.city.name);
	data.list.forEach(function(item,i,arr){
		if(now<=item.dt*1000){
			$('#list-forecast').append('<li>'+
			'<div id = "li-container-1" class="w3-row ">'+
				'<div class = " w3-panel w3-col s8 w3-display-container" >'+
					'<h3 id="date" class="w3-display-left" style = "height: 100%">'+item.dt_txt+'</h3>'+
				'</div>'+
				'<div class = "w3-col s4 w3-white" align = "center">'+
					'<h3>'+Math.round(item.main.temp-273.15)+'°C</h3>'+
					'<img src = "http://openweathermap.org/img/w/'+item.weather[0].icon+'.png">'+
				'</div>'+
			'</div>'+
	'</li>');
		};
	});
}

var onGetError = function(){
	alert("Database error");
}