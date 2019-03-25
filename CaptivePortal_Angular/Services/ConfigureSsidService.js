wifiModule.service('ConfigureSsidService', ['$http', '$rootScope', function ($http, $rootScope) {
    var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();

    //Fetch the SSID as per the localStorageObjectData 
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
        });
    };
    // Get AssociateSites per ssid selected
    this.GetAssociatePerSSID = function (selectedCpSSID) {

        //debugger;
        return $http({
            method: "GET",
            url: CpServiceUrl + "api/GetAssociateNetworkPerNetworkofSite?NetworkOfSiteId=" + selectedCpSSID,
            dataType: JSON

        });

    }

    this.GetAuditHistory = function (id, FromDate, ToDate) {
        return $http({
            method: 'GET',
            url: CpServiceUrl + "/api/GetSsidPackageAuditHistory?Id=" + id + "&FromDate=" + FromDate + "&ToDate=" + ToDate,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    };

    //Delete AssociateSites per ssid selected
    this.DeleteAssociatePerSSID = function (Id) {

        //debugger;
        return $http({
            method: "GET",
            url: CpServiceUrl + "api/DeleteAssociateNetworkPerNetworkofSite?Id=" + Id,
            dataType: JSON

        });

    }



    //Get Sitedetails 
    this.GetSiteWithSsidName = function (networkData) {
        //debugger;
        //return $http({
        //    method: "GET",
        //    url: CpServiceUrl + "/api/GetSiteWithSsidName?CompanyId=" + ComanyId + ",NetWorkOfSiteId=" + NetWorkOfSiteId,
        //    dataType: JSON

        //});
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetSiteWithSsidName",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()

            },
            data: networkData
        });
    };
    //Get SsidNames for a Site
    this.GetSsidName = function (_objAssociateSiteDTO) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetSsidName",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',


            },
            data: _objAssociateSiteDTO
        });
    };

    //Get SsidNames for a Site
    this.saveAssociateSite = function (SiteassociatedData) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/SaveAssociateSite",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()

            },
            data: SiteassociatedData
        });
    };

    //Save Sponsors for a SSID

    this.saveSponsorData = function (SponsorAssociatedData) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/SaveSponsor",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: SponsorAssociatedData
        })
    };

       //Update Sponsors for a SSID

    this.updateSponsorData = function (SponsorAssociatedData) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/UpdateSponsor",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: SponsorAssociatedData
        })
    };

    // Get Sponsors per ssid selected
    this.GetSponsorsPerSSID = function (selectedCpSSID) {
        //debugger;
        return $http({
            method: "GET",
            url: CpServiceUrl + "api/GetSponsorsDetailsPerSSID?NetworkOfSiteId=" + selectedCpSSID,
            dataType: JSON
        });
    }

    //Delete AssociateSites per ssid selected
    this.DeleteSponsor = function (Id) {

        //debugger;
        return $http({
            method: "GET",
            url: CpServiceUrl + "api/DeleteSponsor?Id=" + Id,
            dataType: JSON
        });

    }

    //Create and Fetch the SSID 
    this.CreateAndFetchSSID = function (LoacalStorageObjectToConfSsid) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateSSId",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: LoacalStorageObjectToConfSsid
        })
    };

    this.UpdateSsidConf = function (chckedIndexs) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/UpdateSsidConfiguration",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: chckedIndexs
        })
    };

    this.CreatePrimarySetup = function (primarySetupObj, func) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/SavePrimarySetUp",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: primarySetupObj
        });
    };

    this.UploadIcon = function (file) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('siteId', localStorage.getItem("SiteId"));
        return $http.post('/api/UploadBannerIcon', fd, {
            withCredentials: true,
            headers: { 'Content-Type': undefined, 'SiteName': localStorage.getItem('SiteName').toString().trim() },
            transformRequest: angular.identity
        })
        .success(function () {
        })
        .error(function () {
        });
    };

    this.UploadManagePromoPic = function (file) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('siteId', localStorage.getItem("SiteId"));
        return $http.post('/api/UploadPromotionalPic', fd, {
            withCredentials: true,
            headers: {
                'Content-Type': undefined,
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            transformRequest: angular.identity
        })
        .success(function () {
        })
        .error(function () {
        });
    };
    this.UploadwelcomebackPromoPic = function (file) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('siteId', localStorage.getItem("SiteId"));
        return $http.post('/api/UploadWelcomeBackPromotionalPic', fd, {
            withCredentials: true,
            headers: {
                'Content-Type': undefined,
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            transformRequest: angular.identity
        })
        .success(function () {
        })
        .error(function () {
        });
    };
    this.UploadDoc = function (file) {
        var td = new FormData();
        td.append('file', file);
        return $http.post('/api/UploadDoc', td, {
            withCredentials: true,
            headers: {
                'Content-Type': undefined,
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            transformRequest: angular.identity
        })
    .success(function () {
    })
    .error(function () {
    });
    };

    this.SaveAndUpdateLoginConfiguration = function (loginConfObj, func) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/form/SaveLoginPageConfiguration",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: loginConfObj
        });
    };

    this.DeleteSSID = function (obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/DeleteNetWorkOfSiteId",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: obj
        });
    };

    this.GetPackagesWithSSID = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/GetSSIDPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: Obj
        })
    };

    this.CreatePackageSSID = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/CreateSSIDPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: Obj
        })
    };

    this.UpdatePackageSSID = function (Obj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "/api/UpdateSSIDPackage",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: Obj
        })
    };
    this.CreateAndUpdatePromotion = function (managePromotionObj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/form/SaveManagePromotion",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: managePromotionObj
        });
    };

    this.CreateFormControl = function (createFormControlObj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/form/CreateFormControl",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: createFormControlObj
        })
    };

    this.GetFormControl = function (getFormcontrolObj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/form/GetFormControls",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: getFormcontrolObj
        });
    };

    this.DeleteFormControl = function (deleteFormObj) {
        return $http({
            method: 'POST',
            url: CpServiceUrl + "api/form/DeleteFormControl",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'SiteName': localStorage.getItem('SiteName').toString().trim()
            },
            data: deleteFormObj
        })
    };

    this.IsLocationServicesConfigured = function (SiteId) {
        //$http.defaults.headers.common['Auth-Token'] = 'Bearer' + " " + localStorage.getItem('hdnrtlstoken').toString();
        return $http({
            method:'POST',
            url: localStorage.getItem('rtlsUrl') + "/api/IsRtlsConfigurationExist?SiteId=" + localStorage.getItem('SiteId'),
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer' + " " + localStorage.getItem('hdnrtlstoken').toString()
            }            
        })
    };
    

    this.IsSelfExclusionExist = function (SiteId) {
        debugger;
        return $http({
            method: 'POST',
            url: localStorage.getItem('rtlsUrl') + "/api/IsSelfExclusionExist?SiteId=" + localStorage.getItem('SiteId'),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer' + " " + localStorage.getItem('hdnrtlstoken').toString()
            }
        })
    };

}]);