a8DashboardModule.service('UploadFileService', ['$http', '$rootScope', function ($http, $rootScope) {

var BaseUrl = localStorage.getItem('dashboardUrl').toString().trim();
 function GetSiteNameFromQueryString() {
  return localStorage.getItem('SiteName').toString().trim();
 }


    this.filedownload = function (object) {
        var URL = BaseUrl + "/DashBoard/api/ImportSftpData/LoadSftpData?strDateFormat=" + object + "&&ConnectionString=" + GetSiteNameFromQueryString();
        return $http.get(URL);
    };


    this.GetFileNames = function () {
        return $http({
            method: "GET",
            url: BaseUrl + "/DashBoard/api/ImportSftpData/GetFileNames?ConnectionString=" + GetSiteNameFromQueryString(),
            dataType: JSON
        });
    }

    this.ImportSftpFile = function (data) {
        var URL = BaseUrl + "/DashBoard/api/ImportSftpData/ImportCSVFile?lstDataFileIds=" + data + "&&ConnectionString=" + GetSiteNameFromQueryString();
        return $http.get(URL);
    }

    this.ClearSftpFile = function (data) {
        var URL = BaseUrl + "/DashBoard/api/ImportSftpData/ClearFile?lstDataFileIds=" + data + "&&ConnectionString=" + GetSiteNameFromQueryString();
        return $http.get(URL);
    }
    this.DeleteFile = function (data) {
        return $http({
            method: "GET",
            url: BaseUrl + "/DashBoard/api/ImportSftpData/DeleteFileData?Id=" + data + "&&ConnectionString=" + GetSiteNameFromQueryString(),
            dataType: JSON
        });
    }

    this.SaveSftpPath = function (sftpfilePath) {
        return $http({
            method: "GET",
            url: BaseUrl + "/DashBoard/api/ImportSftpData/SaveSftpRemotePath?sftpRemotePath=" + sftpfilePath + "&&ConnectionString=" + GetSiteNameFromQueryString(),
            dataType: JSON
        });
    }

    this.ImportTUIDisCovery = function (data) {
        data.append("ConnectionString", GetSiteNameFromQueryString())
        return $http.post(BaseUrl + "/DashBoard/api/ImportSftpData/SaveCruisePlaceDiscovery", data, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
    }

    this.UpdateParameters = function (data, value) {
        return $http.get(BaseUrl + "/DashBoard/api/ImportSftpData/UpdateParameters?key=" + data + "&&value=" + value + "&&ConnectionString=" + GetSiteNameFromQueryString());
    }

    this.GetParameters = function () {
        return $http.get(BaseUrl + "/DashBoard/api/ImportSftpData/GetParameters?ConnectionString=" + GetSiteNameFromQueryString());
    }
}]);

