var deploymentApp = angular.module('deploymentApp',[]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/',{templateUrl:'views/login.html', controller: 'loginController'}).
    when('/homepage', {templateUrl : 'views/homepage.html', controller: 'homePageController'}).
    when('/register', {templateUrl : 'views/register.html', controller: 'registerController'}).
    when('/viewItem/:index', {templateUrl : 'views/viewItem.html', controller: 'viewItemController'}).
    when('/createDeployment', {templateUrl : 'views/createDeployment.html', controller: 'createDeploymentController'}).
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
          $http({url: 'https://proiect-licenta.herokuapp.com/login/', method: 'POST', data:user}).
            success(function (data) {
                Data.setUsername(data.username);
                $location.path('/homepage');
            }). error(function() {
                $scope.validUser = "fals";
                $location.path('/');
            });
     }
}]).
controller('homePageController',['$scope','$http', '$location', 'Data', function($scope, $http, $location, Data){
    $scope.currentUser = Data.getUsername();
    $http({url: '/deployment.json', method: 'GET'}).
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
          $http({url: 'https://proiect-licenta.herokuapp.com/register/', method: 'POST', data:user}).
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
controller('viewItemController', ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data){
    $scope.currentDeployment = Data.getDeployments()[$routeParams.index];
}]).
controller('createDeploymentController', ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data){
    
}]);