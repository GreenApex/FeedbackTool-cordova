app.controller('appController', ['$scope',
    'bootstrapService',
    '$cordovaFileTransfer',
    '$localStorage',
    '$ionicHistory',
    '$ionicLoading',
    '$state',
    '$cordovaToast',
    '$filter',
    '$log',
    '$ionicScrollDelegate',
    function($scope, bootstrapService, $cordovaFileTransfer, $localStorage, $ionicHistory, $ionicLoading, $state, $cordovaToast, $filter, $log, $ionicScrollDelegate) {
        $scope.itemsToDisplay = 10;
        $scope.isSearchResult;
        $ionicHistory.clearHistory();
        $scope.currentPageNumber = 0;
        $scope.nextPage = function() {
            if ($scope.currentPageNumber < ($scope.totalPages - 1)) {
                $scope.currentPageNumber++;
            }
            var start = $scope.currentPageNumber * $scope.itemsToDisplay;
            var end = start + $scope.itemsToDisplay - 1;
            $scope.comments = $scope.commentsAll.slice(start, end + 1);
            $ionicScrollDelegate.scrollTop([true]);

        };
        $scope.previousPage = function() {
            if ($scope.currentPageNumber > 0) {
                $scope.currentPageNumber--;
            }
            var start = $scope.currentPageNumber * $scope.itemsToDisplay;
            var end = start + $scope.itemsToDisplay - 1;
            $scope.comments = $scope.commentsAll.slice(start, end + 1);
            $ionicScrollDelegate.scrollTop([true]);

        };


        var makeFileName = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text + ".mp4";
        };
        $scope.searchForm = {
            searchText: null
        };
        $scope.formPageSearch = function() {
            $scope.searchResult = [];
            if ($scope.searchForm.searchText.length >= 1) {
                $scope.isSearchResult = true;
                angular.forEach($scope.commentsAll, function(value, key) {
                    if (value.commentsDetail.toLowerCase().indexOf($scope.searchForm.searchText.toLowerCase()) !== -1) {
                        $scope.searchResult.push(value);
                    }
                });

            } else {
                $scope.isSearchResult = false;
            }




        };
        $scope.messageForm = {
            message: null,
            filePath: null
        };

        $scope.logout = function() {
            delete $localStorage.userId;
            delete $localStorage.userName;
            $state.go("login");
            $ionicHistory.clearHistory();
        };
        $scope.submitMessage = function() {
            var messageSubmitError = 0;
            if ($scope.messageForm.message === null) {
                messageSubmitError++;
                console.log("message Can't Be Empty");
                $cordovaToast.showLongBottom("Message Required");
            }

            if (messageSubmitError === 0) {

                if ($scope.messageForm.filePath !== null) {
                    var dataToSubmit = {
                        filePath: $scope.filePathFromServer,
                        message: $scope.messageForm.message,
                        userId: $localStorage.userId
                    };
                    bootstrapService.submitMessage(dataToSubmit).then(function(data2) {
                        $log.info(data2);
                        $scope.messageForm.message = null;
                        $scope.messageForm.filePath = null;
                        $scope.filePathFromServer=null;
                        $scope.totalFileSize = 0;
                        $scope.uploaded = 0;
                        console.log(data2);

                        $ionicLoading.hide();
                        getAllComments();
                        $cordovaToast.showLongBottom("Message Posted Successfully.");




                    }).catch(function(error) {
                        console.log(error);
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom("Error");
                    });
                } else {
                    var dataToSubmit = {
                        filePath: "comments/NoImage.jpg",
                        message: $scope.messageForm.message,
                        userId: $localStorage.userId
                    };
                    $ionicLoading.show();
                    bootstrapService.submitMessage(dataToSubmit).then(function(data2) {

                        $scope.messageForm.message = null;
                        $scope.messageForm.filePath = null;

                        console.log(data2);

                        $ionicLoading.hide();
                        getAllComments();
                        $cordovaToast.showLongBottom("Message Posted Successfully.");




                    }).catch(function(error) {
                        console.log(error);
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom("Error");
                    });
                }



            }


        };
        $scope.resetForm = function() {
            $scope.messageForm.message = null;
            $scope.messageForm.filePath = null;
        };
        $scope.selectFile = function() {
            fileChooser.open(function(uri) {
                $cordovaToast.showLongBottom("File Selected");
                console.log("file choosen");
                $scope.messageForm.filePath = uri;
                $log.info(uri);
                $cordovaToast.showLongBottom("File Selected.");
                window.resolveLocalFileSystemURL(uri, function(entry) {
                    entry.file(function(filee) {
                        if (filee.type == "video/mp4") {
                            $scope.options = new FileUploadOptions();
                            $scope.options.fileKey = "file";
                            $scope.options.fileName = makeFileName();
                            $scope.options.mimeType = "video/mp4";
                            $scope.options.chunkedMode=true;
                        } else {
                            $scope.options = {};
                        }
                        document.addEventListener('deviceready', function() {
                            //$ionicLoading.show();
                            $cordovaFileTransfer.upload("http://feedbacktool-env.elasticbeanstalk.com/comments/uploadfile?file=", $scope.messageForm.filePath, $scope.options)
                                .then(function(result) {

                                    // Success!
                                    console.log(result);
                                    var output = JSON.parse(result.response);
                                    console.log(output.message);
                                    console.log(output.data);
                                    $scope.filePathFromServer=output.data.filepath;
                                    $cordovaToast.showShortBottom("File Uploaded Successfully");
                                }, function(err) {
                                    // Error
                                    //$ionicLoading.hide();
                                    console.log(err);
                                    $cordovaToast.showLongBottom("File Size exceeded.");
                                }, function(progress) {
                                    // constant progress updates
                                    $scope.totalFileSize = progress.total;
                                    $scope.uploaded = progress.loaded;
                                    //$log.info("total : ",progress.total, "Uploaded",progress.loaded);


                                });

                        }, false);
                    }, function() {
                        $cordovaToast.showLongBottom("File Extension Error");
                    });


                }, function(e) {

                    $cordovaToast.showLongBottom("File Read Error");

                });
            }, function(error) {
                $cordovaToast.showLongBottom("Error in File Selection");
                console.log("file choosen errro");
                $cordovaToast.showLongBottom("File Selection Error.");
            });
        };
        var getAllComments = function() {
            var d = new Date();
            var n = d.getTimezoneOffset();
            $ionicLoading.show();
            bootstrapService.getUserComments($localStorage.userId, n).then(function(data) {
                $scope.commentsAll = data.data;
                console.log($scope.commentsAll);
                $scope.numberOfData = $scope.commentsAll.length;
                if ($scope.numberOfData > $scope.itemsToDisplay) {
                    $scope.comments = $scope.commentsAll.slice(0, $scope.itemsToDisplay);
                } else {
                    $scope.comments = $scope.commentsAll;
                }
                if ($scope.numberOfData % ($scope.itemsToDisplay) === 0) {
                    $scope.totalPages = parseInt(($scope.numberOfData / $scope.itemsToDisplay), 10);
                } else {
                    $scope.totalPages = parseInt(($scope.numberOfData / $scope.itemsToDisplay), 10) + 1;
                }
                $ionicLoading.hide();
            }).catch(function(data) {
                console.log(data);
                $ionicLoading.hide();
            });
        };
        getAllComments();

        $scope.showMessageDetails1 = function(commentId) {
            $ionicLoading.show();
            bootstrapService.getCommentDetail(commentId).then(function(result) {
                console.log(result);
                bootstrapService.setMessageDetails(result.data);
                $ionicLoading.hide();
                $state.go("app.details1");
            }).catch(function(error) {
                $ionicLoading.hide();
            });
        };

    }
]);
