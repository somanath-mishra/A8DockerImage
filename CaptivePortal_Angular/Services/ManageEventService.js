wifiModule.service('ManageEventService', ['$http', '$rootScope', function ($http, $rootScope) {

    var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();

    //Fetch the SSID as per the localStorageObjectData 
    this.FetchSSID = function (LoacalStorageObjectToConfSsid) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetMeetGreetSSId",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: LoacalStorageObjectToConfSsid
        });
    };

    this.exportEvent = function (eventobj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/ExportEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: eventobj
        });
    };


    this.FetchWifiUsersPerEvent = function (LoacalStorageObjectToConfSsid) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/FetchRegUsersPerEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: LoacalStorageObjectToConfSsid
        });
    };

    this.SaveEvent = function (eventobj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: eventobj
        });
    };

    this.updateEvent = function (eventobj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/UpdateEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: eventobj
        });
    };

    this.deleteEvent = function (eventobj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/DeleteEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: eventobj
        });
    };

    this.FetchEvents = function (NetworkOfSiteId) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/FetchEvents?NetworkOfSiteId=" + NetworkOfSiteId,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: NetworkOfSiteId
        });
    };

    this.RegUserstoEvent = function (objEventAttendees) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/RegisterUsersToEvents",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: objEventAttendees
        });
    };

    this.DeRegUserstoEvent = function (objEventAttendees) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/DeRegisterUsersToEvents",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: objEventAttendees
        });
    };

    this.NotifyEventAttendee = function (objEventAttendees) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/NotificationOfEventAttendee",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: objEventAttendees
        });
    };
    
    this.RegisterNewAttendee = function (objNewEventAttendee) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/RegisteringNewUserToEvent",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: objNewEventAttendee
        });
    };

    this.ImportListOfNewAttendee = function (lstNewAttendees) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/RegisterListOfAttende",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: lstNewAttendees
        });
    };

}]);