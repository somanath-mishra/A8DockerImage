RtlsModule.service('ConfigureSiteFloorService', ['$http', '$rootScope', function ($http, $rootScope) {
    var RtlsServiceUrl = localStorage.getItem("rtlsUrl").toString().trim();

    this.SaveRtlsConfiguration = function (dataRtlsConfiguration) {
        return $http({
            method: 'POST',
            url: RtlsServiceUrl + "/api/SaveAndUpdateRtlsConfiguration",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataRtlsConfiguration
        })
    };

    this.UploadFloorIcon = function (file) {
        return $http.post('/api/UploadFloorIcon', file, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
        .success(function () {
        })
        .error(function () {
        });
    };

    this.AddUpdateSiteFloorService = function (dataService) {
        return $http({
            method: 'POST',
            url: RtlsServiceUrl + "/api/SaveSiteFloors",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataService
        })
    };

    this.GetSiteFloorService = function (dataService) {
        return $http({
            method: 'Get',
            url: RtlsServiceUrl + "/api/GetSiteFloors?SiteId=" + localStorage.getItem("SiteId").toString().trim(),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataService
        })
    };

    this.DeleteSiteFloorService = function (dataService) {
        return $http({
            method: 'Delete',
            url: RtlsServiceUrl + "/api/DeleteSiteFloor",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dataService
        })
    };

}]);

