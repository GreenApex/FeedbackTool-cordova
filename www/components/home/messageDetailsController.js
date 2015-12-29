app.controller('messageDetailsController', ['$scope',
    'bootstrapService',
    '$ionicHistory',
    '$ionicLoading',
    '$stateParams',
    function($scope, bootstrapService, $ionicHistory, $ionicLoading, $stateParams) {

        console.log("raj");
        $scope.messageDetails = bootstrapService.getMessageDetails();
        $scope.getIframeSrc = function(videoId) {
            return 'http://feedbacktool-env.elasticbeanstalk.com/' + videoId;
        };


    }
]);
app.filter('trustVideo', function ($sce) {
    return function(videoId) {
      return $sce.trustAsResourceUrl(videoId);
    };
  });