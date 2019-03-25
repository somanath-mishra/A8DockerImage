wifiModule.controller('UsageController', ['$scope', 'UsageService', '$rootScope', function ($scope, UsageService, $rootScope) {
    $scope.PackageDetails = null;
    var localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), ControllerIpAddress: localStorage.getItem("cptUrl").toString().trim() };
    
    $scope.Types = ["Period", "Session", "Data"];

    $scope.LimitType = {
       
        type: ''
    };

    $scope.ShowAuditData = function (PackageId) {
        var range = $('#dtFromToDate').val();
        var dates = range.split(" - ");
        var dtFromDate = dates[0];
        var dtToDate = dates[1];
        UsageService.GetAuditHistory(PackageId,dtFromDate,dtToDate).success(function (response) {
            //alert(response);
            var range = $('#dtFromToDate').val();
            var dates = range.split(" - ");
            var dtFromDate = dates[0];
            var dtToDate = dates[1];
            $('#ModalAudit').modal('show');
            $scope.AuditData = response;
        }, function (error) {
            //alert(error);
        });
    }

    $scope.callType=function(_packageType)
    {
        if (_packageType != undefined)
        {
            
            
            if (_packageType.trim() == "Period") {
                this.LimitType.type = '(In Days)';
            }
            else if (_packageType.trim() == "Session") {
                this.LimitType.type = '(In Minutes)';
            }
            else if (_packageType.trim() == "Data") {
                this.LimitType.type = '(In MegaBytes)';
            }
            else {
                this.LimitType.type = '';
            }
        }
        else
        {
            this.LimitType.type = '';
        }
       

    }
    $scope.editingData = {};

    $scope.modify = function (Package) {
        $scope.editingData[Package.PackageId] = true;
    };

    $scope.TotalandActiveUsers = function (packageId) {
        var item = {
            SsidName: $scope.SelectedSSID,
            PackageId: packageId
        };
        UsageService.getUsersCount(item).then(function successCallback(response) {
            alert(response.data);
        }, function errorCalback(response) {
            alert(response.data);
        });
    }

    $scope.populateGroups = function () {
        //if ($scope._PackageDetails.PackageType == "Group")
        //{
            UsageService.GetGroups(localStorageItem).then(function successCallback(response) {
                $scope.lstUsageGroups = response.data;
            }, function errorCallback(response) {
                toastr.error(response.statusText);
            });
        //}       
    }

    $scope.fetchGroups = function () {
        UsageService.FetchGroups(localStorageItem).then(function successCallback(response) {
            $scope.lstUsageGroups = response.data;
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    }

    $scope.updateSelection = function (position, PackageDetails) {
        angular.forEach(PackageDetails, function (Package, index) {
            Package.checked = false;
            if (position == index)
                Package.checked = true;
        });
    }

    $scope.GetPackage = function () {
        $scope.UsageConfigurationView = false;
        UsageService.GetPackages(localStorageItem).success(function (getPackage) {
            for (i = 0; i < getPackage.length; i++) {
                if (getPackage[i].PackageType == 10)
                {
                    getPackage[i].PackageType = "Period";
                }
                else if (getPackage[i].PackageType == 20)
                {
                    getPackage[i].PackageType = "Session";
                }
               else if (getPackage[i].PackageType == 30)
               {
                    getPackage[i].PackageType = "Data";
               }
               else if (getPackage[i].PackageType == 40){
                   getPackage[i].PackageType = "Group";
               }
               else
               {

               }
            }
            $scope.PackageDetails = getPackage;
            $scope.fetchGroups();

        }, function (error) { });
    }


    $scope.GetSSID = function () {
            $scope.lstNetWorkOfSitesData = [];
            var ids = localStorage.getItem("NetworkSiteIds").toString().split(",");
            if (ids.length > 0) {
                angular.forEach(ids, function (item) {

                    $scope.lstNetWorkOfSitesData.push(item);
                });
            }
    };

    $scope.GetPackagePerSSIDWifiCoord = function () {
        $scope.PackageDetails = false;
        var item = {
            SsidName: $scope.SelectedSSID
        };
        UsageService.GetPackagesWithSSIDWifiCoord(item).success(function (result) {
            for (i = 0; i < result.length; i++) {
                if (result[i].PackageType == 10) {
                    result[i].PackageType = "Period";
                }
                else if (result[i].PackageType == 20) {
                    result[i].PackageType = "Session";
                }
                else if (result[i].PackageType == 30) {
                    result[i].PackageType = "Data";
                }
                else if (result[i].PackageType == 40) {
                    result[i].PackageType = "Group";
                }
                else {

                }
            }
            $scope.SSIDDetails = result;
        }, function (error) { });
    };

    $scope.idSelectedItem = null;
    $scope.setSelectedItem = function (idSelectedItem, PackageDetails) {
        $scope.idSelectedItem = idSelectedItem;
        $scope.PackageDetails = false;
        $scope.PackageDetails = $scope.PackageDetails ? false : true;
        var index = $scope.SSIDDetails.indexOf(PackageDetails);
        $scope.PackageDetail = $scope.SSIDDetails[index];
    };

    $scope.SiteId = localStorage.getItem("SiteId");
    $scope.rowSelectedpackageId = null;

    $scope.setSelected = function (rowSelectedpackageId, packageDetails) {
        $scope.rowSelectedpackageId = rowSelectedpackageId;
        $scope.IsVisibleControllerSsid = false;
        $scope.UsageConfigurationView = true;
        $scope._PackageDetails = packageDetails;
        //$scope.populateGroups();
    }

    $scope.CreatePackage = function () {
        $scope._PackageDetails.SiteId = localStorageItem.SiteId;
        if ($scope._PackageDetails.PackageType == "Period") {
                   $scope._PackageDetails.PackageTypeId=10;
                }
        else if ($scope._PackageDetails.PackageType == "Session") {
                   $scope._PackageDetails.PackageTypeId=20;
                }
        else if ($scope._PackageDetails.PackageType == "Data") {
           $scope._PackageDetails.PackageTypeId=30;
           }
        else if ($scope._PackageDetails.PackageType == "Group") {
            $scope._PackageDetails.PackageTypeId=40;
            }
        else { 

            }
        UsageService.SavePackages($scope._PackageDetails, $scope._PackageDetails.GroupIds).then(function successCallback(response) {
            if (response.status == 200) {
                location.reload();
            } 
        },function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }
    
    $scope.Confirm = function () {
        if ($scope._PackageDetails == "") {
                toastr.error("Please select a package to be deleted");
                return false;
            }
        toastr.warning("<br /><button type='button' value='yes' class='confirmationRevertYes'>Yes</button><button type='button'  value='no' class='confirmationRevertYes'>No</button>", 'Deleting this Package will delete associated SSID Packages also. Are you sure you want to delete this Package?',
            {
                closeButton: false,
                allowHtml: true,
                onShown: function (toast) {
                    $(".confirmationRevertYes").click(function () {
                        if ($(this).val() == "yes")
                        {
                            UsageService.DeletePackage($scope._PackageDetails).then(function successCallback(response) {
                                if (response.status == 200 && response.data == "") {
                                    location.reload();
                                } else {
                                    toastr.error(response.data);
                                    return false;
                                }
                            }, function errorCallback(response) {
                                toastr.error(response.data);
                            });
                        }
                        else {
                            location.reload();
                        }
                    });
                }
            });
    }
    
    $scope.ShowCreatePackageform = function () {
        $scope.UsageConfigurationView = true;
        $scope._PackageDetails = "";
        angular.forEach($scope.PackageDetails, function (Package) {
            Package.checked = false;            
        });
    }
}]);
