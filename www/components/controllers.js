angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, bootstrapService, $cordovaFileTransfer, $localStorage) {
    //this controller is for messge page
    $scope.messageForm = {
        message: null
    };

    $scope.submitMessage = function() {
        var data1 = {
            message: $scope.messageForm.message,
            filePath: $scope.fileLocation
        };


        document.addEventListener('deviceready', function() {
            var options = {};
            $cordovaFileTransfer.upload("http://feedbacktool-env.elasticbeanstalk.com/comments/uploadfile?file=", data1.filePath, options)
                .then(function(result) {
                    // Success!
                    console.log(result);
                    var output=JSON.parse(result.response);
                    console.log(output.message);
                    console.log(output.data);
                    var dataToSubmit = {
                        filePath: output.data.filepath,
                        message: $scope.messageForm.message,
                        userId: $localStorage.userId
                    };
                    
                    bootstrapService.submitMessage(dataToSubmit).then(function(data2) {
                        $scope.messageForm.message = null;
                        console.log(data2);
                    }).catch(function(error) {
                        console.log(error);
                    });
                }, function(err) {
                    // Error
                    console.log(err);
                }, function(progress) {
                    // constant progress updates
                    console.log(progress);
                });

        }, false);


    };

    $scope.selectFile = function() {
        fileChooser.open(function(uri) {
            // $cordovaToast.showLongBottom("File Selected");
            console.log("file choosen");
            $scope.fileLocation = uri;
        }, function(error) {
            //$cordovaToast.showLongBottom("Error in File Selection");
            console.log("file choosen errro");
        });
    };
})

.controller('ChatsCtrl', function($scope, Chats, bootstrapService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
   


})

.controller('ChatDetailCtrl', function($scope, $stateParams, bootstrapService) {
    //$scope.chat = Chats.get($stateParams.chatId);
    bootstrapService.getCommentDetail($stateParams.chatId).then(function(data) {
        $scope.commentDetails = data.data;
        console.log(data);
    }).catch(function(data) {
        console.log(data);
    });


})
