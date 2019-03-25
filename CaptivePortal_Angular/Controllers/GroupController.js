wifiModule.controller('GroupController', ['$scope', 'GroupService', '$rootScope', function ($scope, GroupService, $rootScope) {

    $scope.CreateGroup = function () {
        GroupService.CreateGroup($scope.Group).success(function (response) {
            location.reload();
        }, function (error) { });
    }


    $scope.DeleteGroup = function (data) {
        GroupService.DeleteGroup(data).success(function (response) {
            location.reload();
        }, function (error) { });
    }

    $scope.GetGroups = function () {
        GroupService.GetGroups($scope.Group).success(function (response) {
            $scope.lstGroups = response;
        }, function (error) { });
    }
}]);