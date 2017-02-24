window.addEventListener('tizenhwkey', function onTizenHwKey(e) {
    if (e.keyName === 'back') {
    	window.open("index.html");
    }
});
var id=localStorage.param;
openDB();
getWeatherFromDatabaseByCityId(id,onGetSuccess,onGetError);



var onGetSuccess = function(data){
	$("#city-name").text(data.city.id);
	data.list.foreach(function(item, i, arr){
		
	});
}