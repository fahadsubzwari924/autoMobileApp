angular.module('starter.services', [])

.factory('Cities', ['$http', 'localStorageService', '$rootScope', function ($http, localStorageService, $rootScope) {
	var city = {};
	city.getCities = function() {
		var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1"; 
		
		var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
		$http.post(url, params, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		}).success(function(res){
			console.log("res is", res)
			$rootScope.clientAccessToken = res;
			var cityUrl = 'http://autotecapi.azurewebsites.net/api/Cities'
			$http.get(cityUrl , {
				headers: {
					'Authorization': "Bearer" + " " + res.access_token
				}
			}).success(function(result){
				console.log(result);
				city.cities = result;
				localStorageService.set("cities", city.cities);
			})
			.error(function(error) {
				console.log(error)
			})
		})
		.error(function(err) {
			console.log("err is", err)
		})
	}

	return city;
}])

.factory('CityBranchId', [function () {
	var final_obj = {};
	final_obj.set_cityid = function(id){
		final_obj.cityid = id;
	}
	final_obj.get_cityid = function() {
		return final_obj.cityid;
	}

	final_obj.set_branchid = function(id){
		final_obj.branchid = id;
	}
	final_obj.get_branchid = function() {
		return final_obj.branchid;
	}
	return final_obj;
}])

.factory('AppointmentDetail', [function () {
	
	var final_obj = {}

	final_obj.set = function(obj) {
		final_obj.values = obj;
	}

	final_obj.get = function() {
		return final_obj.values
	}

	return final_obj;
}])