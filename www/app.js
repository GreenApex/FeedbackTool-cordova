// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive

        .state('login', {
            cache: false,
            url: '/login',
            templateUrl: 'components/login/login.html',
            controller: 'loginController'


        })
        .state('app', {
            cache: false,
            url: '/app',
            abstract: true,
            templateUrl: 'components/app/template.html',
            controller: 'appController'
        })
        .state('app.home', {
            cache: false,
            url: '/home',
            views: {
                'tab1': {
                    templateUrl: 'components/home/messageForm.html',
                    controller: 'appController'
                }
            }
        })
        .state('app.messages', {
            cache: false,
            url: '/messages',
            views: {
                'tab2': {
                    templateUrl: 'components/home/messageList.html',
                    controller: 'messagesController'
                }
            }
        })
        .state('app.details', {
            cache: false,
            url: '/details',
            views: {
                'tab2': {
                    templateUrl: 'components/home/messageDetail.html',
                    controller: 'messageDetailsController'
                }
            }
        }).state('app.details1', {
            cache: false,
            url: '/details1',
            views: {
                'tab1': {
                    templateUrl: 'components/home/messageDetail.html',
                    controller: 'messageDetailsController'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});

app.constant('$ionicLoadingConfig', {
    template: "<ion-spinner icon='spiral'></ion-spinner>",
    duration : "10000"
});
