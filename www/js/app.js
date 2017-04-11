// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Autotek', ['ionic', 'CoreApi', 'starter.controllers', 'starter.directives', 'starter.services', '720kb.datepicker', 'ionic-timepicker', 'LocalStorageModule', 'ionic-datepicker','ngCordova'])

.run(function($ionicPlatform,localStorageService,$state,$rootScope) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.run(function($ionicPlatform,localStorageService,$state,$rootScope,$ionicHistory,$ionicViewSwitcher) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

    });
      $rootScope.navigate=function(state, params){
              var lang=  localStorageService.get('PageLangue');
              console.log(lang);
              if(lang=='en'){
                  if (params) {
                      $ionicViewSwitcher.nextDirection('forward');
                       $state.go(state, params)
                  }
                   else {
                       $ionicViewSwitcher.nextDirection('forward');
                        $state.go(state)
                   }
              }
              else{
                  if (params) {
                      $ionicViewSwitcher.nextDirection('forward');
                       $state.go(state + 'a', params)
                  }
                   else {
                       $ionicViewSwitcher.nextDirection('forward');
                        $state.go(state + 'a')
                   }
              }
            }

    $rootScope.logout = function() {
        localStorageService.remove("access_token");
        localStorageService.remove("loggedInUser");
        localStorageService.remove("userimage");
         $ionicHistory.clearCache();
        $state.go('home')
    }
})
.config(function($stateProvider, $urlRouterProvider) {
  

    $stateProvider
    .state('home', {
        templateUrl: "templates/home.html",
        url: "/home",
        controller: 'LoginCtrl'
    })

    .state('mapoffer', {
        templateUrl: "templates/mapoffer.html",
        url: "/mapoffer",
        controller: 'MapOfferCtrl'
    })


    .state('main', {
        templateUrl: "templates/main.html",
        url: "/main",
        controller: 'MainCtrl'
    })

    .state('agentmain', {
        templateUrl: "templates/agenthome.html",
        url: "/agentmain",
        controller: 'MainCtrl'
    })

    .state('about', {
        templateUrl: "templates/about.html",
        url: "/about"
    })

    .state('contact', {
        templateUrl: "templates/contact.html",
        url: "/contact",
        controller: "ContactCtrl"
    })

    .state('services', {
        templateUrl: "templates/services.html",
        url: "/services",
        controller:'ServicesCtrl'
    })

    .state('promotion', {
        templateUrl: "templates/promo_service.html",
        url: "/promotion",
        controller: 'PromotionEnglishCtrl'
    })

    .state('location', {
        templateUrl: "templates/location.html",
        url: "/location",
        controller: "LocationCtrl"
    })
    .state('readMore', {
        templateUrl: "templates/readmore.html",
        url: "/readmore/:id/:ln",
        controller: "ReadMoreCtrl"
         
    })

    .state('readMorea', {
        templateUrl: "templates/readmore.html",
        url: "/readmore/:id/:ln",
        controller: "ReadMoreCtrl"
         
    })



    .state('history', {
        templateUrl: "templates/history.html",
        url: "/history",
        controller: 'HistoryCtrl'
    })



    .state('appointmentreview', {
        templateUrl: "templates/appointment_review.html",
        url: "/appointreview",
        controller: "AppointReviewCtrl"
    })

    .state('appointconfirmed', {
        templateUrl: "templates/appoint_confirmed.html",
        url: "/appointconfirmed",
        controller: 'AppointConfimedCtrl'
    })

    .state('promotions', {
        templateUrl: "templates/promotions.html",
        url: "/promotions",
        controller: "PromotionEnglishCtrl"
    })

    .state('register', {
        templateUrl: "templates/signup.html",
        url: "/register",
        controller: 'SignupCtrl'
    })

    // .state('notifications', {
    //     templateUrl: "templates/notifications.html",
    //     url: "/notifications",
    //     controller: "NotificationCtrl"
    // })
    // English Routes

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/sidemenu.html",
    })

    .state('app.notifications', {
        url: "/notifications",
        views: {
            'menuContent': {
                templateUrl: "templates/notifications.html",
                controller: 'NotificationEnglishCtrl'
            }
        }
    })

    .state('app.booking', {
        url: "/booking",
        views: {
            'menuContent': {
                templateUrl: "templates/booking.html",
                controller: 'BookingCtrl'
            }
        }
    })
    .state('app.appointservice', {
        url: "/appointservice",
        views : {
            'menuContent' : {
                templateUrl: "templates/appointmentservice.html",
                controller: 'AppointServiceCtrl' 
            }
        }
        
    })
    .state('app.appointment', {
        url: "/appointment",
        views: {
            'menuContent': {
                templateUrl: "templates/appointment.html",
                controller: 'AppointmentCtrl'
            }
        }
    })

    .state('app.bookappointment', {
        url: "/bookappointment/:branchid",
        views: {
            'menuContent': {
                templateUrl: "templates/bookappointment.html",
                controller: 'BookAppointmentCtrl'
            }
        }
    })

    .state('app.salestat', {
        url: "/salestats",
        views: {
            'menuContent': {
                templateUrl: "templates/salestat.html",
                controller: 'SaleStatEnglihCtrl'
            }
        }
    })
      .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'settingsCtrl'
            }
        }
    })
    //arabic
       .state('app.settingsa', {
        url: "/settingsa",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/settings.html",
                controller: 'settingsCtrl'
            }
        }
    })
     .state('app.agentRegister', {
        url: "/agentRegister",
        views: {
            'menuContent': {
                templateUrl: "templates/saleAgentRegister.html",
                controller: 'SignupCtrl'
            }
        }
    })

    .state('app.earninghistory', {
        url: "/earninghistory",
        views: {
            'menuContent': {
                templateUrl: "templates/earninghistory.html",
                controller: 'EarnignHistory'
            }
        }
    })


    //Arabic Routes..

    .state('homea', {
        templateUrl: "arabicTemplates/home.html",
        url: "/homea",
        controller: 'LoginCtrl'
    })

    .state('maina', {
        templateUrl: "arabicTemplates/main.html",
        url: "/maina",
        controller: 'MainCtrl'
    })

    .state('agentmaina', {
        templateUrl: "arabicTemplates/agenthome.html",
        url: "/agentmaina",
        controller: 'MainCtrl'
    })

    .state('abouta', {
        templateUrl: "arabicTemplates/about.html",
        url: "/abouta"
    })

    .state('contacta', {
        templateUrl: "arabicTemplates/contact.html",
        url: "/contacta",
        controller: "ContactCtrl"
    })

    .state('servicesa', {
        templateUrl: "arabicTemplates/services.html",
        url: "/servicesa",
        controller: "ServicesCtrl"
    })

    .state('promotiona', {
        templateUrl: "arabicTemplates/promo_service.html",
        url: "/promotiona"
    })

    .state('locationa', {
        templateUrl: "arabicTemplates/location.html",
        url: "/locationa",
        controller: "LocationArabicCtrl"
    })



    .state('historya', {
        templateUrl: "arabicTemplates/history.html",
        url: "/historya",
        controller: 'HistoryCtrl'
    })



    .state('appointmentreviewa', {
        templateUrl: "arabicTemplates/appointment_review.html",
        url: "/appointreviewa",
        controller: "AppointReviewArabicCtrl"
    })

    .state('appointconfirmeda', {
        templateUrl: "arabicTemplates/appoint_confirmed.html",
        url: "/appointconfirmeda",
        controller: 'AppointConfimedCtrl'
    })
    

    .state('promotionsa', {
        templateUrl: "arabicTemplates/promotions.html",
        url: "/promotionsa",
        controller: "PromotionArabicCtrl"
    })

    .state('registera', {
        templateUrl: "arabicTemplates/signup.html",
        url: "/registera",
        controller: 'SignupCtrl'
    })

    // .state('notifications', {
    //     templateUrl: "templates/notifications.html",
    //     url: "/notifications",
    //     controller: "NotificationCtrl"
    // })

    .state('appa', {
        url: "/appa",
        abstract: true,
        templateUrl: "arabicTemplates/sidemenu.html",
    })

    .state('app.notificationsa', {
        url: "/notificationsa",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/notifications.html",
                controller: 'NotificationArabicCtrl'
            }
        }
    })

    .state('app.bookinga', {
        url: "/bookinga",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/booking.html",
                controller: 'BookingArabicCtrl'
            }
        }
    })
    
    .state('app.appointservicea', {
        url: "/appointservice",
        views : {
            'menuContent' : {
                templateUrl: "arabicTemplates/appointmentservice.html",
                controller: 'AppointServiceArabicCtrl' 
            }
        }
        
    })
    .state('app.appointmenta', {
        url: "/appointmenta",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/appointment.html",
                controller: 'AppointmentArabicCtrl'
            }
        }
    })

    .state('app.bookappointmenta', {
        url: "/bookappointmenta/:branchid",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/bookappointment.html",
                controller: 'BookAppointmentCtrl'
            }
        }
    })

    .state('app.salestata', {
        url: "/salestatsa",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/salestat.html",
                controller: 'SaleStatArabicCtrl'
            }
        }
    })

    .state('app.earninghistoraya', {
        url: "/earninghistorya",
        views: {
            'menuContent': {
                templateUrl: "arabicTemplates/earninghistory.html",
                controller: 'EarnignHistoryArabic'
            }
        }
    })

    $urlRouterProvider.otherwise('/home');

});
