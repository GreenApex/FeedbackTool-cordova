app.factory('bootstrapService', function($http, $q, $localStorage) {

    var isUserLoggedIn = false;
    var loggedInUser = null;
    var messageDetails = null;

    function login(userName, password) {
        var deferred = $q.defer();
        $http.get("http://feedbacktool-env.elasticbeanstalk.com/user/auth?username=" + userName + "&password=" + password).success(function(data) {
            if (data === "GA_AUTH_FAILED") {

            } else {
                isUserLoggedIn = true;
                loggedInUser = data.data;
            }
            deferred.resolve(data);
        }).error(function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    function isUserLoggedIn() {
        return isUserLoggedIn;
    }

    function getLoggedInUser() {
        return loggedInUser;
    }

    function submitMessage(details) {
        var deferred = $q.defer();
        $http.post("http://feedbacktool-env.elasticbeanstalk.com/comments/addcomments?filePath=" + details.filePath + "&comments=" + details.message + "&userId=" + details.userId)
            .success(function(data) {
                console.log(data);
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    function getUserComments(userId,timeZoneOffset) {
        var t=timeZoneOffset*(-1);
        var deferred = $q.defer();
        $http.get(" http://feedbacktool-env.elasticbeanstalk.com/comments/getallcomments?userId=" + userId+"&userTime="+t)
            .success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    function getCommentDetail(commentId) {
        var d = new Date();
        var n = d.getTimezoneOffset();
        var t=n*(-1);
        var deferred = $q.defer();
        $http.get("http://feedbacktool-env.elasticbeanstalk.com/comments/getcommentbyid?commentId=" + commentId+"&userTime="+t)
            .success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    function setMessageDetails(details) {
        messageDetails = details;
    }
    function getMessageDetails(){
        return messageDetails;
    }
    return {
        login: login,
        isUserLoggedIn: isUserLoggedIn,
        getLoggedInUser: getLoggedInUser,
        submitMessage: submitMessage,
        getUserComments: getUserComments,
        getCommentDetail: getCommentDetail,
        setMessageDetails:setMessageDetails,
        getMessageDetails :getMessageDetails

    };

});
app.filter('fileType', function() {
    return function(fileName) {
        if (fileName.indexOf('mp4') === -1) {
            return true;
        } else {
            return false;
        }
    };
})

