app.controller('messagesController', ['$scope',
    'bootstrapService',
    '$cordovaFileTransfer',
    '$localStorage',
    '$ionicHistory',
    '$ionicLoading',
    '$stateParams',
    '$state',
    '$ionicScrollDelegate',
    function($scope, bootstrapService, $cordovaFileTransfer, $localStorage, $ionicHistory, $ionicLoading, $stateParams, $state,$ionicScrollDelegate) {
        
        $scope.itemsToDisplay=10;
        $ionicHistory.clearHistory();
        $scope.currentPageNumber=0;
         $scope.nextPage = function() {
            if($scope.currentPageNumber<($scope.totalPages-1)){
                $scope.currentPageNumber++;
            }
            var start= $scope.currentPageNumber*$scope.itemsToDisplay;
            var end=start+$scope.itemsToDisplay-1;
            $scope.comments=$scope.dataRecieved.slice(start,end+1);
            $ionicScrollDelegate.scrollTop([true]);
            
        };
        $scope.previousPage = function() {
            if($scope.currentPageNumber>0){
                $scope.currentPageNumber--;
            }
            var start= $scope.currentPageNumber*$scope.itemsToDisplay;
            var end=start+$scope.itemsToDisplay-1;
            $scope.comments=$scope.dataRecieved.slice(start,end+1);
            $ionicScrollDelegate.scrollTop([true]);

        };

        $scope.showMessageDetails = function(commentId) {
            $ionicLoading.show();
            bootstrapService.getCommentDetail(commentId).then(function(result) {
                console.log(result);
                bootstrapService.setMessageDetails(result.data);
                $ionicLoading.hide();
                $state.go("app.details");
            }).catch(function(error) {
                $ionicLoading.hide();
            });
        };

        var getAllComments = function() {
            var d = new Date();
            var n = d.getTimezoneOffset();
            $ionicLoading.show();
            bootstrapService.getUserComments($localStorage.userId,n).then(function(data) {
                //$scope.comments = data.data;
                
                $scope.dataRecieved = data.data;
                $scope.numberOfData=$scope.dataRecieved.length;
                if($scope.numberOfData > $scope.itemsToDisplay){
                   $scope.comments=$scope.dataRecieved.slice(0,$scope.itemsToDisplay); 
                }else{
                    $scope.comments=$scope.dataRecieved;
                }
                if($scope.numberOfData%($scope.itemsToDisplay)===0){
                    $scope.totalPages=parseInt(($scope.numberOfData/$scope.itemsToDisplay),10);
                }else {
                    $scope.totalPages=parseInt(($scope.numberOfData/$scope.itemsToDisplay),10)+1;
                }
                



                $ionicLoading.hide();
            }).catch(function(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        };
        getAllComments();


    }
]);
