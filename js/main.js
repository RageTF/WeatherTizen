
var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    openDB();
    
    $("#btn_search").bind("click", function(event, ui){
    	var cityName=$("#city_name").val();
    	getWeatherByName(cityName,onSuccess,onError,onComplete);
    });
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
};

var onSuccess = function(data) {
	$("#city_name_result").text(data.name);
	var temp=(data.main.temp - 273.15).toFixed(1);
	var image="http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
	$("#weather_image").attr("src", image);
	$("#weather_image").attr("height", 100);
	$("#weather_image").attr("width", 100);
	$("#current_temp").text(temp+" C");
}
var onError = function() {
	$("#city_name_result").text("Error");
}
var onComplete = function() {
}

$(document).bind( 'pageinit', init );
$(document).unload( unregister );


