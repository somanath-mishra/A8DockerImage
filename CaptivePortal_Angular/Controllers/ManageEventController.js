wifiModule.controller('ManageEventController', ['$scope', 'ManageEventService', '$rootScope', function ($scope, ManageEventService, $rootScope) {
    $scope.Attendes = [];
    var localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), ControllerIpAddress: localStorage.getItem("cptUrl").toString().trim() };
    $scope.latestSelectedSsid = "";
    var CurrentDate = new Date();
    $scope.Date = new Date(CurrentDate);
    $scope.editEvent = function (objEvent) {
        $scope.updateBtn=true;
        $scope.deleteBtn = true;
        $scope.saveBtn = false;
        //angular.forEach($scope.lstEvents, function(value, key){
        //    if(value.EventId== Id)
        //        $scope._EventDetails = value;
        //});
        //var index = $scope.lstEvents.indexOf(EventId);
        //$scope._EventDetails = $scope.lstEvents[index];
        //var objEvent = $scope.lstEvents.filter({ EventId: Id });        
        $scope._EventDetails = objEvent;
        //objEvent.EventStartDateTime = $filter('utcToLocal')(new Date(objEvent.EventStartDateTime), 'dd-MM-yyyy HH:mm');
        //$scope._EventDetails = $scope.lstEvents[0];
        var dateEventStart = new Date($scope._EventDetails.EventStartDateTime+'Z');        
        var dateEventEnd = new Date($scope._EventDetails.EventEndDateTime+'Z');       
        $scope._EventDetails.EventStartDateTime = dateEventStart;
        $scope._EventDetails.EventEndDateTime = dateEventEnd;
        var CurrentDate = new Date();
        $scope.Date = new Date(CurrentDate);
        $('#ModalEvent').modal('show');

    }
    
    $scope.ShowSampleData = function () {
        var SampleJSONData = [];
        SampleJSONData.push({ UserName: 'Billy.Bush@mail.com', FirstName: 'Billy', LastName: 'Bush', Company: 'abc' });
        JSONToCSVConvertor(SampleJSONData, " ", true);
    }

    $scope.ReadExcelData=function() {  
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
        /*Checks whether the file is a valid excel file*/  
        if (regex.test($("#ngexcelfile").val())) {  
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
            if ($("#ngexcelfile").val().indexOf(".xlsx") > 0) {  
                xlsxflag = true;  
            }  
            /*Checks whether the browser supports HTML5*/  
            if (typeof (FileReader) != "undefined") {  
                var reader = new FileReader();  
                reader.onload = function (e) {
                    //$scope.$apply(function () {
                        var data = e.target.result;

                        // var data = e.target.result;  
                        /*Converts the excel data in to object*/
                        if (xlsxflag) {
                            var workbook = XLSX.read(data, { type: 'binary' });
                        }
                        else {
                            var workbook = XLS.read(data, { type: 'binary' });
                        }
                        /*Gets all the sheetnames of excel in to a variable*/  
                        var sheet_name_list = workbook.SheetNames;  
                        var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
                        sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                            /*Convert the cell value to Json*/
                            if (xlsxflag) {
                                var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                            }
                            else {
                                var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                            }
                            console.log(exceljson);
                        
                            if (exceljson.length > 0) {
                                $scope.Attendes = [];
                            for (var i = 0; i < exceljson.length; i++) {                                
                                //$scope.Attendes = [];
                                $scope.Attendes.push(exceljson[i]);
                                $scope.$apply();  
                            }
                                toastr.success($scope.Attendes.length +' '+ "Users are prepared to Register")
                        }
                    });
                //});
                }

                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                    reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);  
                }  
                else {  
                    reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);  
                }  
            }  
            else {  
                alert("Sorry! Your browser does not support HTML5!");  
            }  
        }  
        else {  
            alert("Please upload a valid Excel file!");  
        }  
    }  

    //$scope.checkEvent = function () {
    //    if(!$scope._UserDetails)
    //    {
    //        toastr.warning("Select the Event Before Save");
    //        return false;
    //    }
    //}

    $scope.SaveImportAttendeData = function () {
       
        if (!$scope._UserDetails) {
            toastr.warning("Select an Event to Register");
            return false;
        }
        if ($scope.Attendes.length == 0)
        {
            toastr.warning("Upload some of the Users before register");
            return false;
        }      
        var objAttend = $scope.Attendes[0];
        if (!objAttend.hasOwnProperty("UserName") || !objAttend.hasOwnProperty("FirstName") || !objAttend.hasOwnProperty("LastName") || !objAttend.hasOwnProperty("Company")){
            toastr.warning("Header Format should be UserName,FirstName,LastName,Company on first coulumn ");
            return false;
        }

        $scope.Attendes = $scope.Attendes.map(function (item) {
            return { "UserName": item.UserName, "FirstName": item.FirstName, "LastName": item.LastName, "Custom1": item.Company };
        });

        var item = {
            NetWorkOfSiteId: $scope.SelectedSSID,
            EventId: $scope._UserDetails.EventId,
            lstWifiUser: $scope.Attendes
        }
       
        ManageEventService.ImportListOfNewAttendee(item).then(function successCallback(response) {
            if (response.status == 200) {
                $('#ModalImportData').modal("hide");
                toastr.success("Data Imported Successfully");
            }
        }, function errorCallback(response) {
            toastr.error("Some Error Occured");
        });
    }

    $scope.createNewEvent = function () {
        if (!$scope.SelectedSSID) {
            toastr.warning("select the SSId First");
            return false;
        }
        $scope.updateBtn = false;
        $scope.deleteBtn = false;
        $scope.saveBtn = true;
        $scope._EventDetails = "";

        $('#ModalEvent').modal('show');
    }

    $scope.selectEvent = function (Event) {
        if ($scope.chckedWifiUsers.indexOf(WifiUsers) !== -1) {
            return true;
        }
    }

    $scope.SaveEvent = function () {       
        var dateEventStart = (new Date($scope._EventDetails.EventStartDateTime)).toUTCString();
        var dateEventEnd = (new Date($scope._EventDetails.EventEndDateTime)).toUTCString();        
        $scope._EventDetails.EventStartDateTime = new Date(dateEventStart);
        $scope._EventDetails.EventEndDateTime = new Date(dateEventEnd);
        $scope._EventDetails.NetworkOfSiteId = $scope.SelectedSSID;
        $scope.latestSelectedSsid = $scope.SelectedSSID;
        ManageEventService.SaveEvent($scope._EventDetails).then(function successCallback(response) {
            if (response.status == 200) {
                $('#ModalEvent').modal("hide");
                $scope.GetEventsPerSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }

    $scope.updateEvent = function (objEvent) {
        $scope._EventDetails = objEvent;
        var dateEventStart = (new Date($scope._EventDetails.EventStartDateTime)).toUTCString();
        var dateEventEnd = (new Date($scope._EventDetails.EventEndDateTime)).toUTCString();
        $scope._EventDetails.EventStartDateTime = new Date(dateEventStart);
        $scope._EventDetails.EventEndDateTime = new Date(dateEventEnd);
        ManageEventService.updateEvent($scope._EventDetails).then(function successCallback(response) {
            if (response.status == 200) {
                $('#ModalEvent').modal("hide");
                $scope.GetEventsPerSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }

    $scope.deleteEvent = function (objEvent) {
        ManageEventService.deleteEvent(objEvent).then(function successCallback(response) {
            if (response.status == 200) {
                $('#ModalEvent').modal("hide");
                $scope.GetEventsPerSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }

    $scope.GetEventsPerSSID = function () {      
        var NetworkOfSiteId = $scope.SelectedSSID;
        $scope.idSelectedRow = new Array();
        ManageEventService.FetchEvents(NetworkOfSiteId).then(function successCallback(response) {
            if (response.status == 200) {                
                $scope.lstEvents = response.data.objEvents;
                //angular.forEach($scope.lstEvents, function (value, key) {
                //    $scope.EventStartDateTime = new Date(value.EventStartDateTime + 'Z');
                //    $scope.EventEndDateTime = new Date(value.EventEndDateTime + 'Z');
                //});                    
                $scope.lstWifiUsers = "";
                $scope.EventSelected = "";
                $scope.currentPage = 1;
                var CurrentDate = new Date();
                var todayDateFormat = CurrentDate.getFullYear() + "/" + (parseInt(CurrentDate.getMonth()) + 1) + "/" + CurrentDate.getDate() + " " + CurrentDate.getHours() + ':' + CurrentDate.getMinutes() + ':' + CurrentDate.getSeconds();
                $scope.todayDate = todayDateFormat;

            }
        }, function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }

    $scope.exportEventData = function (objEvent) {
        if (objEvent <= 0)
        {
            toastr.warning("Select an Event to generate the report");
            return false;
        }
        var item = { EventId: objEvent, pageSize: $scope.TotalCount };
        ManageEventService.exportEvent(item).then(function successCallback(response) {
            if (response.status == 200) {
                if (response.data.lstEventAttendees == '')
                    return;

                JSONToCSVConvertor(response.data.lstEventAttendees, " ", true);
            }
        }, function errorCallback(response) {
            alert("Failure");
        });
    }

    $scope.ShowSampleData = function () {
        var SampleJSONData = [];
        SampleJSONData.push({ UserName: 'Billy.Bush@mail.com', FirstName: 'Billy', LastName: 'Bush', Company: 'abc' });
        JSONToCSVConvertor(SampleJSONData, " ", true);
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        //CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    $scope.upcomingEvents = function (obj) {
        var date = new Date();
        var eventDate = new Date(obj.EventEndDateTime+'Z');
        return eventDate >= date;
    };    
    
    $scope.FilterUserDetails = function () {
        $scope.GetWifiUsersPerEvent();
    }
        
    $scope.range = function () {
        var input = [];
        for (var i = 1; i <= $scope.pageCount; i++) {
            input.push(i);
        }
        return input;
    };

    $scope.currentPage = 1;

    $scope.onPageNumberClick = function (pageNumber) {
        if (pageNumber < $scope.maxSize) {
            $scope.range = function () {
                var input = [];
                for (var i = 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                }
                return input;
            };

        }
        localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), EventId: $scope.EventSelected, SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetWifiUsersPerEvent();
    }
    
    $scope.onNextClick = function (pageNumber) {
        if (pageNumber > $scope.maxSize) {
            $scope.range = function () {
                var input = [];
                for (var i = $scope.currentPage - $scope.maxSize + 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                }
                return input;
            };
        }
        localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), EventId: $scope.EventSelected, SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetWifiUsersPerEvent();
    }

    $scope.onPrevClick = function (pageNumber) {
        if (pageNumber <= $scope.maxSize) {
            $scope.range = function () {
                var input = [];
                for (var i = 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                }
                return input;
            };
        }
        localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), EventId: $scope.EventSelected, SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetWifiUsersPerEvent();
    }

    $scope.onFirstClick = function (pageNumber) {
        $scope.range = function () {
            var input = [];
            for (var i = 1; i <= $scope.pageCount; i++) {
                input.push(i);
            }
            return input;
        };
        localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), EventId: $scope.EventSelected, SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetWifiUsersPerEvent();
    }

    $scope.onLastClick = function (pageNumber) {
        $scope.range = function () {
            if ($scope.pageCount < $scope.maxSize)
                //$scope.range();
            {   
                    var input = [];
                    for (var i = 1; i <= $scope.pageCount; i++) {
                        input.push(i);
                    }
                    return input;
            }
            else
            {
                var input = [];
                for (var i = $scope.pageCount - $scope.maxSize + 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                }
                return input;
            }            
        };
        localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), EventId: $scope.EventSelected, PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetWifiUsersPerEvent();
    }
    
    $scope.maxSize = 3;
    var PrevEvent = $scope.EventSelected;
    $scope.GetWifiUsersPerEvent = function () {
        if (!$scope.SelectedSSID) {
            toastr.warning("select the SSId First");
            return false;
        }        
        if (PrevEvent != $scope.EventSelected)
        {
            PrevEvent = $scope.EventSelected;
            $scope.currentPage = 1;
        }
        $scope.idSelectedRow = new Array();        
        var localeStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), NetWorkOfSiteId: $scope.SelectedSSID, EventId: $scope.EventSelected, QuerySearch: $scope.queryText, pageNumber: $scope.currentPage };
        ManageEventService.FetchWifiUsersPerEvent(localeStorageItem).then(function successCallback(response) {
            if (response.status == 200) {
                console.log(response.data.lstEventAttendees);
                $scope.lstWifiUsers = response.data.lstEventAttendees;
                $scope.pageCount = response.data.TotalPages;
                $scope.TotalCount = response.data.TotalCount;                
            }
        }, function errorCallback(response) {
            toastr.error(response.data.ModelState.toString());
        });
    }

    $scope.GetMeetGreetSSID = function () {        
        //debugger;
        $scope.todayDate = new Date();
        ManageEventService.FetchSSID(localStorageItem).then(function successCallback(response) {
            //debugger;
            if (response.status == 200) {
                $scope.lstNetWorkOfSites = response.data.lstNetWorkSiteConfiguration;
            }
            else {
                toastr.error(response.data + "With Status" + response.status);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error("Posting of data failed as" + " " + response.data.Message);
        });
    }

    $scope.RegWifiUser = function () {
        if ($scope.idSelectedRow.length == 0)
        {
            $('#ModalNewUser').modal('show');
        }
        else
        $('#ModalRegister').modal('show');
    }

    $scope.idSelectedRow =new Array();

    $scope.SetSelectedUser = function (item) {
        if ($scope.EventSelected > 0)
        {
            if ($scope.idSelectedRow.indexOf(item.UserId) > -1)
                $scope.idSelectedRow.splice($scope.idSelectedRow.indexOf(item.UserId), 1);
            else
                $scope.idSelectedRow.push(item.UserId);
        }
        else {
            if ($scope.idSelectedRow.indexOf(item.UserId) > -1)
                $scope.idSelectedRow.splice($scope.idSelectedRow.indexOf(item.UserId), 1);
            else
                $scope.idSelectedRow.push(item.UserId);
        }        
    };       

    $scope.RegisterWifiUser = function () {
        var item = { EventId: $scope.RegEvent, WifiUserId: $scope.idSelectedRow, NetworkOfSiteId: $scope.SelectedSSID }        
        if ($scope.idSelectedRow.length > 0) {
            ManageEventService.RegUserstoEvent(item).then(function successCallback(response) {
                //debugger;
                if (response.status == 200) {
                    toastr.success("Users successfully registered")
                    $('#ModalRegister').modal('hide');
                }
                else {
                    toastr.error("Users not registered successfully");
                }
            }, function errorCallback(response) {
                console.log(response);
                toastr.error("Posting of data failed as" + " " + response.data.Message);
            });
        }
    }

    $scope.CreateNewUserAndRegToEvent = function () {
        var item= {
            NetWorkOfSiteId: $scope.SelectedSSID,
            EventId: $scope._UserDetails.EventId,
            WifiUser: {
                UserName: $scope._UserDetails.UserName,
                FirstName: $scope._UserDetails.ForeName,
                LastName: $scope._UserDetails.SurName,
                Custom1: $scope._UserDetails.CompanyName
            }
        }
        ManageEventService.RegisterNewAttendee(item).then(function successCallback(response) {
            //debugger;
            if (response.status == 200) {
                $scope.GetWifiUsersPerEvent();
                toastr.success("Users Registered to Event successfully");
                $scope.regNewUserForm.$setPristine();
                $scope._UserDetails = {};
                $('#ModalNewUser').modal('hide');
            }
            else {
                toastr.error("Users not Registered to Event successfully");
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error("Posting of data failed as" + " " + response.data.Message);
        });
    }

    $scope.DeRegisterWifiUserToEvent = function () {
        var item = { EventId: $scope.EventSelected, WifiUserId: $scope.idSelectedRow, NetworkOfSiteId: $scope.SelectedSSID }
        if ($scope.idSelectedRow.length > 0 && $scope.EventSelected > 0) {
            ManageEventService.DeRegUserstoEvent(item).then(function successCallback(response) {
                //debugger;
                if (response.status == 200) {
                    $scope.GetWifiUsersPerEvent();
                    toastr.success("Users DeRegistered successfully")
                }
                else {
                    toastr.error("Users not DeRegistered successfully");
                }
            }, function errorCallback(response) {
                console.log(response);
                toastr.error("Posting of data failed as" + " " + response.data.Message);
            });
        }
        else {
            toastr.error("Please select an Event and atleast one Registered User to deregister from the event");
        }
    }

    $scope.NotifyEventAttendee = function () {
        var item = { EventId: $scope.EventSelected, WifiUserId: $scope.idSelectedRow, NetworkOfSiteId: $scope.SelectedSSID }
        if ($scope.idSelectedRow.length > 0 && $scope.EventSelected>0) {
            ManageEventService.NotifyEventAttendee(item).then(function successCallback(response) {
                //debugger;
                if (response.status == 200) {
                    $scope.GetWifiUsersPerEvent();
                    toastr.success("Notication set successfully")
                }
                else {
                    toastr.error("Notification not set");
                }
            }, function errorCallback(response) {
                console.log(response);
                toastr.error("Posting of data failed as" + " " + response.data.Message);
            });
        }
        else {
            toastr.error("Please select an Event and atleast one Registered User to set the notification")
        }
    }

    //$scope.fileChanged = function (data) {
    //    $scope.FileObj.ExcelData = data.value;
    //}
    
}]);
