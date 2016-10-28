var deploymentApp = angular.module('deploymentApp',[]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/',{templateUrl:'views/login.html', controller: 'loginController'}).
    when('/homepage', {templateUrl : 'views/homepage.html', controller: 'homePageController'}).
    when('/register', {templateUrl : 'views/register.html', controller: 'registerController'}).
    when('/viewItem/:index', {templateUrl : 'views/viewItem.html', controller: 'viewItemController'}).
    when('/createDeployment', {templateUrl : 'views/createDeployment.html', controller: 'createDeploymentController'}).
    when('/updateDeployment', {templateUrl : 'views/updateDeployment.html', controller: 'updateDeploymentController'}).
    when('/history', {templateUrl : 'views/history.html', controller: 'historyController'}).
    when('/viewHistory/:index', {templateUrl : 'views/viewHistory.html', controller: 'viewHistoryController'}).
    when('/schedule', {templateUrl : 'views/schedule.html'}).
    otherwise({redirectTo:'/'})
}]).
factory('Data', function(){
   var data = {
        username: '',
        password: '',
        deployments: '',
        currentDepl: '',
        userHistory: ''
    };

    return {
        getUsername: function () {
            return data.username;
        },
        setUsername: function (username) {
            data.username = username;
        },
        getPassword: function () {
            return data.password;
        },
        setPassword: function (password) {
            data.password = password;
        },
        getDeployments: function () {
            return data.deployments;
        },
        setDeployments: function(deployments) {
            data.deployments = deployments;
        },
        getCurrentDepl: function () {
            return data.currentDepl;
        },
        setCurrentDepl: function(currentDepl) {
            data.currentDepl = currentDepl;
        },
        getUserHistory: function() {
            return data.userHistory;
        },
        setUserHistory: function(userHistory) {
            data.userHistory = userHistory;
        }
    }
}).
controller('loginController',['$scope','$http', '$location', 'Data', function($scope, $http, $location, Data){
     $scope.login = function (user) {
       //  console(user);
          $scope.validUser = "initial";
          $http({url: 'https://proiect-licenta.herokuapp.com/user/login/', method: 'POST', data:user}).
            success(function (data) {
              if (data.username == undefined || data.username == null) {
                    $scope.validUser = "fals";
                    $location.path('/');
                } else {
                    Data.setUsername(data.username);
                    $location.path('/homepage');
                }
            }).error(function() {
                $scope.validUser = "fals";
                $location.path('/');
            });
     }
}]).
controller('homePageController',['$scope','$http', '$location', 'Data', '$route', function($scope, $http, $location, Data, $route){
    $scope.currentUser = Data.getUsername();
    $http({url: 'https://proiect-licenta.herokuapp.com/deployments/username/'+Data.getUsername(), method: 'GET'}).
        success(function (data) {
            $scope.deployments = data;
            Data.setDeployments(data);
        });
    $scope.redirectToCreate = function() {
        $location.path('/createDeployment');
    }
    
    $scope.edit = function(d) {
        Data.setCurrentDepl(d);
        $location.path('/updateDeployment');
    }
    
    $scope.delete = function (name) {
        if (confirm('Are you sure you want to delete this item?')) {
            $http({url: 'https://proiect-licenta.herokuapp.com/deployments/delete/' + name , method: 'DELETE'}).
            success(function (data) {
                $route.reload();
                $.growl.notice({ message: "Deployment configuration deleted successfully!" });
            });
        }
    }
}]).
controller('registerController',['$scope','$http', '$location', 'Data', function($scope, $http, $location, Data){
     $scope.register = function (user) {
          $scope.validUser = "initial";
          $http({url: 'https://proiect-licenta.herokuapp.com/user/add/', method: 'POST', data:user}).
            success(function (data) {
                if (data.username == undefined || data.username == null) {
                    $scope.validUser = "fals";
                    $location.path('/register');
                } else {
                    Data.setUsername(data.username);
                    $location.path('/homepage');
                }
            });
     }
}]).
controller('headerController', ['$scope', '$location', function($scope, $location){
    $scope.signOut = function() {
        $location.path('/signOut');
    }
}]).
controller('viewItemController', ['$scope', '$routeParams', '$location', 'Data', '$http', function($scope, $routeParams, $location, Data, $http){
    $scope.currentDeployment = Data.getDeployments()[$routeParams.index];
    $scope.back = function() {
        $location.path('/homepage');
    }
    $scope.build = function() {
        $http({url: 'http://localhost:9080/run/build', method: 'POST', data:$scope.currentDeployment}).
        success(function (data) {
            $.growl.notice({ message: "Build executed!" }); 
        }).error(function(){
            $.growl.error({ message: "Your request failed!" });
        });
    }
    
    $scope.run = function() {
        $http({url: 'http://localhost:9080/run/build', method: 'POST', data:$scope.currentDeployment}).
        success(function (data) {
            $.growl.notice({ message: "Deploy executed!" }); 
        }).error(function(){
            $.growl.error({ message: "Your request failed!" }); 
        });
    }
}]).
controller('createDeploymentController', ['$scope', '$routeParams', '$location', '$http', 'Data', function($scope, $routeParams, $location, $http, Data){
    $scope.cancel = function() {
        $location.path('/homepage');
    }
    $scope.save = function(deployment) {
        $scope.valid = "initial";
        deployment.username = Data.getUsername();
        $http({url: 'https://proiect-licenta.herokuapp.com/deployments/add/', method: 'POST', data:deployment}).
        success(function (data) {
            if (data.username == undefined || data.username == null) {
                $scope.valid = "fals";
            } else {
                $location.path('/homepage');
            }
        });
    }
}]).
controller('updateDeploymentController',  ['$scope', '$routeParams', '$location', 'Data', '$http', function($scope, $routeParams, $location, Data, $http){
    $scope.deployment = Data.getCurrentDepl();
    $scope.cancel = function() {
        $location.path('/homepage');
    }
    $scope.update = function(deployment) {
        $http({url: 'https://proiect-licenta.herokuapp.com/deployments/update/', method: 'POST', data:deployment}).
        success(function (data) {
            $location.path('/homepage');
        });
    }
}]).
controller('historyController',  ['$scope', '$routeParams', '$location', 'Data', '$http', function($scope, $routeParams, $location, Data, $http){
    $http({url: 'https://proiect-licenta.herokuapp.com/history/username/'+Data.getUsername(), method: 'GET'}).
        success(function (data) {
            $scope.history = data;
            Data.setUserHistory(data);
        });
}]).
controller('viewHistoryController', ['$scope', '$routeParams', '$location', 'Data', '$http', function($scope, $routeParams, $location, Data, $http){
    $scope.currentHistory = Data.getUserHistory()[$routeParams.index];
    $scope.fileLocation = $scope.currentHistory.pathToBuild.replace(new RegExp('/', 'g'), '$');//$scope.currentHistory.pathToBuild.replace('/', '%');
    $scope.back = function() {
        $location.path('/history');
    }
    
    $scope.download = function() {
         $http({url: 'http://localhost:9080/run/download', method: 'GET'}).
        success(function (data) {

        });
    }
}]);