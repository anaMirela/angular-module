var deploymentApp = angular.module('deploymentApp',[]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/',{templateUrl:'views/login.html', controller: 'loginController'}).
    when('/homepage', {templateUrl : 'views/homepage.html', controller: 'homePageController'}).
    when('/register', {templateUrl : 'views/register.html', controller: 'registerController'}).
    when('/viewItem/:index', {templateUrl : 'views/viewItem.html', controller: 'viewItemController'}).
    when('/createDeployment', {templateUrl : 'views/createDeployment.html', controller: 'createDeploymentController'}).
    when('/history', {templateUrl : 'views/history.html'}).
    when('/viewHistory', {templateUrl : 'views/viewHistory.html'}).
    when('/schedule', {templateUrl : 'views/schedule.html'}).
    otherwise({redirectTo:'/'})
}]).
factory('Data', function(){
   var data = {
        username: '',
        password: '',
        deployments: ''
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
controller('homePageController',['$scope','$http', '$location', 'Data', function($scope, $http, $location, Data){
    $scope.currentUser = Data.getUsername();
    $http({url: 'https://proiect-licenta.herokuapp.com/deployments/username/'+Data.getUsername(), method: 'GET'}).
            success(function (data) {
                $scope.deployments = data;
                Data.setDeployments(data);
            });
    $scope.redirectToCreate = function() {
        $location.path('/createDeployment');
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
controller('viewItemController', ['$scope', '$routeParams', '$location', 'Data', function($scope, $routeParams, $location, Data){
    $scope.currentDeployment = Data.getDeployments()[$routeParams.index];
    $scope.back = function() {
        $location.path('/homepage');
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
}]);