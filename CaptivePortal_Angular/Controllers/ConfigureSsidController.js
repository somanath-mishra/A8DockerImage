wifiModule.controller('ConfigureSsidController', ['$scope', 'ConfigureSsidService', '$rootScope', '$window', function ($scope, ConfigureSsidService, $rootScope, $window) {
    var localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), ControllerIpAddress: localStorage.getItem("cptUrl").toString().trim() };
    $scope.TCUploaded = false;
    $scope.showMe = false;
    $scope.myFunc = function () {
        $scope.showMe = !$scope.showMe;
    }
    $scope.controlTypeName = null;
    $scope.lstNetWorkOfSites = null;
    $scope.loginConfObj = null;
    $scope.lstSsidName = null;
    $scope.manageProtionObj = null;
    $scope.UpdateFlag = false;
    $scope.editingData = {};
    $scope.editingCurrentData = {};
    $scope.SSIDPackageDetails = null;
    $scope.ItemModalNew = null;
    $scope.AssociateData = null;
    $scope.pageSize = "3";

    $scope.GetSSID = function () {

        $scope.ssidConfigurationView = $scope.UpdateFlag == true ? true : false;
        //debugger;
        ConfigureSsidService.FetchSSID(localStorageItem).then(function successCallback(response) {
            //debugger;
            if (response.status == 200) {
                $scope.lstNetWorkOfSites = response.data.lstNetWorkSiteConfiguration;
                $scope.ddlControlType = response.data.lstControlTypes;
                $scope.ddlSubControlType = response.data.lstSubControlTypes;
                if ($scope.lstNetWorkOfSites.length != 0) {
                    $scope.SiteControllerNameId = $scope.lstNetWorkOfSites[0].Site.SiteControllerName;
                }
                localStorage.setItem("SiteControllerNameId", $scope.SiteControllerNameId);
                $scope.ddlLocationServiceType = [
                { LocServiceTypeId: 10, LocServiceTypeName: 'Area Notification' },
                { LocServiceTypeId: 20, LocServiceTypeName: 'Approach Notification' },
                { LocServiceTypeId: 0, LocServiceTypeName: 'None' }
                ];
            }
            else {
                toastr.error(response.data + "With Status" + response.status);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error("Posting of data failed as" + " " + response.data.Message);
        });

    }

    $scope.GetSiteWithSsid = function (data) {

        ConfigureSsidService.GetSiteWithSsidName(data).then(function successCallback(response) {
            //debugger;
            if (response) {
                $scope.lstSiteWithSsidName = response.data.lstSitedata;

            }
            else {
                toastr.error(response.statusText);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });

    }
    //Get SSID Names according to Site Selected
    $scope.GetSSIDName = function (SiteData) {
        $scope.NetworkOfSiteId = $scope.rowSelectedCpSsid;
        var _data = { 'SiteName': SiteData.SiteName, 'NetWorkOfSiteId': $scope.rowSelectedCpSsid };
        //debugger;
        ConfigureSsidService.GetSsidName(_data).then(function successCallback(response) {
            //debugger;
            if (response) {
                $scope.lstSsidName = response.data.lstssidNames;

            }
            else {
                toastr.error(response.statusText);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });

    }

    $scope.saveAssociateSite = function (lstSiteWithSsidNamesSelected, lstSsidNamesSelected) {
        //debugger;
        AssociateData = { NetWorkOfSiteId: $scope.rowSelectedCpSsid, AssociateNetworkId: lstSsidNamesSelected.NetWorkOfSiteId, SiteId: lstSiteWithSsidNamesSelected.SiteId };

        ConfigureSsidService.saveAssociateSite(AssociateData).then(function successCallback(response) {
            //debugger;
            if (response.data == true) {

                toastr.success("Associate Site Added Successfully");
                location.reload();
            }
            else {
                toastr.error(response.statusText);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }

    $scope.SaveSponsor = function (lstSponsorName, lstSponsorLabel) {
        SponsorData = { NetWorkOfSiteId: $scope.rowSelectedCpSsid, SponsorLabel: lstSponsorLabel, SponsorName: lstSponsorName };

        ConfigureSsidService.saveSponsorData(SponsorData).then(function successCallback(response) {
            if (response.data == true) {
                toastr.success("Sponsor details Added Successfully");
                location.reload();
            }
            else {
                toastr.error(response.statusText);
            }
        }, function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }


    $scope.ConntrollerIpAddress = localStorage.getItem("cptUrl");
    $scope.SaveAndShowControllerSSIDInTable = function () {
        ConfigureSsidService.CreateAndFetchSSID(localStorageItem).then(function successCallback(response) {
            if (response.status = 200) {
                $scope.IsVisibleControllerSsid = false;
                $scope.ssidConfigurationView = false;
                //If DIV is visible it will be hidden and vice versa.
                // $scope.setSelected($rootScope.networkConfObj.NetworkOfSiteId, $rootScope.networkConfObj)
                $scope.GetSSID();
                $scope.IsVisibleControllerSsid = $scope.IsVisibleControllerSsid ? false : true;
                $scope.SSIdDetail = response.data;
            } else {
                toastr.warning(response.data + "With Status" + response.status);
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    }

    $scope.ConfirmDeleteControllerSSIDInTable = function () {
        $('#mi-modal').modal('show');
    }

    $scope.DeleteControllerSSIDInTable = function () {
        var localStorageItem = { NetWorkOfSiteId: $scope.rowSelectedCpSsid };
        ConfigureSsidService.DeleteSSID(localStorageItem).then(function successCallback(response) {
            if (response.status = 200) {
                toastr.success("SSID deleted successfully");
                location.reload();
                //$('#mi-modal').modal('hide');
            } else {
                toastr.warning(response.data + "With Status" + response.status);
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    }


    $scope.PreviewLoginPage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        var Station_mac = document.getElementById("Device").value;
        var ssid = $rootScope.networkConfObj.SsidName;
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");
        var SiteControllerNameid = localStorage.getItem("SiteControllerNameId");
        if (SiteControllerNameid == 10) {
            var url = WifiUserPageUrl + "index.aspx?" + "&ssid=" + ssid + "&Station_mac=" + Station_mac + "&server_ip=" + Server_ip + "&RequestPreview=" + true;

        }
        else if (SiteControllerNameid == 20) {
            var url = WifiUserPageUrl + "index.aspx?" + "&ssid=" + ssid + "&client_mac=" + Station_mac + "&sip=" + Server_ip + "&RequestPreview=" + true;

        }
        $window.open(url, "popup", "width=600,height=500,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/loginpage.aspx?ssid=Deezer&station_mac=7c:c5:37:c0:d3:d3&server-ip=212.38.75.169", "popup", "width=300,height=200,left=10,top=150");
    }

    $scope.PreviewRegistrationPage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        var Station_mac = document.getElementById("Device").value.trim();
        var ssid = $rootScope.networkConfObj.SsidName.trim();
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");
        var SiteControllerNameid = localStorage.getItem("SiteControllerNameId");
        if (SiteControllerNameid == 10) {
            var url = WifiUserPageUrl + "index.aspx?" + "&ssid=" + ssid + "&station_mac=" + Station_mac + "&server_ip=" + Server_ip;

        }
        else if (SiteControllerNameid == 20) {
            var url = WifiUserPageUrl + "index.aspx?" + "&ssid=" + ssid + "&client_mac=" + Station_mac + "&sip=" + Server_ip;

        }
        $window.open(url, "popup", "width=600,height=500,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/registerpage.aspx?ssid=Deezer&station_mac=7c:c5:37:c0:d3:d3&server-ip=212.38.75.169", "popup", "width=300,height=200,left=10,top=150");
    }


    $scope.PreviewSuccessPage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        //var Station_mac = document.getElementById("Device").value;
        var ssid = $rootScope.networkConfObj.SsidName;
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");
        var url = WifiUserPageUrl + "authentication_success.html?ssid=" + ssid + "&server-ip=" + Server_ip;
        $window.open(url, "popup", "width=600,height=500,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/authentication_success.html?ssid=Deezer&server-ip=212.38.75.169");
    }
    $scope.PreviewUsagePage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        var Station_mac = document.getElementById("Device").value;
        var ssid = $rootScope.networkConfObj.SsidName;
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");

        var url = WifiUserPageUrl + "index.aspx?ssid=" + ssid + "&Station_mac=" + Station_mac + "&server_ip=" + Server_ip;
        $window.open(url, "popup", "width=600,height=500,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/StatusPage.aspx?ssid=Deezer&station_mac=7c:c5:37:c0:d3:d3&server-ip=212.38.75.169", "popup", "width=300,height=200,left=10,top=150");
    }
    $scope.PreviewStatusPage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        var Station_mac = document.getElementById("Device").value;
        var ssid = $rootScope.networkConfObj.SsidName;
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");
        var url = WifiUserPageUrl + "Thomson/Status?ssid=" + ssid + "&server-ip=" + Server_ip;
        //  var url = WifiUserPageUrl + "StatusPage.aspx?ssid=" + ssid + "&Station_mac=" + Station_mac + "&server_ip=" + Server_ip;
        $window.open(url, "popup", "width=600,height=500,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/StatusPage.aspx?ssid=Deezer&station_mac=7c:c5:37:c0:d3:d3&server-ip=212.38.75.169", "popup", "width=300,height=200,left=10,top=150");
    }

    $scope.PreviewUsagePage = function () {
        var Server_ip = localStorage.getItem("cptUrl");
        var Station_mac = document.getElementById("Device").value;
        var ssid = $rootScope.networkConfObj.SsidName;
        var WifiUserPageUrl = localStorage.getItem("WifiUserPageUrl");
        var url = WifiUserPageUrl + "index.aspx?ssid=" + ssid + "&Station_mac=" + Station_mac + "&server_ip=" + Server_ip;
        $window.open(url, "popup", "width=1100,height=600,left=150,top=150");

        //$window.open("http://portal1.airloc8.com:84/UsagePage.aspx?ssid=Deezer&station_mac=7c:c5:37:c0:d3:d3&server-ip=212.38.75.169", "popup", "width=300,height=200,left=10,top=150");
    }

    $scope.chckedIndexs = [];
    $scope.checkedCheckBoxIndex = function (SSid) {
        if ($scope.chckedIndexs.indexOf(SSid) === -1) {
            $scope.chckedIndexs.push(SSid);
        }
        else {
            $scope.chckedIndexs.splice($scope.chckedIndexs.indexOf(SSid), 1);
        }
    }

    $scope.saveSSidToCp = function () {
        $scope.chckedIndexs;
        ConfigureSsidService.UpdateSsidConf($scope.chckedIndexs).then(function successCallback(response) {
            if (response.status == 200) {
                $scope.IsVisibleControllerSsid = false;
                $scope.GetSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    }

    $scope.updateSelection = function (position, lstNetWorkOfSites) {
        angular.forEach(lstNetWorkOfSites, function (SSid, index) {
            SSid.checked = false;
            if (position == index)
                SSid.checked = true;
        });
    }

    $scope.rowSelectedCpSsid = null;
    $scope.selectedRowScope = [];

    //Get Associate Per SSID select
    $scope.GetAssociatePerSSIDselect = function () {
        ConfigureSsidService.GetAssociatePerSSID($scope.rowSelectedCpSsid).then(function successCallback(response) {
            if (response) {
                $scope.lstAssociatePerSsid = response.data.lstassociateNetworks;
            }
            else {
                toastr.error(response.statusText);
            }
        },
        function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }

    //Get Sponsors Per SSID select
    $scope.GetSponsorsPerSSIDselect = function () {
        ConfigureSsidService.GetSponsorsPerSSID($scope.rowSelectedCpSsid).then(function successCallback(response) {
            if (response) {
                $scope.lstSponsorsPerSsid = response.data.lstSponsors;
            }
            else {
                toastr.error(response.statusText);
            }
        },
        function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }

    //Delete Associate Per SSID select
    $scope.DeleteAssociateSite = function (Id) {
        ConfigureSsidService.DeleteAssociatePerSSID(Id).then(function successCallback(response) {

            if (response) {
                $scope.lstDeleteAssociatePerSsid = response;
            }
            else {
                toastr.error(response.statusText);
            }
        },
        function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }

    //Delete Sponsor
    $scope.DeleteSponsor = function (Id) {
        ConfigureSsidService.DeleteSponsor(Id).then(function successCallback(response) {

            if (response) {
                toastr.success("Sponsor Deleted Successfully");
            }
            else {
                toastr.error(response.statusText);
            }
        },
        function errorCallback(response) {
            console.log(response);
            toastr.error(response.statusText);
        });
    }

    //Update Sponsor

            $scope.UpdateSponsor = function (sponsorId, lstSponsorName, lstSponsorLabel) {
                SponsorData = {
                    NetWorkOfSiteId: $scope.rowSelectedCpSsid, SponsorLabel: lstSponsorLabel, SponsorName: lstSponsorName, SponsorId:sponsorId
                };

                ConfigureSsidService.updateSponsorData(SponsorData).then(function successCallback(response) {
                    if (response.data == true) {
                        toastr.success("Sponsor details Updated Successfully");
                        location.reload();
                    }
                    else {
                        toastr.error(response.statusText);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    toastr.error(response.statusText);
                });
            }

    //Update Sponsor

            $scope.UpdateSponsor = function (sponsorId, lstSponsorName, lstSponsorLabel) {
                SponsorData = {
                    NetWorkOfSiteId: $scope.rowSelectedCpSsid, SponsorLabel: lstSponsorLabel, SponsorName: lstSponsorName, SponsorId:sponsorId
                };

                ConfigureSsidService.updateSponsorData(SponsorData).then(function successCallback(response) {
                    if (response.data == true) {
                        toastr.success("Sponsor details Updated Successfully");
                        location.reload();
                    }
                    else {
                        toastr.error(response.statusText);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    toastr.error(response.statusText);
                });
            }


    $scope.setSelected = function (rowSelectedCpSsid, networkDetails) {
        $scope.formFieldList = null;
        $scope.rowSelectedCpSsid = rowSelectedCpSsid;
        $scope.GetAssociatePerSSIDselect($scope.rowSelectedCpSsid);
        $scope.GetSponsorsPerSSIDselect($scope.rowSelectedCpSsid);
        $scope.IsVisibleControllerSsid = false;
        $scope.ssidConfigurationView = true;
        if (networkDetails.Status == "Not Found") {
            $scope.DeleteSsid = true;
        }
        else {
            $scope.DeleteSsid = false;
        }
        //var index = $scope.lstNetWorkOfSites.findIndex(x => x.NetWorkOfSiteId === rowSelectedCpSsid);
        var index = -1;
        for (var i = 0; i < $scope.lstNetWorkOfSites.length; ++i) {
            if ($scope.lstNetWorkOfSites[i].NetWorkOfSiteId == rowSelectedCpSsid) {
                index = i;
                break;
            }
        }

        $rootScope.networkConfObj = $scope.lstNetWorkOfSites[index];
        //if ($rootScope.networkConfObj.SubControlTypeId == 2)
        //{
        //    document.getElementById('BeSpoke-PageName').style.visibility = "visible";
        //}
        //else
        //{
        //    document.getElementById('BeSpoke-PageName').style.visibility = "hidden";
        //}
        $rootScope.networkConfObj = $scope.lstNetWorkOfSites[index];
        $rootScope.networkConfObj.LocServiceTypeId = $rootScope.networkConfObj.LocServiceTypeId.toString();
        if ($rootScope.networkConfObj.LocServiceTypeId != 0) {
            $scope.checked = true;
        }
        else
            $scope.checked = false;
        if ($rootScope.networkConfObj.TermsAndCondDoc != null) {
            $scope.TCUploaded = true;
        }
        $scope.loginConfObj = $scope.lstNetWorkOfSites[index].Forms;
        if ($scope.loginConfObj) {
            $scope.manageProtionObj = $scope.lstNetWorkOfSites[index].Forms.ManagePromotion;
            if (networkDetails.ControlType != null) {
                ConfigureSsidService.GetFormControl($scope.loginConfObj).success(function (getFormControlResp) {
                    $scope.formFieldList = getFormControlResp;
                },
                 function (error) {
                     console.log(error);
                 });
            } else {
                $scope.formFieldList = null;
            }
        }
    }

    $scope.termAndConditionChange = function (data) {
        $rootScope.networkConfObj.TermsAndCondDoc = data.value;
    }

    $scope.fileNameBannerIconSSIDChanged = function (data) {
        $rootScope.networkConfObj.SsidLogo = data.value;
    }

    $scope.fileNameSuccessPageChanged = function (data) {
        $rootScope.networkConfObj.Forms.ManagePromotion.OptionalPictureForSuccessPage = data.value;
    }

    $scope.UploadFile = function () {
        var file = $scope.myFile;
        ConfigureSsidService.UploadIcon(file).then(function successCallback(response) {
            $rootScope.networkConfObj.SsidLogo = response.data.ssidIconPath;
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    $scope.UploadTandD = function () {
        var file = $scope.myDoc;
        ConfigureSsidService.UploadDoc(file).then(function successCallback(tdResp) {
            $scope.TCUploaded = true;
            $rootScope.networkConfObj.TermsAndCondDoc = tdResp.data;
            // $scope.networkConfObj.s
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    $scope.UploadPromotionPic = function () {
        var file = $scope.myPromotionPic;
        ConfigureSsidService.UploadManagePromoPic(file).then(function successCallback(promoResp) {
            $rootScope.networkConfObj.Forms.ManagePromotion.OptionalPictureForSuccessPage = promoResp.data.promoPicPath;
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };
    $scope.UploadwelcomebackpromotionPic = function () {
        var file = $scope.welcomePromotionPic;
        //debugger;
        ConfigureSsidService.UploadwelcomebackPromoPic(file).then(function successCallback(promoResp) {
            $rootScope.networkConfObj.Forms.ManagePromotion.OptionalPictureForWelcomeBackPage = promoResp.data.welcomeBackPicPath;
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    $scope.CreateAndUpdateLoginConfiguration = function (formFieldList) {

        if (!$rootScope.networkConfObj.SubControlType) {
            toastr.warning("Select the SubControlType");
            return false;
        }

        var objForm = { lstFormControl: formFieldList, Form: $scope.loginConfObj, NetworkOfSiteId: $rootScope.networkConfObj.NetWorkOfSiteId, SubControlTypeId: $rootScope.networkConfObj.SubControlType.SubControlTypeId, BeSpokePageName: $rootScope.networkConfObj.BeSpokePageName }
        if ($scope.loginConfObj.IsSecurityKeyRequire == true) {
            objForm = { lstFormControl: formFieldList, Form: $scope.loginConfObj, NetworkOfSiteId: $rootScope.networkConfObj.NetWorkOfSiteId, SubControlTypeId: $rootScope.networkConfObj.SubControlType.SubControlTypeId, SecurityKey: $rootScope.networkConfObj.SecurityKey }
        }

        ConfigureSsidService.SaveAndUpdateLoginConfiguration(objForm).then(function successCallback(response) {
            if (response.status == 200) {
                toastr.success("Data saved successfully");
                $scope.setSelected($rootScope.networkConfObj.NetWorkOfSiteId, $rootScope.networkConfObj);
            }
        },
            function errorCallback(response) {
                toastr.error(response.statusText);
            });
    };

    $scope.SaveManagePromotion = function () {
        if (!$rootScope.networkConfObj.Forms) {
            toastr.warning("Select the Success Page Options");
            return false;
        }

        $scope.manageProtionObj.SSId = $rootScope.networkConfObj.NetWorkOfSiteId;
        $scope.manageProtionObj.FormId = $rootScope.networkConfObj.NetWorkOfSiteId;
        ConfigureSsidService.CreateAndUpdatePromotion($scope.manageProtionObj).then(function successCallback(response) {
            if (response.status == 200) {
                $scope.setSelected($rootScope.networkConfObj.NetWorkOfSiteId, $rootScope.networkConfObj);
                toastr.success("Data saved successfully");
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    $scope.SaveFormControlLoginConf = function () {
        var index = -1;
        if ($scope.formFieldList) {
            for (var i = 0; i < $scope.formFieldList.length; ++i) {
                if ($scope.formFieldList[i].LabelName == $scope.FormControls.LabelName) {
                    index = i;
                    break;
                }
            }
        }
        
        if (index === -1) {
            $scope.FormControls.FormId = $scope.loginConfObj.NetworkOfSiteId;
            ConfigureSsidService.CreateFormControl($scope.FormControls).then(function successCallback(response) {
                if (response.status == 200) {
                    $('#myModal').modal('hide');
                    $scope.setSelected($rootScope.networkConfObj.NetWorkOfSiteId, $rootScope.networkConfObj);
                    toastr.success("Data saved successfully");
                    //location.reload();
                }
            }, function errorCallback(response) {
                toastr.error(response.statusText);
            });
        }
        else {
            toastr.warning("Already From Control Exist with this Name " + $scope.FormControls.LabelName);
        }
    };

    $scope.DeleteFormControlLoginConf = function (objFormControl) {
        ConfigureSsidService.DeleteFormControl(objFormControl).then(function successCallback(response) {
            if (response.status == 200) {
                $scope.setSelected($rootScope.networkConfObj.NetworkOfSiteId, $rootScope.networkConfObj);
                $scope.GetSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    //$scope.FetchFormControl = function () {
    //    ConfigureSsidService.GetFormControl().then(function successCallback(response) {
    //        if (response.status == 200) {
    //            $scope.GetSSID();
    //        }
    //    }, function errorCallback(response) {
    //        alert(response.statusText);
    //    });
    //};


    $scope.updateSelectionforLocServices = function () {
        if ($scope.checked) {
            ConfigureSsidService.IsLocationServicesConfigured(localStorage.getItem("SiteId")).then(function successCallback(response) {
                if (response.data == "RtlsConfigNotExist") {
                    toastr.warning("Rtls is not configured");
                    $scope.checked = false;
                    $scope.networkConfObj.LocServiceTypeId = 0;
                    //$scope.ddlLocationServiceType.LocServiceTypeId = 0;
                    return false;
                }
                else if (response.data == "RtlsConfigExist") {
                    ConfigureSsidService.IsSelfExclusionExist(localStorage.getItem("SiteId")).then(function successCallback(response) {
                        if (response.data == "SelfExclusionExist") {
                            toastr.warning("SelfExclusion already exist With different SSID");
                            $scope.checked = false;
                            $scope.networkConfObj.LocServiceTypeId = 0;
                            //$scope.ddlLocationServiceType.LocServiceTypeId = 0;
                            return false;
                        }

                    }, function errorCallback(response) {
                        alert("Some error occured. Please contact admin...");
                    });


                }
            }, function errorCallback(response) {
                alert("Some error occured. Please contact admin...");
            });
        }
    };


    //$(document).on('click', '#chkLocationServices', function () {
    //    $.ajax({
    //        url: localStorage.getItem('rtlsUrl') + "/api/IsRtlsConfigurationExist?SiteId=" + localStorage.getItem('SiteId'),
    //        type: "POST",
    //        beforeSend: function (xhr) {
    //            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
    //        },
    //        success: function (response) {
    //            alert("Success")
    //            //location.reload();
    //        }
    //    });
    //});
    $scope.CreateOrUpdatePrimarySetUp = function () {
        //if (!$rootScope.networkConfObj.TermsAndCondDoc) {
        //    toastr.warning("Please upload Terms & Conditions");
        //    return false;
        //}

        if ($scope.TCUploaded != true) {
            toastr.warning("Please upload Terms & Conditions");
            return false;
        }

        if (!$rootScope.networkConfObj.ControlType) {
            toastr.warning("Please select the Control Type");
            return false;
        }
        if ($scope.checked && $scope.networkConfObj.LocServiceTypeId == 0) {
            toastr.warning("Please select the Location ServiceType or disable Location Service");
            return false;
        }
        if (!$scope.checked && $scope.networkConfObj.LocServiceTypeId != 0) {
            toastr.warning("Please select the checkbox for Location Service");
            return false;
        }
        $scope.UpdateFlag = true;

        ConfigureSsidService.CreatePrimarySetup($rootScope.networkConfObj, $scope.GetSSID).then(function successCallback(response) {
            if (response.status == 200) {
                toastr.success("Data saved successfully");
                //$scope.GetSSID();
                $scope.ssidConfigurationView = $scope.UpdateFlag == true ? true : false;

                ConfigureSsidService.FetchSSID(localStorageItem).then(function successCallback(response) {

                    if (response.status == 200) {
                        $scope.lstNetWorkOfSites = response.data.lstNetWorkSiteConfiguration;
                        $scope.ddlControlType = response.data.lstControlTypes;
                        $scope.ddlSubControlType = response.data.lstSubControlTypes;
                        $scope.setSelected($rootScope.networkConfObj.NetWorkOfSiteId, $rootScope.networkConfObj);
                        if ($scope.networkConfObj.ControlType.ControlTypeName != 'Login' || $scope.networkConfObj.ControlType.ControlTypeName != 'MeetGreet') {
                            $scope.loginConfObj.IsSecurityKeyRequire == false;
                        }
                    }
                    else {
                        toastr.error(response.data + "With Status" + response.status);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    toastr.error("Posting of data failed as" + " " + response.data.Message);
                });
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    }

    $scope.totalCount = "0";

    $scope.GetPackagePerSSID = function () {
        $('#dtFromToDate').daterangepicker({
            timePicker: true,
            timePicker24Hour: true,
            timePickerIncrement: 1,
            locale: {
                format: 'MM/DD/YYYY H:mm'
            }
        });
        $scope.UsageConfigurationView = false;
        ConfigureSsidService.GetPackagesWithSSID($rootScope.networkConfObj).then(function successCallback(response) {
            //$scope.SSIDPackageDetails = getSSIDPackage;            
            if (response.status == 200) {
                $scope.curPage = 0;
                //$scope.pageSize = 3;
                $scope.PackageDetails = response.data.lstPackage;                
                $scope.SSIDDetails = response.data.lstSSSIDPackage;
                $scope.numberOfPages = Math.ceil($scope.PackageDetails.length / $scope.pageSize);                
                //$("#table").load($scope.PackageDetails);
            }
            var netWorkObj = $scope.networkConfObj;
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

    //$scope.GetPackagePerSSID = function (n) {
    //    $('#dtFromToDate').daterangepicker({
    //        timePicker: true,
    //        timePicker24Hour: true,
    //        timePickerIncrement: 1,
    //        locale: {
    //            format: 'DD/MM/YYYY H:mm'
    //        }
    //    });
    //    $scope.UsageConfigurationView = false;
    //    ConfigureSsidService.GetPackagesWithSSID($rootScope.networkConfObj).then(function successCallback(response) {
    //        //$scope.SSIDPackageDetails = getSSIDPackage;
    //        var NumberOfLines = response.data.lstPackage.length;
    //        if (response.status == 200) {
    //            if ($("#NumberOfLines").val() < 0) {
    //                $scope.totalCount = 1;
    //            }
    //            else {
    //                NumberOfLines = $("#NumberOfLines").val();
    //                $scope.totalCount = Math.ceil((response.data.lstPackage.length) / NumberOfLines);
    //            }
    //            var start=0;
    //            if (n >= 1)
    //            {
    //               start = (n - 1) * NumberOfLines;
    //            }
                
    //            //var end =  start + NumberOfLines;
    //            $scope.PackageDetails = response.data.lstPackage;
    //           $scope.PackageDetails = $scope.PackageDetails.slice(start);
    //            $scope.SSIDDetails = response.data.lstSSSIDPackage;

    //        }
    //        //var netWorkObj = $scope.networkConfObj;
    //    }, function errorCallback(response) {
    //        toastr.error(response.statusText);
    //    });
    //};



    $scope.FilterUserDetails = function () {

    }

    $scope.DisplaySecureKey = function () {
        if ($scope.networkConfObj.ControlType.ControlTypeName == 'Login' || $scope.networkConfObj.ControlType.ControlTypeName == 'MeetGreet') {
            $('#Require-SecurityKey').show();
            if ($scope.loginConfObj.IsSecurityKeyRequire == true) {
                $('#securekey-input').show();
            }
        } else {
            $('#Require-SecurityKey').hide();
            $('#securekey-input').hide();
        }

    };
    $scope.PasswordChlick = function () {
        if ($scope.loginConfObj.IsPasswordRequire == true) {
            $scope.loginConfObj.IsSecurityKeyRequire = false;
            //$scope.networkConfObj.SecureKey = '';
            $('#securekey-input').hide();
        }

    };

    $scope.ShowSecureKeyField = function () {

        if ($scope.loginConfObj.IsSecurityKeyRequire == true) {
            $scope.loginConfObj.IsPasswordRequire = false;
            $('#securekey-input').show();

        } else {
            $('#securekey-input').hide();
            //$scope.networkConfObj.SecureKey = '';

        }

    };
    $scope.SsidPackageId = "";
    $scope.ShowAuditData = function (PackageId) {
        $scope.SsidPackageId = PackageId;
        var range = $('#dtFromToDate').val();
        var dates = range.split(" - ");
        var dtFromDate = dates[0];
        var dtToDate = dates[1];
        ConfigureSsidService.GetAuditHistory(PackageId, dtFromDate, dtToDate).success(function (response) {
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

    $scope.ShowModal = function (data) {
        $scope.ItemModalNew = { FromDateTime: null, Price: 0, ToDateTime: null, PackageId: 0, NetWorkOfSiteId: 0, SSIdPackageId: 0 };
        //var index = $scope.PackageDetails.findIndex(m=>m.PackageId == data); 
        //var SsidPackageId = $rootScope.networkConfObj.SSIdPackageId;
        var NetWorkSiteid = $rootScope.networkConfObj.NetWorkOfSiteId;
        // var NetWorkSiteid = 5;
        $scope.ItemModalNew.PackageId = data;
        $scope.ItemModalNew.NetWorkOfSiteId = NetWorkSiteid;
        //document.getElementById('id01').style.display = 'block';
    };


    //Create the SSID Package
    $scope.CreateSsidPackage = function () {
        ConfigureSsidService.CreatePackageSSID($scope.ItemModalNew).then(function successCallback(response) {
            if (response.status == 200) {
                $('#ModalPackage').modal('hide');
                $scope.GetPackagePerSSID();
            }
        },
            function errorCallback(response) {
                toastr.error(response.statusText);
            });
    };

    ////Update the SSID Package
    //$scope.UpdateSSIDPackage = function (data) {
    //    //var item=data.SSIDPackages;

    //};

    //Update the SSID Package Current
    $scope.UpdateSSIDPackageCurrent = function (data) {
        //var item=data.SSIDPackages;
        ConfigureSsidService.UpdatePackageSSID(data).then(function successCallback(response) {
            if (response.status == 200) {
                $scope.setSelected($rootScope.networkConfObj.NetworkOfSiteId, $rootScope.networkConfObj);
                $scope.GetSSID();
            }
        }, function errorCallback(response) {
            toastr.error(response.statusText);
        });
    };

        $scope.range = function () {
        var input = [];
        for (var i = 1; i <= $scope.totalCount; i++) {
            input.push(i);
        }

        return input;
    };

}]);