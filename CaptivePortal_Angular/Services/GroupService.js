wifiModule.service('GroupService', ['$http', '$rootScope', function ($http, $rootScope) {
   var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();
   
    this.CreateGroup = function (dataGroup) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateGroup",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataGroup
        })
    };

    this.DeleteGroup = function (dataGroup) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/DeleteGroup",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataGroup
        })
    };

    this.GetGroups = function (dataGroup) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetGroups",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataGroup
        })
    };

}]);