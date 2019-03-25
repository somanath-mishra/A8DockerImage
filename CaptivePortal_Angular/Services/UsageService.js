wifiModule.service('UsageService', ['$http', '$rootScope', function ($http, $rootScope) {

    var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();

    this.GetPackages = function (localstorageObj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: localstorageObj
        })
    };

    this.GetAuditHistory = function (id,FromDate,ToDate) {
        return $http({
            method: 'GET',
            url: CpServiceUrl + "/api/GetPackageAuditHistory?Id=" + id+"&FromDate="+FromDate+"&ToDate="+ToDate,
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        })
    };

    this.getUsersCount = function (obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetUsersCount",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data:obj
        })
    };

    this.GetGroups = function (obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateGroup",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: obj
        })
    };

    this.FetchGroups = function (obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/FetchGroup",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: obj
        })
    };

    this.SavePackages = function (packageobj,GroupIds) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/SavePackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                'package': packageobj,
                'GroupIds': GroupIds
            }
        });
    };

    this.GetPackagesWithSSIDWifiCoord = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetSSIDPackageWifiCoord",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: Obj
        })
    };



    this.DeletePackage = function (packageId) {
        return $http({
            method: 'DELETE',
            url: CpServiceUrl + "/api/DeletePackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: packageId
        })


    };


}]);