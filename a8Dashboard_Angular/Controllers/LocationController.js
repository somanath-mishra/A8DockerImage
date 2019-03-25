﻿//Controller for Location Controller
a8DashboardModule.controller('LocationController', ['$scope', 'LocationService', '$rootScope', 'Notification', function ($scope, LocationService, $rootScope, Notification) {
    //Controller Function for Location Controller
    $scope.fileobj = [];


    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


    $scope.events = [];

    $scope.SelectedSite = function () {
        //$scope.DiscoveryName = $scope.selectdiscovery;
        if (!$scope.selectdiscovery) {
            alert("Select the Discovery from dropdown");
        }
        else {
            window.location.href = "?SiteName=" + $scope.selectdiscovery;
        }
    };

    LocationService.DateDownload().success(function (d) {
        $scope.events = d[0].Content;
    }, function (error) { });

    $scope.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }
    };


    $scope.getAreaOfInterest = function () {
        LocationService.getLocations().success(function (d) {
            $scope.userslocation = d[0].Content;
        }, function (error) { });
    };

    $scope.GenerateReport = function () {
        //var chkSelectedElementValue = document.querySelector('.LocationCheckbox:checked');
        //if (!chkSelectedElementValue) {
        //    Notification.error("Please select Location");
        //}
        //else 
        //if (!document.getElementById('ddlSites').value) {
        //    Notification.error("Please select Discovery");
        //}
        //else
        if(!$scope.ddlSelectLocation)
        {
            Notification.error("Please select Location");
        }
        else if (!$scope.SelectDate) {
            Notification.error("Please select Date");
        }
        else if (!$scope.FromHour) {
            Notification.error("Please select FromHour");
        }
        else if (!$scope.ToHour) {
            Notification.error("Please select ToHour");
        }
        else if (!$scope.DwellTime) {
            Notification.error("Please select DwellTime");
        }

        else {
            $scope.exporting = true;
            //var AreaSelectedName = chkSelectedElementText.innerHTML;
            //var chkSelectedElementValue = document.querySelector('.LocationCheckbox:checked').value;
            //var chkSelectedElementText = document.querySelector('.LocationCheckbox:checked').parentElement.parentElement.childNodes[3].innerHTML;
            var item = { Location: $scope.ddlSelectLocation, Day: new Date($scope.SelectDate).toLocaleDateString(), FromHour: $scope.FromHour, ToHour: $scope.ToHour, DwellTime: $scope.DwellTime, ConnectionName: (localStorage.getItem("SiteName").toString().trim()) }
            LocationService.GenerateReport(item).success(function (d) {
                if (d[0].Content.BusiestVisitHour != 'NA') {
                    d[0].Content.BusiestVisitHour = d[0].Content.BusiestVisitHour + ":00";
                    d[0].Content.BusiestVisitPassersBy = d[0].Content.BusiestVisitPassersBy + ":00";
                }
                $scope.Report = d[0];
                if (d[0].ReturnCode == -1) {
                    Notification.error(d[0].Content.Error);
                }
                else {
                    Notification.success("Report generated successfully.");
                }
                $scope.exporting = false;
                $scope.lblReport = "Report for" + " " + item.Day + ",Hours:" + item.FromHour + " " + "to" + " " + item.ToHour + " " + ", Dwell Time:" + item.DwellTime + ", Ship Schedule-" + d[0].Content.CruiseName
            }, function (error) { alert("error") });
        }
    };

    $scope.updateSelection = function (position, userslocation) {
        angular.forEach(userslocation, function (location, index) {
            if (position != index)
                location.checked = false;
        });
    };

    //$scope.numberOfPages = function () {
    //    return Math.ceil($scope.SftpFileList.length / $scope.pageSize);
    //};
}]);