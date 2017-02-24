var database;
var version = 1.0;
var databaseName = "weather_data";
var databaseDisplayName = "Weather Database";
var databaseSize = 2 * 1024 * 1024;

var weatherDataTableName = "weather";

/*
 * Вызвать перед обращением к базе данных!
 */
function openDB() {
	database = openDatabase(databaseName, version, databaseDisplayName,
			databaseSize);
	database
			.transaction(function(transaction) {
				transaction
						.executeSql("CREATE TABLE IF NOT EXISTS "
								+ weatherDataTableName
								+ "(city_id TEXT PRIMARY KEY NOT NULL,city_name TEXT NOT NULL, city_weather TEXT);");
			});
}

/*
 * onSuccessInsert - вызывается при успешном добавлении. onSuccesInsert - при
 * неудачном добавлении.
 */

/*
 * Занести запись в базу данных. -- idCity - id города из JSON. -- nameCity -
 * название города. -- weatherCityJson - JSON объект.
 */
function putWeatherCity(idCity, nameCity, weatherCityJson, onSuccessInsert,
		onErrorInsert) {
	database
			.transaction(function(transaction) {
				transaction
						.executeSql(
								("INSERT INTO " + weatherDataTableName + " (city_id,city_name,city_weather) VALUES(?,?,?)"),
								[ idCity, nameCity, JSON.stringify(weatherCityJson) ],
								function() {
									onSuccessInsert(weatherCityJson);
								}, 
								function () {
									onErrorInsert(weatherCityJson);
								});
			});
}

/*
 * OnSuccessCallback(result) вызывается при успешном обращении к базе данных. --
 * result - данные полученные в результате запроса.
 * 
 * OnErrorCallback вызывается при неудачном запросе. Или если по запросу ничего не найдено!
 */

/*
 * Получить погоду города по id.
 */
function getWeatherFromDatabaseByCityId(idCity, onSuccessCallback,
		onErrorCallback) {
	database.transaction(function(transaction) {
		transaction.executeSql(
				("SELECT * FROM " + weatherDataTableName + " WHERE city_id=?"),
				[ idCity ], function(transaction, results) {
					var count = results.rows.length;
					if (count > 0) {
						onSuccessCallback(results);
					} else {
						onErrorCallback();
					}
				}, onErrorCallback);
	});
}

/*
 * Получить все записи о погоде из базы данных.
 */
function getWeatherFromDatabase(onSuccessCallback, onErrorCallback) {
	database.transaction(function(transaction) {
		transaction.executeSql(("SELECT * FROM " + weatherDataTableName), [],
				function(transaction, results) {
					var count = results.rows.length;
					if (count > 0) {
						onSuccessCallback(results);
					} else {
						onErrorCallback();
					}

				}, onErrorCallback);
	});
}

/*
 * Все понятно! Обновляем записи в базе данных!
 * бновляет JSON города оп id;
 */
function updateWeatherByCityId(idCity, weatherJSON, onSuccessUpdate,onErrorUpdate) {
	database.transaction(function(transaction) {
				transaction.executeSql(
								("UPDATE " + weatherDataTableName + " SET city_weather=? WHERE city_id=?"),
								[ weatherJSON, idCity ], onSuccessUpdate,
								onErrorUpdate);
			});
}

/*
 * Удаляет из БД по ID. В onSuccessDelete и onErrorDelete приходя id удаляемого города.
 * 
 */

function removeWeatherByCityId(idCity,onSuccessDelete,onErrorDelete){
	database.transaction(function(transaction) {
		transaction.executeSql(
						("DELETE FROM " + weatherDataTableName + " WHERE city_id=?"),
						[idCity], 
						function(){
							onSuccessDelete(cityId);
						},
						function(){
							onErrorDelete(cityId);
						});
	});
}