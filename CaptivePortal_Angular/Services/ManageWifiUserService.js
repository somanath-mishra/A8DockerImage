wifiModule.service('ManageWifiUserService', ['$http', '$rootScope', function ($http, $rootScope) {
    var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();

    //Get all the SSID's as per SiteId and SiteName
    this.GetAllWifiUsersWithNetWorkOfSite = function (LoacalStorageObjectToConfSsid) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GelAllWifiUsers",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName':localStorage.getItem('SiteName').toString().trim()
            },
            data: LoacalStorageObjectToConfSsid
        })
    };

    this.GetWifiUserDetails = function (userId, netWorkOfSiteId) {
        return $http({
            method: 'Get',
            url: CpServiceUrl + "/api/GetWifiUserDetails?userId=" + userId + " " + "&&netWorkOfSiteId=" + netWorkOfSiteId,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            }
        })
    };

    this.GetAuditHistory = function (id, FromDate, ToDate) {
        return $http({
            method: 'GET',
            url: CpServiceUrl + "/api/GetUserUsagePackageAuditHistory?Id=" + id + "&FromDate=" + FromDate + "&ToDate=" + ToDate,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    };

    this.GetUserActivity = function (UserId) {
        return $http({
            method: 'GET',
            url: CpServiceUrl + "/api/GetUserUsageActivity?UserId=" + UserId,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            }
        })
    };

    this.AddExtraValidity = function (Obj) {
        return $http({
            method:'POST',
            url: CpServiceUrl + "api/ExtendPackageValidity",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data:Obj
        })
    }

    this.GetPackagesWithSSID = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetAvailablePackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: Obj
        })
    };

    this.UpdateOneWifiUserDetails = function (UsersDetailsServiceData) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + '/api/UpdateUserDetails',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: UsersDetailsServiceData
        });
    }


    this.DeleteOneWifiUser = function (WifiUserData) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + '/api/DeleteUserAccPerSSidAndMac',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: WifiUserData
        });
    }

    this.AddMacAdress= function (dataMac) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + '/api/AddMacAddress',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: dataMac
        });
    }


    this.DeleteMacAddress = function (dataMac) {
        return $http({
            method: 'DELETE',
            url: CpServiceUrl + '/api/RealTimeLocation/DeleteDevices',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: dataMac
        });
    }


    this.UpdatePasswordDetails = function (dataUser) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + '/api/UpdateWifiUserPassword',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: dataUser
        });
    }

    this.CreteWifiUser = function (dataUser) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + '/api/a8Captiveportal/V2/RegisterAuthenticateToWifi',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: dataUser
        });
    }

    this.FetchSSID = function (LoacalStorageObjectToConfSsid) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetSSId",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: LoacalStorageObjectToConfSsid
        })
    };

    this.GetUsagePackages = function (data,SelectedSSID) {
        return $http({
            method: 'GET',
            url: CpServiceUrl + "/api/GetCurrentUsagePackage?UserId=" + data.WifiUserId + "&NetWorkOfSiteId=" +SelectedSSID,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            }
        })
    };

    this.LogOutUser = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/a8Captiveportal/V2/LogOut",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data:Obj
        })
    };


    this.RefundPackage = function (Refund) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/VoidPostPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data:Refund
        })
    };


    this.AddPackage = function (AddPost) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/AddPostPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: AddPost
        })
    };

    this.AddPackagetoDb = function (AddPost) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateUserUsage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: AddPost
        })
    };


    this.AddPackagetoDb1 = function (AddPost) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateUserUsage1",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: AddPost
        })
    };

    this.VoidPackagetoDb = function (VoidPost) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/VoidUserUsage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: VoidPost
        })
    };

}]);

   