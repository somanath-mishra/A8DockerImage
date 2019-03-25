a8DashboardModule.controller('UploadFileController', ['$scope', 'UploadFileService', '$rootScope', 'Notification', function ($scope, UploadFileService, $rootScope, Notification) {

    function GetSiteNameFromQueryString() {
        var queries = {};
        queries = document.location.search.substr(1).split('&');
        var i = queries.toString().split('=');
        key = i[0].toString();
        value = i[1].toString();
        return value;
    }

    $scope.getFileUpload = function () {
        var date = new Date($scope.myMonthData);
        var strMonth = date.getMonth() + 1;
        if (strMonth < 10) { strMonth = '0' + strMonth; }
        var strYear = date.getFullYear().toString().substr(2, 3);
        var strYearMonth = strYear + strMonth;
        if (!$scope.myMonthData) {
            Notification.error("!!!Select the Month and Year ");
            return;
        }
        else {
            $scope.exporting = true;
            console.log($scope.myMonthData);
            UploadFileService.filedownload(strYearMonth).success(function (d) {
                alert(d);
                window.location.href = "/Admin/UploadLocationDashBoardFile?SiteName=" + GetSiteNameFromQueryString();
            }, function (error) { });
        }

    };

    $scope.getFileNames = function () {
        $scope.SftpFileList = [];
        $scope.curPage = 0;
        $scope.pageSize = 8;
        $scope.curPage1 = 0;
        $scope.pageSize1 = 8;
        UploadFileService.GetFileNames().success(function (d) {
            $scope.SftpFileList = d[0].Content.FilesInSftp;
            $scope.DbFileList = d[0].Content.FilesInDb;
        }, function (error) { alert("error") });
        $scope.numberOfPages = function () {
            return Math.ceil($scope.SftpFileList.length / $scope.pageSize);
        };
        $scope.numberOfPages1 = function () {
            return Math.ceil($scope.DbFileList.length / $scope.pageSize1);
        };
    };

    $scope.ImportFile = function () {
        var selected = new Array();
        $('input[name="chk"]:checked').each(function () {
            selected.push($(this).val());
        });

        UploadFileService.ImportSftpFile(selected).success(function (d) {
            window.location.href = "/Admin/UploadLocationDashBoardFile?SiteName=" + GetSiteNameFromQueryString();
        }, function (error) { });
    }

    $scope.Clear = function (id) {
        var selected = new Array();
        $('input[name="chk"]:checked').each(function () {
            selected.push($(this).val());
        });

        UploadFileService.ClearSftpFile(selected).success(function (d) {
            window.location.href = "/Admin/UploadLocationDashBoardFile?SiteName=" + GetSiteNameFromQueryString();
        }, function (error) { });

    }

    $scope.DeleteAll = function (fileName) {
        UploadFileService.DeleteFile(fileName).success(function (d) {
            if (d == 1) {
                window.location.href = "/Admin/UploadLocationDashBoardFile?SiteName=" + GetSiteNameFromQueryString();
            }
            else {
                Notification.error("Some Error has Occured");
            }

        }, function (error) { alert("error") });
    }

    $scope.SaveSftpFilePath = function () {
        var sftpFilePath = document.querySelector('#sftpPath').value;
        UploadFileService.SaveSftpPath(sftpFilePath).success(function (d) {
            alert("SFTP Rempote Path Saved SuccessFully");
            window.location.href = "/Admin/UploadLocationDashBoardFile?SiteName=" + GetSiteNameFromQueryString();
        }, function (error) { alert("error") });
    }

    //Add File start.....
    $scope.getTheFiles = function ($files) {
        $scope.imagesrc = [];
        for (var i = 0; i < $files.length; i++) {
            var reader = new FileReader();
            reader.fileName = $files[i].name;
            reader.onload = function (event) {
                var image = {};
                image.Name = event.target.fileName;
                image.Size = (event.total / 1024).toFixed(2);
                image.Src = event.target.result;
                $scope.imagesrc.push(image);
                $scope.$apply();
            }
            reader.readAsDataURL($files[i]);
        }
        $scope.Files = $files;
    };


    //Add File End...
    // Submit Forn data
    $scope.Submit = function () {
        //FILL FormData WITH FILE DETAILS.
        var data = new FormData();

        angular.forEach($scope.Files, function (value, key) {
            data.append(key, value);
        });

        data.append("DealModel", angular.toJson($scope.DealDetail));
        UploadFileService.ImportTUIDisCovery(data).then(function (response) {
            alert("Added Successfully");
        }, function () {

        });
    };

    $scope.UpdateParameters = function (key) {
        var data;
        if (key == 'RemotePath') {
            data = document.querySelector("#txtSftpPath").value;
        }
        else if (key == 'DeltaTime') {
            data = document.querySelector("#txtDeltaTime").value;
        }
        else if (key == 'WindowConvDwellTime') {
            data = document.querySelector("#txtWindowDwellTime").value;
        }
        else if (key == "WindowConvLengthTime") {
            data = document.querySelector("#txtWindowLength").value;
        }
        UploadFileService.UpdateParameters(key, data).then(function (response) {
        });
    };

    $scope.getParameters = function () {
        debugger;
        UploadFileService.GetParameters().then(function (response) {
            console.log(response.data);
            angular.forEach(response.data, function (data, key) {
                if (data.Name == 'RemotePath') {
                    document.querySelector("#txtSftpPath").value = data.Value;
                }
                else if (data.Name == 'DeltaTime') {
                    document.querySelector("#txtDeltaTime").value = data.Value;
                }
                else if (data.Name == 'WindowConvDwellTime') {
                    document.querySelector("#txtWindowDwellTime").value = data.Value;
                }
                else if (data.Name == "WindowConvLengthTime") {
                    document.querySelector("#txtWindowLength").value = data.Value;
                }
            });
        });
    }
}]);