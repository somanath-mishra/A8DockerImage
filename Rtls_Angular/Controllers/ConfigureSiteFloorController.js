RtlsModule.controller('ConfigureSiteFloorController', ['$scope', 'ConfigureSiteFloorService', '$rootScope', function ($scope, ConfigureSiteFloorService, $rootScope) {

    $scope.isDisabled = false;
    var itemSiteFloor = { "SiteFloorName": "", "FloorImagePath": "", "XRangeFeedData": 0, "YRangeFeedData": 0, "CanvasXLength": 0, "CanvasYLength": 0, "TopStyle": 0, "LeftStyle": 0, "CanvasName": "" }
    var i = 0;
    $scope.UploadFile = function (Item,index) {
        //debugger;
        var data = new FormData();
        var SiteId = localStorage.getItem('SiteId');
        var files = $("#file" + index).get(0).files;
        // Add the uploaded image content to the form data collection
        if (files.length > 0) {
            data.append("UploadedImage", files[0]);
            data.append("SiteId", SiteId);
            ConfigureSiteFloorService.UploadFloorIcon(data).then(function (response) {
                Item.FloorImagePath = response.data.completePath;
            }, function () {
          });
        }
    }


    $scope.AddUpdateSiteFloorController = function (data) {
        $scope.isDisabled = true;
        ConfigureSiteFloorService.AddUpdateSiteFloorService(data).success(function (result) {
            toastr.success("Data saved successfully");
            location.reload();
        }, function (error) {
            toastr.error("Some Problem Occured");
        });
    };
    
    $scope.GetSiteFloorsController = function (data) {
        ConfigureSiteFloorService.GetSiteFloorService(data).success(function (result) {
            if (!result)
            {
                toastr.warning("First Setup the RTLS in RTLSSetup Page ");
            }
            else {
                $scope.RtlsConfiguration = result;
            }
        }, function (error) { });
    };

    $scope.DeleteSiteFloorsController = function (data) {
        ConfigureSiteFloorService.DeleteSiteFloorService(data).success(function (result) {
            location.reload();
        }, function (error) {
            toastr.error("Some Problem Occured");
        });
    };

    $scope.appendDiv = function () {
        $scope.RtlsConfiguration.SiteFloors.push(itemSiteFloor);
    };

    $scope.lstCanvas = [
          { key: "Canvas0", value: "Canvas0" },
          { key: "Canvas1", value: "Canvas1" },
          { key: "Canvas2", value: "Canvas2" },
          { key: "Canvas3", value: "Canvas3" },
          { key: "Canvas4", value: "Canvas4" },
          { key: "Canvas5", value: "Canvas5" }
    ];

}]);
