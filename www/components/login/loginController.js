app.controller('loginController', ['$scope',
    '$http',
    '$state',
    'bootstrapService',
    '$localStorage',
    '$ionicLoading',
    '$cordovaToast',
    '$ionicHistory',
    function($scope, $http, $state, bootstrapService, $localStorage, $ionicLoading, $cordovaToast, $ionicHistory) {
        $ionicHistory.clearHistory();
        if ($localStorage.userId) {
            $state.go('app.home');
        }

        $scope.loginForm = {
            userName: null,
            password: null
        };
        $scope.doLogin = function() {
            var loginError = 0;
            if ($scope.loginForm.userName === null) {
                loginError++;
               $cordovaToast.showLongBottom("Username Required.");
            } else if ($scope.loginForm.password === null) {
                loginError++;
               $cordovaToast.showLongBottom("Password Required.");
            }
            if (loginError === 0) {
                $ionicLoading.show();
                bootstrapService.login($scope.loginForm.userName, $scope.loginForm.password).then(function(result) {
                    $ionicLoading.hide();
                    console.log(result);
                    if (result.message === "GA_AUTH_FAILED") {
                        console.log("User Authentication Failed");
                    $cordovaToast.showLongBottom("Authentication Failed.");
                        //insert Toast Here
                    }
                    if(result.message==="GA_TRANSACTION_OK") {
                        $cordovaToast.showLongBottom("Login Successful.");
                        $localStorage.userId = result.data.userId;
                        $localStorage.userName = result.data.userName;
                        $state.go('app.home');
                        
                    }

                }).catch(function(error) {
                    $ionicLoading.hide();
                    console.log(error);
                    console.log("Login Error Occured");
                    $cordovaToast.showLongBottom("Login Error");
                    //toast required
                });
            }


        };





    }
]);
