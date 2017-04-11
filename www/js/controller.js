angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $rootScope, $state, User, PormotionsOffers, localStorageService, $ionicLoading, $ionicPopup, Cities) {
    $scope.user = {};
    //$scope.user.username = '0557613133';
    //$scope.user.password = '123456';
    // $scope.user.username='966';
    // $scope.changeUsername=function(){
    //     if($scope.user.username.indexOf('966')!==0){
    //         $scope.user.username="966";
    //     }
    // }
    Cities.getCities();
   

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        // handle event
        console.log("local storage data", localStorageService.get("loggedInUser"));
        if (localStorageService.get("loggedInUser") != null) {
            $rootScope.navigate("main")
        }

    });


    //var params = "grant_type=password&username=0557613133&password=123456&client_id=Android02&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1"

    $scope.login = function(data) {
            console.log(data)
            localStorageService.remove("access_token");
            localStorageService.remove("loggedInUser");
            localStorageService.remove("userimage");
            var params = {
                'grant_type': 'password',
                'username': $scope.user.username,
                'password': $scope.user.password,
                'client_id': 'Android02',
                'client_secret': '21B5F798-BE55-42BC-8AA8-0025B903DC3B',
                'scope': 'app1'
            };
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            console.log("params", params)
            User.login(params).success(function(res) {
                    //console.log(res);

                    if (localStorageService.isSupported) {
                        localStorageService.set("access_token", res.access_token);
                        User.getUser().success(function(res) {
                                //console.log(res)
                                $ionicLoading.hide();
                                loggedInUser = { user: res }
                                console.log("result user is ", res)
                                $rootScope.name = res.FirstName;
                                localStorageService.set("loggedInUser", loggedInUser);
                                if (res.UnMappedCouponCount > 0) {
                                    //$state.go('agentmain');
                                    console.log("in if")
                                    $rootScope.navigate('mapoffer')
                                } else {
                                    // $state.go('main');
                                    console.log("in else")
                                    $rootScope.navigate('main')
                                }

                            })
                            .error(function(err) {
                                console.log(err);
                                PormotionsOffers.getSaleAgent().success(function(res) {
                                        loggedInUser = { user: res }
                                        $rootScope.name = res.FirstName;
                                        localStorageService.set("loggedInUser", loggedInUser);
                                        console.log(res);
                                        $ionicLoading.hide();
                                        $rootScope.navigate('agentmain')
                                    })
                                    .error(function(err) {
                                        $ionicLoading.hide();
                                    })

                            })
                            //
                    }
                })
                .error(function(err) {
                    //console.log(err);
                    $ionicLoading.hide();
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Error',
                        template: 'Invalid Username/Password!'
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            //console.log('You are sure');
                        } else {
                            //console.log('You are not sure');
                        }
                    });
                })
        }
        //$scope.get_value=function(lng){
        //  console.log(lng);
    $scope.obj = {};
    if (localStorageService.get("PageLangue") != null) {
        $scope.obj.lng = localStorageService.get("PageLangue") == "ar" ? true : false;
    } else {
        localStorageService.set('PageLangue', 'en');
    }

    $scope.get_value = function(value1) {
        console.log($scope.obj.lng)
        if ($scope.obj.lng) {
            localStorageService.set('PageLangue', 'ar');
        } else {
            localStorageService.set('PageLangue', 'en');
        }

    }

    //  }

    $scope.go = function(language) {
        console.log(language)
        localStorageService.set('PageLangue', language);
    }

})

.controller('MapOfferCtrl',function($scope, User, $ionicLoading) {

    $ionicLoading.show();
    User.getUnmapped().success(function(res) {
        if(res.length>0) {
                $scope.offers = {
            selectedOption: { Id: res[0].Id, Description_EN: res[0].Description_EN },
            availableOptions: res
        }    
        }
        

        User.customerVehicles().success(function(res) {
            console.log("vahicels",res)
            if (res.length > 0) {
                $scope.vehicles = {
                selectedOption: { Id: res[0].Id, ChassisNumber: res[0].ChassisNumber },
                availableOptions: res
            }
            }
            
            $ionicLoading.hide();
        })
        .error(function(err) {
            $ionicLoading.hide();

        })
    })
    .error(function(err) {
        console.log("Err")
        $ionicLoading.hide();

    })



    $scope.final_obj = {};

    $scope.registerVehicle = function() {
         $ionicLoading.show();
        User.addVehicle($scope.final_obj).success(function(res) {
                User.getUnmapped().success(function(res) {
            console.log("Res",res[0].Description_EN)
        $scope.offers = {
            selectedOption: { Id: res[0].Id, Description_EN: res[0].Description_EN },
            availableOptions: res
        }

        User.customerVehicles().success(function(res) {
            console.log("vahicels",res)
            $scope.vehicles = {
                selectedOption: { Id: res[0].Id, ChassisNumber: res[0].ChassisNumber },
                availableOptions: res
            }
            $ionicLoading.hide();
            $scope.final_obj = {};
            $scope.showAlertVehicle(true);
        })
        .error(function(err) {
            $ionicLoading.hide();
            $scope.showAlertVehicle(false);
        })
    })
    .error(function(err) {
        console.log("Err")
        $ionicLoading.hide();
        $scope.showAlertVehicle(false);
    })
        })
        .error(function(err) {
             $scope.showAlertVehicle(false);
        });
    }

    $scope.isShowing = false;
    $scope.showForm = function() {
        $scope.isShowing = !$scope.isShowing ;
    }

    $scope.mapOffer =function() {
        var params = { Id: $scope.offers.selectedOption.Id, CustomerVehicleId: $scope.vehicles.selectedOption.Id};

        User.mapOffer(params).success(function(res) {
            console.log("succefully added",res)
            $scope.showAlert(true);
        })
        .error(function(err) {
            console.log("error added",err)
            $scope.showAlert(error);
        })
    }

            // An alert dialog
 $scope.showAlert = function(check) {
   var alertPopup = $ionicPopup.alert({
     title: check == true ? 'success!' : 'error!',
     template:  check == true ? 'offer mapped successfully!' : 'there is some error. please try again!'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };

             // An alert dialog
 $scope.showAlertVehicle = function(check) {
   var alertPopup = $ionicPopup.alert({
     title: check == true ? 'success!' : 'error!',
     template:  check == true ? 'Vehicle is succuessfully added.' : 'there is some error. please try again!'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
})

.controller('NotificationEnglishCtrl', ['$scope', '$ionicSideMenuDelegate', 'PormotionsOffers', function($scope, $ionicSideMenuDelegate, PormotionsOffers) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    //  PormotionsOffers.getNotifications().success(function(data){
    //     console.log(data) 
    // })
    $scope.notification = [];
    var pageNumber = 0;
    var pageSize = 4;

    $scope.noMoreNotification = true;
    $scope.getMoreNotification = function(start) {
        var _start = start || false
        PormotionsOffers.getNotifications(pageNumber, pageSize).success(function(res) {
                console.log(res);
                if (_start) {
                    $scope.notification = [];
                }
                if (res.length < pageSize) {
                    $scope.noMoreNotification = false;
                }
                for (var i = 0; i < res.length; i++) {
                    var date = new Date(res[i].UpdatedOn);
                    $scope.notification.push({
                        year: date.getFullYear(),
                        date: date.getDate(),
                        month: monthname(date.getMonth()),
                        Title_EN: res[i].Title_EN,
                        Description_EN: res[i].Description_EN,

                    })

                }

                pageNumber = pageNumber + 1;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$scope.$apply()
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

            })
            .error(function(err) {
                console.log(err);
            })
    }

    $scope.getMoreNotification();

}])



.controller('NotificationArabicCtrl', ['$scope', '$ionicSideMenuDelegate', 'PormotionsOffers', function($scope, $ionicSideMenuDelegate, PormotionsOffers) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    //  PormotionsOffers.getNotifications().success(function(data){
    //     console.log(data)
    // })
    $scope.notification = [];
    var pageNumber = 0;
    var pageSize = 4;

    $scope.noMoreNotification = true;
    $scope.getMoreNotification = function(start) {
        var _start = start || false
        PormotionsOffers.getNotifications(pageNumber, pageSize).success(function(res) {
                console.log(res);
                if (_start) {
                    $scope.notification = [];
                }
                if (res.length < pageSize) {
                    $scope.noMoreNotification = false;
                }
                for (var i = 0; i < res.length; i++) {
                    var date = new Date(res[i].UpdatedOn);
                    $scope.notification.push({
                        year: date.getFullYear(),
                        date: date.getDate(),
                        month: monthname(date.getMonth()),
                        Title_AR: res[i].Title_AR,
                        Description_AR: res[i].Description_AR
                    })

                }

                pageNumber = pageNumber + 1;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$scope.$apply()
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

            })
            .error(function(err) {
                console.log(err);
            })
    }

    $scope.getMoreNotification();

}])

.controller('LocationCtrl', function($scope, localStorageService, Appointment, $ionicLoading) {
    var cities = localStorageService.get('cities')
    $scope.cities = {
        selectedOption: { CityId: 1, CityName: "Riyadh" },
        availableOptions: cities
    }
       
    
    $scope.branches = {};
    icon = 'img/icon-location.png';
    $ionicLoading.show();
    Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
            console.log(JSON.stringify(res));
            $scope.branches = {
                selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                availableOptions: res
            };
            var objlatlong = { lat: +res[0].Latitude, lng: +res[0].Longitude }
            initMap(objlatlong)
            $ionicLoading.hide();
            console.log(objlatlong);

        })
        .error(function(err) {
            console.log(err);
        })

          $scope.openMap = function() {
              console.log('mapp')
        if (ionic.Platform.isIOS())
            window.open("http://maps.apple.com/?ll=24.441347,39.6197453&near=24.441347,39.6197453", '_system', 'location=yes')
        else
            window.open("geo:24.441347,39.6197453", '_system', 'location=yes')
    }
    $scope.hasChanged = function() {
        console.log($scope.cities.selectedOption)
        $ionicLoading.show();
        Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                console.log(res);
                $scope.branches = {
                    selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                    availableOptions: res
                };
                var objlatlong = { lat: +res[0].Latitude, lng: +res[0].Longitude }
                initMap(objlatlong)
                $ionicLoading.hide();
            })
            .error(function(err) {
                console.log(err);
            })
    }

    function initMap(searchObject) {
        console.log("in init map")
        latLng = new google.maps.LatLng(24.721189, 46.6664953);
        var mapOptions = {
            center: searchObject,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [{ "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#f7f1df" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#d0e3b4" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.medical", "elementType": "geometry", "stylers": [{ "color": "#fbd3da" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#bde6ab" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffe15f" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#efd151" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "black" }] }, { "featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{ "color": "#cfb2db" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a2daf2" }] }]
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: searchObject,
            icon: icon,
        });
    }
    //initMap({lat: 24.7136, lng: 46.6753});
})

.controller('LocationArabicCtrl', function($scope, localStorageService, Appointment, $ionicLoading) {
    var cities = localStorageService.get('cities')
    $scope.cities = {
        selectedOption: { CityId: 1, CityName: "Riyadh" },
        availableOptions: cities
    }
    $scope.branches = {};
    icon = 'img/icon-location.png';
    $ionicLoading.show();
    Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
            console.log(JSON.stringify(res));
            $scope.branches = {
                selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                availableOptions: res
            };
            var objlatlong = { lat: +res[0].Latitude, lng: +res[0].Longitude }
            initMap(objlatlong)
            $ionicLoading.hide();
        })
        .error(function(err) {
            console.log(err);
        })


    $scope.hasChanged = function() {
        console.log($scope.cities.selectedOption)
        $ionicLoading.show();
        Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                console.log(res);
                $scope.branches = {
                    selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                    availableOptions: res
                };
                var objlatlong = { lat: +res[0].Latitude, lng: +res[0].Longitude }
                initMap(objlatlong)
                $ionicLoading.hide();
            })
            .error(function(err) {
                console.log(err);
            })
    }

    function initMap(searchObject) {
        console.log("in init map")
        latLng = new google.maps.LatLng(24.721189, 46.6664953);
        var mapOptions = {
            center: searchObject,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [{ "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#f7f1df" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#d0e3b4" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.medical", "elementType": "geometry", "stylers": [{ "color": "#fbd3da" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#bde6ab" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffe15f" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#efd151" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "black" }] }, { "featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{ "color": "#cfb2db" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a2daf2" }] }]
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: searchObject,
            icon: icon,
        });
    }
    //initMap({lat: 24.7136, lng: 46.6753});
})

.controller('BookAppointmentCtrl', function($scope, $state, $http, $ionicModal, CityBranchId, Appointment, ionicTimePicker, $stateParams, AppointmentDetail, $rootScope, localStorageService, $ionicLoading) {
        console.log(CityBranchId.get_cityid());
        console.log(CityBranchId.get_branchid());
        var current_date = new Date();
        console.log($stateParams.branchid);
        $scope.dateobj = {};
        $scope.dateobj.date = current_date;
        $scope.hours = 00;
        $scope.minutes = 00;
        $scope.ampm = "AM";
        //console.log(date);
        var getdate = current_date.getDate()
        var month = current_date.getMonth();
        var year = current_date.getFullYear();
        var branchid = $stateParams.branchid;
        $ionicLoading.show();
        Appointment.getAvailableDays(branchid, year, month + 1).success(function(res) {
                console.log(res);
                Appointment.getAvailableSlots(branchid, year, month + 1, getdate).success(function(result) {
                        console.log(result)
                        $rootScope.$broadcast('AVAILABLEDAYS',{data: result}); 
                        $ionicLoading.hide();
                    })
                    .error(function(error) {
                        console.log(error)
                        $ionicLoading.hide();
                    })
            })
            .error(function(err) {
                console.log(err)
                $ionicLoading.hide();
            })

        var ipObj1 = {
            callback: function(val) { //Mandatory
                console.log(val)
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    var selectedTime = new Date(val * 1000);
                    console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                    var hh = selectedTime.getUTCHours();
                    var h = hh;
                    dd = "AM";
                    if (h >= 12) {
                        h = hh - 12;
                        dd = "PM";
                    }
                    if (h == 0) {
                        h = 12;
                    }
                    $scope.hours = h < 10 ? ("0" + h) : h;
                    var mm = selectedTime.getUTCMinutes();
                    $scope.minutes = mm < 10 ? ("0" + mm) : mm;
                    $scope.ampm = dd;
                }
            },
            inputTime: 50400, //Optional
            format: 12, //Optional
            step: 1, //Optional
            setLabel: 'Set' //Optional
        };
        $scope.openTimePicker = function() {
           $scope.modal.show();
        }

  $ionicModal.fromTemplateUrl('templates/timemodal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $rootScope.$on('AVAILABLEDAYS', function(event, args) {
    console.log("args ", args)
    $scope.timeslots = [];
    if (args.data != "OffDay") {
        for (var i=0; i<args.data.length; i++) {
            $scope.timeslots.push(args.data[i]);
            $scope.timeslots[i].isChecked = false;
        }
        $scope.timeslots[0].isChecked = true;
        $scope.hours = $scope.timeslots[0].StartTimeStr.substr(0,2);
        $scope.minutes =  $scope.timeslots[0].StartTimeStr.substr(3,2);
        $scope.ampm =$scope.timeslots[0].StartTimeStr.substr(6,2);
        $scope.appointdate = $scope.timeslots[0].AppointmentDate.substr(0,10);
        $scope.starttime = $scope.timeslots[0].StartTime.substr(0,10) + " " +   $scope.timeslots[i].StartTimeStr;
        $scope.endtime = $scope.timeslots[0].EndTime.substr(0,10) + " " +   $scope.timeslots[i].EndTimeStr;
    }

    
  })

  $scope.closemodal = function() {
    $scope.modal.hide();
        for (var i=0; i<$scope.timeslots.length; i++) {
            if ($scope.timeslots[i].isChecked) {
                $scope.hours = $scope.timeslots[i].StartTimeStr.substr(0,2);
                $scope.minutes =  $scope.timeslots[i].StartTimeStr.substr(3,2);
                $scope.ampm =$scope.timeslots[i].StartTimeStr.substr(6,2);
                $scope.appointdate = $scope.timeslots[i].AppointmentDate.substr(0,10);
                $scope.starttime = $scope.timeslots[i].StartTime.substr(0,10) + " " +   $scope.timeslots[i].StartTimeStr;
                $scope.endtime = $scope.timeslots[i].EndTime.substr(0,10) + " " +   $scope.timeslots[i].EndTimeStr;
            }
        }
  }

  $scope.selectTime= function(index) {
        for (var i=0; i<$scope.timeslots.length; i++) {
            if (i == index) {
                $scope.timeslots[i].isChecked = true;
            }
            else {
                $scope.timeslots[i].isChecked = false;
            }
            
        }

  }
        $scope.book = function() {
            console.log("scope.date", $scope.dateobj.date)
            $rootScope.navigate('app.appointservice')
            localStorageService.set("AppointmentSlot", {
                BranchId: $stateParams.branchid,
                AppointmentDate : $scope.appointdate,
                StartTime: $scope.starttime,
                EndTime: $scope.endtime
            })
            // var date = new Date($scope.dateobj.date);
            // AppointmentDetail.set({
            //     startTime: $scope.hours + ":" + $scope.minutes + " " + $scope.ampm,
            //     location: CityBranchId.get_branchid().BranchName,
            //     day: dayname(date.getDay()),
            //     date: date.getDate(),
            //     month: monthname(date.getMonth())
            // })
        }



    })

.controller('AppointServiceCtrl', function($scope, User, $ionicLoading, localStorageService, Appointment,  $ionicPopup, $rootScope) {
        $ionicLoading.show();
        $scope.final_obj = {};
        $scope.final_obj.AppointmentSlot = localStorageService.get('AppointmentSlot');
        User.customerVehicles().success(function(res) {
            console.log("vahicels",res)
            if (res.length > 0) {
                $scope.vehicles = {
                selectedOption: { Id: res[0].Id, ChassisNumber: res[0].ChassisNumber },
                availableOptions: res
            }
            }
            
            $ionicLoading.hide();
        })
        .error(function(err) {
            $ionicLoading.hide();

        })
             $scope.isShowing = false;
                $scope.showForm = function() {
                $scope.isShowing = !$scope.isShowing ;
    }

     $scope.final_obj = {};

    $scope.registerVehicle = function() {
         $ionicLoading.show();
        User.addVehicle($scope.final_obj).success(function(res) {
            //  $ionicLoading.hide();
                User.getUnmapped().success(function(res) {
                     $ionicLoading.hide();
            console.log("Res",res[0].Description_EN)
        $scope.offers = {
            selectedOption: { Id: res[0].Id, Description_EN: res[0].Description_EN },
            availableOptions: res
        }

        User.customerVehicles().success(function(res) {
            console.log("vahicels",res)
            $scope.vehicles = {
                selectedOption: { Id: res[0].Id, ChassisNumber: res[0].ChassisNumber },
                availableOptions: res
            }
            $ionicLoading.hide();
            $scope.final_obj = {};
            $scope.showAlertVehicle(true);
        })
        .error(function(err) {
            $ionicLoading.hide();
            $scope.showAlertVehicle(false);
        })
    })
    .error(function(err) {
        console.log("Err")
        $ionicLoading.hide();
        $scope.showAlertVehicle(false);
    })
        })
        .error(function(err) {
             $scope.showAlertVehicle(false);
        });
    }
        $scope.book = function() {
            $scope.final_obj.CustomerVehicleId = $scope.vehicles.selectedOption.Id;
            $ionicLoading.show();
            Appointment.schedule($scope.final_obj).success(function(res) {
                $ionicLoading.hide();
                $scope.showAlert(true);
            })
            .error(function(err) {
                $ionicLoading.hide();
                $scope.showAlert(false);
            })
        }

        // An alert dialog
 $scope.showAlert = function(check) {
   var alertPopup = $ionicPopup.alert({
     title: check == true ? 'Success!' : 'Error!',
     template: check == true ? 'Your appointment is in process and will receive a confirmation message shortly!' : 'Appointment slot is not available.'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
     if (check) {
        $rootScope.navigate('main')  
     }
   });
 };
    })

.controller('AppointServiceArabicCtrl', function($scope, User, $ionicLoading, localStorageService, Appointment,  $ionicPopup, $rootScope) {
        $ionicLoading.show();
        $scope.final_obj = {};
        $scope.final_obj.AppointmentSlot = localStorageService.get('AppointmentSlot');
        User.customerVehicles().success(function(res) {
            console.log("vahicels",res)
            if (res.length > 0) {
                $scope.vehicles = {
                selectedOption: { Id: res[0].Id, ChassisNumber: res[0].ChassisNumber },
                availableOptions: res
            }
            }
            
            $ionicLoading.hide();
        })
        .error(function(err) {
            $ionicLoading.hide();

        })

        $scope.book = function() {
            $scope.final_obj.CustomerVehicleId = $scope.vehicles.selectedOption.Id;
            $ionicLoading.show();
            Appointment.schedule($scope.final_obj).success(function(res) {
                $ionicLoading.hide();
                $scope.showAlert(true);
            })
            .error(function(err) {
                $ionicLoading.hide();
                $scope.showAlert(false);
            })
        }

        // An alert dialog
 $scope.showAlert = function(check) {
   var alertPopup = $ionicPopup.alert({
     title: check == true ? 'نجاح!' : 'خطأ!',
     template: check == true ? 'موعدك قيد المعالجة وسوف تتلقى رسالة تأكيد قريبا!' : 'موعد التعيين غير متاح.'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
     if (check) {
        $rootScope.navigate('main')  
     }
   });
 };
    })
    ///arabic BookAppointmentArabicCtrl
.controller('BookAppointmentArabicCtrl', function($scope, $state, $http, $ionicModal, CityBranchId, Appointment, ionicTimePicker, $stateParams, AppointmentDetail, $rootScope, localStorageService, $ionicLoading) {
        console.log(CityBranchId.get_cityid());
        console.log(CityBranchId.get_branchid());
        var current_date = new Date();
        console.log($stateParams.branchid);
        $scope.dateobj = {};
        $scope.dateobj.date = current_date;
        $scope.hours = 00;
        $scope.minutes = 00;
        $scope.ampm = "AM";
        //console.log(date);
        var getdate = current_date.getDate()
        var month = current_date.getMonth();
        var year = current_date.getFullYear();
        var branchid = $stateParams.branchid;
        $ionicLoading.show();
        Appointment.getAvailableDays(branchid, year, month + 1).success(function(res) {
                console.log(res);
                Appointment.getAvailableSlots(branchid, year, month + 1, getdate).success(function(result) {
                        console.log(result)
                        $rootScope.$broadcast('AVAILABLEDAYS',{data: result}); 
                        $ionicLoading.hide();
                    })
                    .error(function(error) {
                        console.log(error)
                        $ionicLoading.hide();
                    })
            })
            .error(function(err) {
                console.log(err)
                $ionicLoading.hide();
            })

        var ipObj1 = {
            callback: function(val) { //Mandatory
                console.log(val)
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    var selectedTime = new Date(val * 1000);
                    console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                    var hh = selectedTime.getUTCHours();
                    var h = hh;
                    dd = "AM";
                    if (h >= 12) {
                        h = hh - 12;
                        dd = "PM";
                    }
                    if (h == 0) {
                        h = 12;
                    }
                    $scope.hours = h < 10 ? ("0" + h) : h;
                    var mm = selectedTime.getUTCMinutes();
                    $scope.minutes = mm < 10 ? ("0" + mm) : mm;
                    $scope.ampm = dd;
                }
            },
            inputTime: 50400, //Optional
            format: 12, //Optional
            step: 1, //Optional
            setLabel: 'Set' //Optional
        };
        $scope.openTimePicker = function() {
           $scope.modal.show();
        }

  $ionicModal.fromTemplateUrl('templates/timemodal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $rootScope.$on('AVAILABLEDAYS', function(event, args) {
    console.log("args ", args)
    $scope.timeslots = [];
    if (args.data != "OffDay") {
        for (var i=0; i<args.data.length; i++) {
            $scope.timeslots.push(args.data[i]);
            $scope.timeslots[i].isChecked = false;
        }
        $scope.timeslots[0].isChecked = true;
        $scope.hours = $scope.timeslots[0].StartTimeStr.substr(0,2);
        $scope.minutes =  $scope.timeslots[0].StartTimeStr.substr(3,2);
        $scope.ampm =$scope.timeslots[0].StartTimeStr.substr(6,2);

        $scope.appointdate = $scope.timeslots[0].AppointmentDate.substr(0,10);
        $scope.starttime = $scope.timeslots[0].StartTime.substr(0,10) + " " +   $scope.timeslots[i].StartTimeStr;
        $scope.endtime = $scope.timeslots[0].EndTime.substr(0,10) + " " +   $scope.timeslots[i].EndTimeStr;
    }

    
  })

  $scope.closemodal = function() {
    $scope.modal.hide();
        for (var i=0; i<$scope.timeslots.length; i++) {
            if ($scope.timeslots[i].isChecked) {
                $scope.hours = $scope.timeslots[i].StartTimeStr.substr(0,2);
                $scope.minutes =  $scope.timeslots[i].StartTimeStr.substr(3,2);
                $scope.ampm =$scope.timeslots[i].StartTimeStr.substr(6,2);
                $scope.appointdate = $scope.timeslots[i].AppointmentDate.substr(0,10);
                $scope.starttime = $scope.timeslots[i].StartTime.substr(0,10) + " " +   $scope.timeslots[i].StartTimeStr;
                $scope.endtime = $scope.timeslots[i].EndTime.substr(0,10) + " " +   $scope.timeslots[i].EndTimeStr;
            }
        }
  }

  $scope.selectTime= function(index) {
        for (var i=0; i<$scope.timeslots.length; i++) {
            if (i == index) {
                $scope.timeslots[i].isChecked = true;
            }
            else {
                $scope.timeslots[i].isChecked = false;
            }
            
        }

  }
        $scope.book = function() {
            console.log("scope.date", $scope.dateobj.date)
            $rootScope.navigate('app.appointservice')
            localStorageService.set("AppointmentSlot", {
                BranchId: $stateParams.branchid,
                AppointmentDate : $scope.appointdate,
                StartTime: $scope.starttime,
                EndTime: $scope.endtime
            })
            // var date = new Date($scope.dateobj.date);
            // AppointmentDetail.set({
            //     startTime: $scope.hours + ":" + $scope.minutes + " " + $scope.ampm,
            //     location: CityBranchId.get_branchid().BranchName,
            //     day: dayname(date.getDay()),
            //     date: date.getDate(),
            //     month: monthname(date.getMonth())
            // })
        }



    })
    .controller('MainCtrl', ['$scope', 'localStorageService', '$state', '$rootScope', '$ionicHistory','$cordovaCamera', '$ionicActionSheet', function($scope, localStorageService, $state, $rootScope, $ionicHistory, $cordovaCamera, $ionicActionSheet) {
        try {
            $scope.user = localStorageService.get("loggedInUser").user;
            console.log(localStorageService.get("loggedInUser"))
            $scope.AgentData = localStorageService.get("loggedInUser").user
            $scope.userImage1 = localStorageService.get("userimage");
            console.log("asdasdasd", $scope.AgentData);
            $rootScope.agentPromokeydata=$scope.AgentData;
        } catch (err) {

        }
        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            // handle event
            if ($state.current.name == "main" && localStorageService.get("PageLangue") == "ar") {
                console.log("in state arabic")
                $ionicHistory.clearCache().then(function() { $state.go('maina') })
            }


            if ($state.current.name == "maina" && localStorageService.get("PageLangue") == "en") {
                console.log("in state english")
                $ionicHistory.clearCache().then(function() { $state.go('main') })
            }
        });
             $scope.imageClickCamera = function() {


            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var imgData = "data:image/jpeg;base64," + imageURI;
                // var image = document.getElementById('myImage');
                $scope.userImage1 = imgData;
                localStorageService.set('userimage', $scope.userImage1);
            }, function(err) {
                // error
            });
        }

        $scope.imageClickGallery = function() {


            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var imgData = "data:image/jpeg;base64," + imageURI;
                $scope.userImage1 = imgData;
                localStorageService.set('userimage', $scope.userImage1);
                // var image = document.getElementById('myImage');

            }, function(err) {
                // error
            });

        }

        $scope.show = function() {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Gallery' },
                    { text: 'Camera' }
                ],
                //  destructiveText: 'Delete',
                titleText: 'Choos Picture Options',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.imageClickGallery();
                    } else if (index == 1) {
                        $scope.imageClickCamera();
                    }
                    return true;
                }
            });

        };

    }])

.controller('PromotionEnglishCtrl', ['$scope', 'PormotionsOffers', '$ionicLoading', function($scope, PormotionsOffers, $ionicLoading) {
    //promocode facaebook sharing functtion..
    $scope.facebookshare = function() {
            //     if(ionic.Platform.isIOS())
            //     {
            //         window.plugins.socialsharing.shareVia('com.apple.social.facebook', 'Message via FB', null, null, null, function(){console.log('share ok') 
            //         PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //         })
            //         .error(function(err){
            //     console.log(err)
            // })
            //         }, function(msg) {alert('error: ' + msg)})
            //     }    
            //     else
            //     {
            //         window.plugins.socialsharing.shareVia('facebook', 'Message via FB', null, null, null, function(){console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //         })
            //         .error(function(err){
            //     console.log(err)
            // })
            //             }, function(msg) {alert('error: ' + msg)})
            //     }
            window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */ , null /* url */ , function() { console.log('share ok') }, function(errormsg) { alert(errormsg) })

        }
        //promocode facaebook sharing functtion end..

    //promocode twitter sharing function start
    $scope.twittershare = function() {
            // if(ionic.Platform.isIOS()){
            //     window.plugins.socialsharing.shareVia('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.x-services.nl',
            //      function(){
            //             console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //             })
            //             .error(function(err){
            //                 console.log(err)
            //             })
            //         },
            //          function(msg)
            //           {
            //               alert('error: ' + msg)
            //             })
            // }
            // else{
            //      window.plugins.socialsharing.shareVia('twitter', 'Message via Twitter', null, null, 'http://www.x-services.nl',
            //      function(){
            //             console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //             })
            //             .error(function(err){
            //                 console.log(err)
            //             })
            //         },
            //          function(msg)
            //           {
            //               alert('error: ' + msg)
            //             })
            // }

            window.plugins.socialsharing.shareVia('com.twitter.android', 'Message via Twitter', null, null, 'http://www.x-services.nl', function() { console.log('share ok') }, function(msg) { alert('error: ' + msg) })
        } //promocode twitter sharing function end..

    //promocode pinterest & googlePlus sharing function start.. 
    $scope.othershare = function() {
            window.plugins.socialsharing.share('Message only',
                function(res) {
                    PormotionsOffers.getPromoCode().success(function(res) {
                            console.log('sucess' + res);
                        })
                        .error(function(err) {
                            console.log(err)
                        })
                })
        } //promocode pinterest & googlePlus sharing function end..


    //calling consumed offers api
    // PormotionsOffers.getConsumedOffers().success(function(data){
    // console.log("OFFER DATA",data);
    // })  //consumed api end..
    //calling promocode api...
    //     PormotionsOffers.getPromoCode().success(function(res){
    //     console.log(res)
    //     })
    //     .error(function(err){
    //     console.log(err)
    // })
    //promocode api end...
    $scope.nextOfferDate = [];
    $scope.consumedOfferDate = [];
    $ionicLoading.show();
    PormotionsOffers.getNextOffers().success(function(res) {
            console.log(res)
            for (var i = 0; i < res.length; i++) {
                $scope.nextOfferDate.push({
                    Description_EN: res[i].Description_EN
                })
            }
            PormotionsOffers.getConsumedOffers().success(function(res) {
                    console.log("consumer", res)
                    if (res > 0) {
                        $scope.data = res;
                    } else {
                        $scope.data = 'no data';
                    }
                    $ionicLoading.hide();
                })
                .error(function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                })
        })
        .error(function(err) {
            console.log(err);
            $ionicLoading.hide();
        })


}])


.controller('PromotionArabicCtrl', ['$scope', 'PormotionsOffers', '$ionicLoading', function($scope, PormotionsOffers, $ionicLoading) {
    //promocode facaebook sharing functtion..
    $scope.facebookshare = function() {
            //     if(ionic.Platform.isIOS())
            //     {
            //         window.plugins.socialsharing.shareVia('com.apple.social.facebook', 'Message via FB', null, null, null, function(){console.log('share ok') 
            //         PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //         })
            //         .error(function(err){
            //     console.log(err)
            // })
            //         }, function(msg) {alert('error: ' + msg)})
            //     }    
            //     else
            //     {
            //         window.plugins.socialsharing.shareVia('facebook', 'Message via FB', null, null, null, function(){console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //         })
            //         .error(function(err){
            //     console.log(err)
            // })
            //             }, function(msg) {alert('error: ' + msg)})
            //     }
            window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */ , null /* url */ , function() { console.log('share ok') }, function(errormsg) { alert(errormsg) })

        }
        //promocode facaebook sharing functtion end..

    //promocode twitter sharing function start
    $scope.twittershare = function() {
            // if(ionic.Platform.isIOS()){
            //     window.plugins.socialsharing.shareVia('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.x-services.nl',
            //      function(){
            //             console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //             })
            //             .error(function(err){
            //                 console.log(err)
            //             })
            //         },
            //          function(msg)
            //           {
            //               alert('error: ' + msg)
            //             })
            // }
            // else{
            //      window.plugins.socialsharing.shareVia('twitter', 'Message via Twitter', null, null, 'http://www.x-services.nl',
            //      function(){
            //             console.log('share ok')
            //             PormotionsOffers.getPromoCode().success(function(res){
            //                 console.log(res);
            //             })
            //             .error(function(err){
            //                 console.log(err)
            //             })
            //         },
            //          function(msg)
            //           {
            //               alert('error: ' + msg)
            //             })
            // }

            window.plugins.socialsharing.shareVia('com.twitter.android', 'Message via Twitter', null, null, 'http://www.x-services.nl', function() { console.log('share ok') }, function(msg) { alert('error: ' + msg) })
        } //promocode twitter sharing function end..

    //promocode pinterest & googlePlus sharing function start.. 
    $scope.othershare = function() {
            window.plugins.socialsharing.share('Message only',
                function(res) {
                    PormotionsOffers.getPromoCode().success(function(res) {
                            console.log('sucess' + res);
                        })
                        .error(function(err) {
                            console.log(err)
                        })
                })
        } //promocode pinterest & googlePlus sharing function end..


    //calling consumed offers api
    // PormotionsOffers.getConsumedOffers().success(function(data){
    // console.log("OFFER DATA",data);
    // })  //consumed api end..
    //calling promocode api...
    //     PormotionsOffers.getPromoCode().success(function(res){
    //     console.log(res)
    //     })
    //     .error(function(err){
    //     console.log(err)
    // })
    //promocode api end...
    $scope.nextOfferDate = [];
    $scope.consumedOfferDate = [];
    $ionicLoading.show();
    PormotionsOffers.getNextOffers().success(function(res) {
            console.log(res)
            for (var i = 0; i < res.length; i++) {
                $scope.nextOfferDate.push({
                    Description_AR: res[i].Description_AR
                })
            }
            PormotionsOffers.getConsumedOffers().success(function(res) {
                    console.log("consumed", res)
                    if (res > 0) {
                        $scope.data = res;
                    } else {
                        $scope.data = 'no data';
                    }
                    $ionicLoading.hide();
                })
                .error(function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                })
        })
        .error(function(err) {
            console.log(err);
            $ionicLoading.hide();
        })




}])


.controller('SignupCtrl', ['$scope', '$rootScope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($scope, $rootScope, $http, $ionicPopup, $state, $ionicLoading) {
    $scope.user = {};
    $scope.user.MobileNumber = +966
    $scope.user.User = {};
    $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';
    //  $scope.user.MobileNumber='966';
    // $scope.changeUsername=function(){
    //     if($scope.user.MobileNumber.indexOf('966')!==0){
    //         $scope.user.MobileNumber="966";
    //     }
    // }
    $scope.register = function() {
        console.log($scope.user)

        var errors = [];
        if ($scope.user.FirstName == null || $scope.user.FirstName == "") {
            errors.push({ message: 'Name is required' })
        }

        if ($scope.user.MobileNumber == null || $scope.user.MobileNumber == "") {
            errors.push({ message: 'Number is required' })
        }

        if ($scope.user.EmailAddress == null || $scope.user.EmailAddress == "") {
            errors.push({ message: 'Email is required' });
        } else {
            var email = $scope.user.EmailAddress.match($scope.regex);
            if (email == null) {
                errors.push({ message: 'Not a valid email' });
            }
        }

        if ($scope.user.User.Password == null || $scope.user.User.Password == "") {
            errors.push({ message: 'Password is required' })
        }




        if (errors.length != 0) {
            $scope.deactivate(errors)

        } else {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            $scope.user.User.UserName = $scope.user.MobileNumber;
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $http.post(url, params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(result) {
                    $http.post('http://autotecapi.azurewebsites.net/api/CustomerRegistration', $scope.user, {
                            headers: {
                                'Authorization': "Bearer" + " " + result.access_token
                            }
                        }).success(function(res) {
                            console.log(res);
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success!',
                                template: 'A verication key is sent through SMS!'
                            });

                            alertPopup.then(function(res) {
                                $rootScope.navigate('home')
                                    //console.log('Thank you for not eating my delicious ice cream cone');
                            });
                        })
                        .error(function(err) {
                            var error = [{ message: err.Message }]

                            $ionicLoading.hide();
                            $scope.deactivate(error)
                        })
                })
                .error(function(error) {

                    $ionicLoading.hide();
                })
                //$ionicSlideBoxDelegate.slide(index);

        }
    }

    $scope.deactivate = function(err) {
        $scope.data = {};
        $scope.data.err = err;
        var confirmPopup = $ionicPopup.confirm({
            title: 'We cant sign you up! ',
            templateUrl: 'templates/errorpopup.html',
            scope: $scope
        });

        confirmPopup.then(function(res) {
            if (res) {
                //console.log('You are sure');
            } else {
                //console.log('You are not sure');
            }
        });
    }

}])

.controller('AppointConfimedCtrl', function($scope, $ionicHistory, $state, $rootScope) {
    $scope.gohome = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $rootScope.navigate('main')
    }
})

.controller('HistoryCtrl', ['$scope', 'User', function($scope, User) {
    $scope.history = [];
    var pageNumber = 0;
    var pageSize = 4;

    $scope.noMoreHistory = true;
    $scope.getMoreHistory = function(start) {
        var _start = start || false
        User.getOrderHistory(pageNumber, pageSize).success(function(res) {

                if (_start) {
                    $scope.history = [];
                }
                if (res.length < pageSize) {
                    $scope.noMoreHistory = false;
                }
                for (var i = 0; i < res.length; i++) {
                    var date = new Date(res[i].OrderDate);
                    $scope.history.push({
                        year: date.getFullYear(),
                        date: date.getDate(),
                        month: monthname(date.getMonth()),
                        SalesOrderNumber: res[i].SalesOrderNumber,
                        TotalAmount: res[i].TotalAmount,
                        TotalItems: res[i].TotalItems
                    })

                }
                pageNumber = pageNumber + 1;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$scope.$apply()
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

            })
            .error(function(err) {
                console.log(err);
            })
    }
}])

.controller('ContactCtrl', function($scope) {
    $scope.openMap = function() {
        if (ionic.Platform.isIOS())
            window.open("http://maps.apple.com/?ll=24.441347,39.6197453&near=24.441347,39.6197453", '_system', 'location=yes')
        else
            window.open("geo:24.441347,39.6197453", '_system', 'location=yes')
    }

    $scope.openWeb = function() {
        var ref = cordova.InAppBrowser.open('http://www.autoteksa.com/', '_blank', 'location=yes');
    }

})

.controller('SaleStatEnglihCtrl', function($scope, ionicDatePicker, $ionicPlatform, PormotionsOffers) {
        $scope.finalObject = {};
        var month = monthname(1);
        $scope.showdate = month + ', ' + 2017;

        PormotionsOffers.getSaleStats(2017, 2).success(function(res) {
                $scope.finalObject.MonthlyConversion = res.MonthlyConversion;
                $scope.finalObject.MonthlyReferrals = res.MonthlyReferrals;
            })
            .error(function(err) {
                console.log(err);
            })
        var year;
        var ipObj1 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getSaleStats(year, date.getMonth() + 1).success(function(res) {
                        $scope.finalObject.MonthlyConversion = res.MonthlyConversion;
                        $scope.finalObject.MonthlyReferrals = res.MonthlyReferrals;
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };



        var month = monthname(1);
        $scope.showdate1 = month + ', ' + 2017;

        PormotionsOffers.getSaleStats(2017, 2).success(function(res) {
                $scope.finalObject.LifeTimeReferrals = res.LifeTimeReferrals;
                $scope.finalObject.LifeTimeConversion = res.LifeTimeConversion;
                console.log($scope.finalObject.LifeTimeReferrals)
            })
            .error(function(err) {
                console.log(err);
            })

        //// second date picker function
        var ipObj2 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate1 = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getSaleStats(year, date.getMonth() + 1).success(function(res) {
                        $scope.finalObject.LifeTimeReferrals = res.LifeTimeReferrals;
                        $scope.finalObject.LifeTimeConversion = res.LifeTimeConversion;
                        console.log($scope.finalObject.LifeTimeReferrals)
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker1 = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

    })
    // setting Controller English
    .controller('settingsCtrl', function($scope, localStorageService, $cordovaCamera, $ionicActionSheet, $timeout) {

        $scope.user = localStorageService.get("loggedInUser").user;
        console.log($scope.user)
        $scope.userImage = localStorageService.get("userimage");
        //console.log(userImage)
        $scope.user.ContactNumber = parseInt($scope.user.ContactNumber);
        $scope.user.Password = "*************";
        $scope.obj = {};
        $scope.obj1 = {};
        if (localStorageService.get("PageLangue") != null) {
            $scope.obj.lng = localStorageService.get("PageLangue") == "ar" ? true : false;
        } else {
            localStorageService.set('PageLangue', 'en');
        }

        $scope.get_value = function(value1) {
            console.log($scope.obj.lng)
            if ($scope.obj.lng) {
                localStorageService.set('PageLangue', 'ar');
            } else {
                localStorageService.set('PageLangue', 'en');
            }

        }

        $scope.imageClickCamera = function() {


            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var imgData = "data:image/jpeg;base64," + imageURI;
                // var image = document.getElementById('myImage');
                $scope.userImage = imgData;
                localStorageService.set('userimage', $scope.userImage);
            }, function(err) {
                // error
            });
        }

        $scope.imageClickGallery = function() {


            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var imgData = "data:image/jpeg;base64," + imageURI;
                $scope.userImage = imgData;
                localStorageService.set('userimage', $scope.userImage);
                // var image = document.getElementById('myImage');

            }, function(err) {
                // error
            });

        }


        $scope.show = function() {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Gallery' },
                    { text: 'Camera' }
                ],
                //  destructiveText: 'Delete',
                titleText: 'Choos Picture Options',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.imageClickGallery();
                    } else if (index == 1) {
                        $scope.imageClickCamera();
                    }
                    return true;
                }
            });

        };
        //

    })
    .controller('EarnignHistory', function($scope, localStorageService, ionicDatePicker, $ionicPlatform, PormotionsOffers) {
        var ipObj2 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

    })
    // arabic 
    .controller('EarnignHistoryArabic', function($scope, localStorageService, ionicDatePicker, $ionicPlatform, PormotionsOffers) {
        var ipObj2 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

    })
    .controller('SaleStatArabicCtrl', function($scope, ionicDatePicker, $ionicPlatform, PormotionsOffers) {
        $scope.finalObject = [];
        var year;
        var ipObj1 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getSaleStats(year, date.getMonth() + 1).success(function(res) {
                        $scope.finalObject.MonthlyConversion = res.MonthlyConversion;
                        $scope.finalObject.MonthlyReferrals = res.MonthlyReferrals;
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        //// second date picker function
        var ipObj2 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                var date = new Date(val);
                year = date.getFullYear();
                var month = monthname(date.getMonth());
                $scope.showdate1 = month + ', ' + year;
                console.log(month)
                PormotionsOffers.getSaleStats(year, date.getMonth() + 1).success(function(res) {
                        $scope.finalObject.LifeTimeReferrals = res.LifeTimeReferrals;
                        $scope.finalObject.LifeTimeConversion = res.LifeTimeConversion;
                        console.log($scope.finalObject.LifeTimeReferrals)
                    })
                    .error(function(err) {
                        console.log(err);
                    })
                PormotionsOffers.getEarningHistory(year).success(function(res) {
                        console.log(res)
                        console.log('hello')
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            },
            disabledDates: [ //Optional
                new Date(2016, 2, 16),
                new Date(2015, 3, 16),
                new Date(2015, 4, 16),
                new Date(2015, 5, 16),
                new Date('Wednesday, August 12, 2015'),
                new Date("08-16-2016"),
                new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2050, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [0], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker1 = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };
    })
    .controller('AppointmentCtrl', function($scope, Cities,PormotionsOffers, Appointment, CityBranchId, $state, localStorageService, $rootScope, $ionicLoading, $ionicModal) {
        console.log(Cities.cities)
        var cities = localStorageService.get('cities')
        $scope.cities = {
            selectedOption: { CityId: 1, CityName: "Riyadh" },
            availableOptions: cities
        }
        // getting cities through api//
        $scope.getCities=[];
        $scope.cityId="";
        $scope.getCityId=function(){
            console.log( $scope.cityId)
        }
        PormotionsOffers.gettCities().success(function(res){
              for (var i = 0; i < res.length; i++) {
                    $scope.getCities.push({
                        CityId : res[i].CityId,
                        CityName: res[i].CityName,

                    })
                }
                
        })
        .error(function(err){
            console.log(err);
        })

          $scope.selectCity= function(index) {
        for (var i=0; i<$scope.getCities.length; i++) {
            if (i == index) {
                $scope.getCities[i].isChecked = true;
            }
            else {
                $scope.getCities[i].isChecked = false;
            }
            
        }

  }
        $scope.branches = {};
        $ionicLoading.show();
        Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                console.log(res);
                $ionicLoading.hide();
                $scope.branches = {
                    selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                    availableOptions: res
                };
            })
            .error(function(err) {
                console.log(err);
                $ionicLoading.hide();
            })
                  $scope.openCitiesPicker = function() {
           $scope.modal.show();
        }

        $ionicModal.fromTemplateUrl('templates/citiesModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
            $scope.closemodal = function() {
                $scope.modal.hide();
      }
        $scope.hasChanged = function() {
            console.log($scope.cities.selectedOption)
            $ionicLoading.show();
            Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                    console.log(res);
                    $ionicLoading.hide();
                    $scope.branches = {
                        selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                        availableOptions: res
                    };
                })
                .error(function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                })
        }

        $scope.next = function() {
            CityBranchId.set_cityid($scope.cities.selectedOption.CityId);
            CityBranchId.set_branchid($scope.branches.selectedOption);
            $rootScope.navigate('app.bookappointment', { branchid: $scope.branches.selectedOption.Id })
                // $state.go()
                // $scope.cities = Cities.cities;
        }


    })
    /// arabic AppointmentArabicCtrl

    .controller('AppointmentArabicCtrl', function($scope, Cities, Appointment, CityBranchId, $state, localStorageService, $rootScope, $ionicLoading) {
        console.log(Cities.cities)
        var cities = localStorageService.get('cities')
        $scope.cities = {
            selectedOption: { CityId: 1, CityName: "Riyadh" },
            availableOptions: cities
        }
        $scope.branches = {};
        $ionicLoading.show();
        Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                console.log(res);
                $ionicLoading.hide();
                $scope.branches = {
                    selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                    availableOptions: res
                };
            })
            .error(function(err) {
                console.log(err);
                $ionicLoading.hide();
            })


        $scope.hasChanged = function() {
            console.log($scope.cities.selectedOption)
            $ionicLoading.show();
            Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                    console.log(res);
                    $ionicLoading.hide();
                    $scope.branches = {
                        selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                        availableOptions: res
                    };
                })
                .error(function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                })
        }

        $scope.next = function() {
            CityBranchId.set_cityid($scope.cities.selectedOption.CityId);
            CityBranchId.set_branchid($scope.branches.selectedOption);
            $rootScope.navigate('app.bookappointment', { branchid: $scope.branches.selectedOption.Id })
                // $state.go()
                // $scope.cities = Cities.cities;
        }


    })
    .controller('BookingCtrl', ['$scope', 'Appointment', '$ionicLoading', function($scope, Appointment, $ionicLoading) {
        console.log('helo')
        $scope.appointments = [];
        var pageNumber = 0;
        var pageSize = 4;
        $scope.isappoinment = true;
        $scope.noMoreAppointment = true;
        $scope.getMoreAppointment = function(start) {
            console.log("hello")
            var _start = start || false
            Appointment.get(pageNumber, pageSize).success(function(res) {

                    if (res.length > 0) {
                        $scope.isappoinment = false;
                        console.log(res)
                        console.log("app",res)
                        if (_start) {
                            $scope.appointments = [];
                        }
                        if (res.length < pageSize) {
                            $scope.noMoreAppointment = false;
                        }
                        for (var i = 0; i < res.length; i++) {
                            var date = new Date(res[i].AppointmentDate);
                            $scope.appointments.push({ startTime: res[i].StartTimeStr, location: res[i].BranchName, day: dayname(date.getDay()), date: date.getDate(), month: monthname(date.getMonth()) })
                        }
                        pageNumber = pageNumber + 1;
                        if (_start) {
                            $scope.$broadcast('scroll.refreshComplete');
                            //$scope.$apply()
                        } else {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }
                })
                .error(function(err) {
                    console.log(err)
                })
        }
        $scope.getMoreAppointment();
    }])
    // arabic
    .controller('BookingArabicCtrl', ['$scope', 'Appointment', '$ionicLoading', function($scope, Appointment, $ionicLoading) {
        console.log('helo')
        $scope.appointments = [];
        var pageNumber = 0;
        var pageSize = 4;
        $scope.isappoinment = true;
        $scope.noMoreAppointment = true;
        $scope.getMoreAppointment = function(start) {
            console.log("hello")
            var _start = start || false
            Appointment.get(pageNumber, pageSize).success(function(res) {
                    if (res.length > 0) {
                        $scope.isappoinment = false;
                        console.log(res)
                        if (_start) {
                            $scope.appointments = [];
                        }
                        if (res.length < pageSize) {
                            $scope.noMoreAppointment = false;
                        }
                        for (var i = 0; i < res.length; i++) {
                            var date = new Date(res[i].AppointmentDate);
                            $scope.appointments.push({ startTime: res[i].StartTimeStr, location: res[i].BranchName, day: dayname(date.getDay()), date: date.getDate(), month: monthname(date.getMonth()) })
                        }
                        pageNumber = pageNumber + 1;
                        if (_start) {
                            $scope.$broadcast('scroll.refreshComplete');
                            //$scope.$apply()
                        } else {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }
                })
                .error(function(err) {
                    console.log(err)
                })
        }
        $scope.getMoreAppointment();
    }])

.controller('AppointReviewCtrl', function($scope, AppointmentDetail, $rootScope) {
        console.log('dsj')
        $scope.gotostate = function() {
            console.log('helo')
            $rootScope.navigate('appointconfirmed')
        }
        console.log(AppointmentDetail.get())
        $scope.x = AppointmentDetail.get()

    })
    //arabic
    .controller('AppointReviewArabicCtrl', ['$scope', 'AppointmentDetail', function($scope, AppointmentDetail) {
        console.log(AppointmentDetail.get())
        $scope.x = AppointmentDetail.get()
    }])
    .controller('MapController', function($scope, $ionicLoading) {

        google.maps.event.addDomListener(window, 'load', function() {
            var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            navigator.geolocation.getCurrentPosition(function(pos) {
                map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                var myLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                    map: map,
                    title: "My Location"
                });
            });

            $scope.map = map;
        });

    })

.controller('ServicesCtrl', function($scope, $rootScope) {
    $scope.readMorePage = function(id, ln) {
        $rootScope.navigate('readMore', { id: id, ln: ln })
    }
})

.controller("ReadMoreCtrl", function($scope, $stateParams) {
    console.log($stateParams)
    if ($stateParams.ln != "") {
        if ($stateParams.id == 1) {
            $scope.title = "أفلام تظليل النوافذ"
            $scope.txt = `<div class="color-white">النوافذ تعتبر أفلام تظليل النوافذ من النوع الذي لم يسمع به حتى اليوم، وهنالك الكثير من الشركات التي تدعي بأنها تقدم مثل هذه الخدمات. ولكن الشيء الذي يجعل تظليل النوافذ لدى “”أوتوتيك”” فريدا من نوعه هو استخدام “”أوتوتيك”” الواضح لتقنية النانو المتقدمة للسيراميك.

وتنحدر جذور تقنية النانو المتقدمة في السيراميك لدى “”أوتوتيك”” من جذور ألمانية. وتنتج “”أوتوتيك”” أفلام تبدو شفافة تقريبا، ولكنها في الوقت نفسه تحجب حرارة الأشعة فوق البنفسجية والأشعة تحت الحمراء الخطرة. وتصنع أفلام “أوتوتيك” بجودة عالية ويتم تمصميمها للتعامل مع الظروف القاسية. كذلك فإن أفلام “أوتوتيك” تمنع من حدوث الأضرار في المناطق المعرضة لحطام الطريق مثل الحصى والفضلات الطبيعية والبقع والغبار والكثير من الأضرار الأخرى. والأهم من ذلك فإن أفلام السيراميك من “أوتوتيك” بتقنية النانو مصممة خصيصا لتكون سهلة الاستعمال. وبعبارة أخرى، فإن السيارة التي يتم عليها تركيب فيلم السيراميك من “أوتوتيك” بتقنية النانو لن يكوون لديها أي مشكلة في استقبال أي نوع من أنواع الإشارات وبالتالي سيكون الإرسال الإذاعي واضح بنسبة مائة في المائة (100٪ ) وكذلك إشارات نظام تحديد المواقع الجغرافية (“جي.بيه.إس.”)، خلافا لمنتجات أفلام العزل من العلامات التجارية الأخرى.</div>`
        }
        if ($stateParams.id == 2) {
            $scope.title = "طلاء حماية الهيكل"
            $scope.txt = `<div class="color-white">نحن نعرف أنك تحب سيارتك! ونعلم أيضا أنك تحب عائلتك، وبالتالي فإنك سوف تفعل كل ما في وسعك لحمايتهم في داخل السيارة وعلى الطريق. ونحن نقدر مشاعرك وبالتالي فإننا قمنا بعرض المنتج الذي يهدف إلى مساعدتك وجعل حياتك أكثر أمانا. وقد “

أطلقنا على هذا المنتج  اسم “الحماية المضاعفة (أوكسي) بتقينة النانو ”
وتمتلك حماية “أوكسي” بتقنية النانو مقاومة قوية حائزة على القبول حيث تمت عليها إجراءات اختبار صعبة. ويأخذ طلاء الحماية “أوكسي” بتقنية النانو تدبيرا إضافيا لحماية الجميع داخل السيارة في الوقت الذي يساعد فيه على الحفاظ على سيارتك لتبدو وكأنها جديدة من الخارج أيضا. وتدافع حماية “أوكسي” بتقنية النانو من “أوتوتيك” عن سيارتك ضد أي شيء يقذفه الطريق على سيارتك أثناء رحلتك، بما في ذلك الحصى الصغيرة على الطريق والرمل والطين ويحميها من الخدوش الرئيسية وذلك للمساعدة على الحفاظ على جعل السيارة تبدو جديدة ولامعة.</div>`
        }
        if ($stateParams.id == 3) {
            $scope.title = "النظافة الدقيقة للسيارة"
            $scope.txt = `<div class="color-white">تعتبر النظافة المهنية الدقيقة في غاية الأهمية بالنسبة لأي سيارة. لذلك فإن الحفاظ على فحص منتظم على سيارتك من الخارج والداخل يؤثر ليس فقط على مظهر السيارة ولكن على جعلها في نفس الوقت في وضع صالح للاستخدام. فالأوساخ والبقع والغبار تأتي وتستقر في تلك الأجزاء الصغيرة من سيارتك من الداخل أو الخارج وهي أشياء من المستحيل أن نراها في بعض الأحيان. وتمكن عملية نظافة “أوتوتيك” الخارجية من تنظيف هذه الأوساخ التي يصعب رؤيتها. ولمعالجة تلك المناطق التي يصعب رؤية الأوساخ فيها تستخدم “أوتوتيك” تقنية تبخير قوية للغاية تسمى ” تقينة “نانو سونيك” و”نانو إكستريم” لحماية سيارتك تماما من الداخل والخارج.</div>`
        }


    } else {
        if ($stateParams.id == 1) {
            $scope.title = "Window Tinting";
            $scope.txt = `<div class="color-white">Window films is not unheard of today and there are a lot of companies that are claiming to provide such services. What makes Window Tinting at Autotek unique is its explicit use of advanced Nano ceramic technology.

<br/> 
<br/>The Autotek Nano ceramic technology stems from its German roots. Autotek produces films that are virtually clear and at the same time block out dangerous UV and IR heat. Autotek films are made from high quality designed to handle extreme conditions. The Autotek films also prevent damage to areas vulnerable to road debris, nature, stains, dust and more. Most importantly the Autotek Nano ceramic films are especially designed to be user friendly. In other words, a car with Autotek Nano ceramic film will not have difficulty receiving any types of signals and will therefore have clear radio and 100% GPS signals, unlike other brands products.</div>
<br/><br/>

<div class="color-red">Autotek ensures that: “Your Car Deserves the Best”</div>
<br/>
<div class="color-white">What is your personal style? How do you want your car to look? Cool? Hot? Autotek window tint can make this happen instantly! Tell us your style and we will tint your car accordingly!</div>
`
        }

        if ($stateParams.id == 2) {
            $scope.title = "Body Protection";
            $scope.txt = `<div class="color-white">We know you love your car!  We also know that you love your family, and you will do everything you can to protect them at home and on the road. We value your feelings hence we have introduced a product which offer’s to help you, to make your life a little safer. We call it “ Nano Oxi protection “
<br/><br/>
Nano Oxi protection has super strong resistance acceptability and has gone through tough testing procedures. Nano Oxi protection coating takes an extra measure of protection for everyone inside your car while helping to keep your car looking new longer on the outside as well. Autotek’s Nano Oxi protection defends your vehicle against anything the road throws your way, including small road debris, sand, mud and key scratches to help preserve the car’s shiny new look.

<br/><br/>
<b>With fantastic Autotek products and services, and the very best warranties, Autotek is the perfect choice to take your vehicle protection to the next level.</b>
<br/>Oxi Protection offers 3 different type of layers which gives your car a complete protection for life.</div>`
        }

        if ($stateParams.id == 3) {
            $scope.title = "Auto Detailing";
            $scope.txt = `<div class="color-white">Professional detailing is extremely important for any automobile. Maintaining a regular check on your car exterior and interior, it not only effects the look of your car but the working condition of your car as well. Dirt, stains, dust comes and settles in such small parts of your car inside or outside which sometimes is impossible to see.
<br/><br/>
Autotek exterior detailing process gets those areas clean. To tackle those area’s Autotek uses its Highly powerful steaming technology called “Nano Sonic and Nano Xtreme technology “to completely protect your car inside and outside.
 <br/><br/>
Nano Sonic technology Is an intense exterior steaming service which uses an effective technology that kills all type of bacteria as well as cleans all type of dirt, stain, etc. Through high pressure Hot Steam, you and your family always remain safe because your car has just been “Sonicfied” from Nano Sonic service.</div>`
        }
    }

})

function dayname(day) {
    if (day == 0) {
        return 'Sunday';
    } else if (day == 1) {
        return 'Monday'
    } else if (day == 2) {
        return 'Tuesday'
    } else if (day == 3) {
        return 'Wednesday'
    } else if (day == 4) {
        return 'Thursday'
    } else if (day == 5) {
        return 'Friday'
    } else if (day == 6) {
        return 'Saturday'
    }
}

function monthname(month) {
    if (month == 0) {
        return 'January';
    } else if (month == 1) {
        return 'February';
    } else if (month == 2) {
        return 'March';
    } else if (month == 3) {
        return 'April';
    } else if (month == 4) {
        return 'May';
    } else if (month == 5) {
        return 'June';
    } else if (month == 6) {
        return 'July';
    } else if (month == 7) {
        return 'August';
    } else if (month == 8) {
        return 'September';
    } else if (month == 9) {
        return 'October';
    } else if (month == 10) {
        return 'November';
    } else if (month == 11) {
        return 'December';
    }
}
