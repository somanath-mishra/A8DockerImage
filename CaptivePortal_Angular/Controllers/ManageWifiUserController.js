/// <reference path="ManageWifiUserController.js" />
wifiModule.controller('ManageWifiUserController',['$scope', 'ManageWifiUserService', '$rootScope', function ($scope, ManageWifiUserService, $rootScope) {
    $scope.PageSize;
    $scope.queryText = "";
    $scope.SelectedSSID = "";
    $scope.lstNetWorkOfSitesData = [];
    $scope.UserUsagePackage = false;
    $scope.chkStatus = false;
    $scope.NoAddPost = false;
    $scope.NoAddPostReplace = false;
    $scope.CancelOrConfirm = false;
    $scope.SelectedPackage = "0";
    $scope.RefundPer = "0";
    $scope.Balance = "0";
    $scope.ExtraData = "10";

    $scope.updateSelection = function (position, lstWifiUsersData) {
        angular.forEach(lstWifiUsersData, function (item, index) {
            item.checked = false;
            if (position == index)
                item.checked = true;
        });
    }

    $scope.ShowAuditData = function (UserPackageId) {
        var range = $('#dtFromToDate').val();
        var dates = range.split(" - ");
        var dtFromDate = dates[0];
        var dtToDate = dates[1];
        ManageWifiUserService.GetAuditHistory(UserPackageId, dtFromDate, dtToDate).success(function (response) {
            //alert(response);            
            $('#ModalAudit').modal('show');
            $scope.AuditData = response;
        }, function (error) {
            //alert(error);
        });
    }

    $scope.Reset = function () {        
        $scope.chkStatus = false;
        $scope.NoAddPost = false;
        $scope.NoAddPostReplace = false;
        $scope.CancelOrConfirm = false;
        $scope.SelectedPackage = "0";
        $scope.RefundPer = "0";
        $scope.Balance = "0";       
        $scope.RefundPackage = false;
        $scope.ClosePackage = false;
        $scope.RefundDetails = true;
        $scope.AccountDetails = false;
    }
    $scope.RefundPackage = false;
    $scope.ClosePackage = false;
    $scope.RefundDetails = true;
    $scope.AccountDetails = false;
    $scope.VoidReason = "Refund;"
        
    $scope.EndPackage = function () {
        var item = {
            MacAddress: $scope.UserDetail.MacAddress,
            ServerIp: $scope.UserDetail.NasIpAddress
        }
        ManageWifiUserService.LogOutUser(item).success(function (result) {
        }, function (error) {
        });
    }

    $scope.RefundOrReplacePackage = function () {
        $scope.RefundDetails = true;
        $scope.AccountDetails = false;
        $scope.RefundPer = "0";
        $scope.CancelOrConfirm = false;
        angular.forEach($scope.SSIDDetails, function (value, key) {
            if ($scope.SelectedPackage == value.Package.PackageId.toString()) {
                $scope.PackgId = value.Package.PackageId;
                $scope.NewPackageName = value.Package.PackageName;
                $scope.PackageId=value.SSIdPackageId;
                $scope.PackageType=value.Package.PackageType;
                $scope.PackageLimit = value.Package.PackageLimit;
                $scope.PackageValidity = value.Package.PackageValidity;
            }

        });

        //Providing only New Package with No Refund
        var itemtoAdd = {
            UserName:$scope.UserDetail.UserName,
            Price:$scope.AddPostReplace, 
            PackageName: $scope.NewPackageName
        }

        if ($scope.AddPostReplace > 1 && !$scope.checkboxchkd) {
            if ($scope.CurrentPackage)
            {
                //alert("Current Package Exists");
                var item = {
                    MacAddress:$scope.UserDetail.MacAddress,
                    ServerIp:$scope.UserDetail.NasIpAddress
                }
                ManageWifiUserService.LogOutUser(item).success(function (result) {
                }, function (error) {
                });
            }           
            ManageWifiUserService.AddPackage(itemtoAdd).success(function (result) {
                $scope.status = result.Result.Result.Status;

                if ($scope.status == "A") {
                    var itemtoAddtoDb = {
                        NetWorkOfSiteId:$scope.SelectedSSID,
                        CredentialUserName:$scope.UserDetail.CredentialUserName,
                        PackageId:$scope.PackgId,
                        SSIdPackageId: $scope.PackageId,
                        UserId: $scope.UserDetail.WifiUserId,
                        TransactionId: result.Result.Transaction.TransactionId,
                        PostingId: result.Result.PostingList.Posting.PostingId,
                        PackageType: $scope.PackageType,
                        PackageLimit: $scope.PackageLimit,
                        PricePaid: $scope.AddPostReplace
                    }
                    ManageWifiUserService.AddPackagetoDb(itemtoAddtoDb).success(function (result) {
                        $scope.setSelectedItem($scope.idSelectedItem, $scope.SelectedUser);
                        $scope.Reset();
                    }, function (error) {
                    });
                }
            }, function (error) {

            });
        }

        //Providing refund and NewPackage
        if ($scope.checkboxchkd) {
                //Void Post
                var itemtoRefund = {
                    TransactionId: $scope.CurrentPackage.TransactionId,
                    PostingId: $scope.CurrentPackage.PostingId,
                    VoidReason: $scope.VoidReason
                }

                if ($scope.CurrentPackage.PricePaid > 1) {
                    ManageWifiUserService.RefundPackage(itemtoRefund).success(function (result) {
                        $scope.status = result.Result.Result.Status;

                        if ($scope.status == "A") {
                            var itemtoAddtoDb = {
                                SSIdPackageId: $scope.CurrentPackage.SSIDPackageId,
                                UserId: $scope.UserDetail.WifiUserId,
                                TransactionId: $scope.CurrentPackage.TransactionId,
                                PostingId: $scope.CurrentPackage.PostingId,
                                PackageType: $scope.CurrentPackage.PackageType,
                                PackageLimit: $scope.CurrentPackage.PackageLimit,
                                PricePaid: -$scope.CurrentPackage.PricePaid,
                                PackageStartTime: $scope.CurrentPackage.PackageStartTime,
                                PackageEndTime:$scope.CurrentPackage.PackageEndTime
                            }
                            ManageWifiUserService.VoidPackagetoDb(itemtoAddtoDb).success(function (result) {

                                //Add Post
                                var itemtoAddAfterRefund = {
                                    UserName: $scope.UserDetail.UserName,
                                    //Price: $scope.AddPost * 10,
                                    Price: $scope.AddPost * $scope.CurrentPackage.PricePaid,
                                    PackageName: $scope.CurrentPackage.PackageName
                                }

                                ManageWifiUserService.AddPackage(itemtoAddAfterRefund).success(function (result) {
                                    $scope.status = result.Result.Result.Status;

                                    if ($scope.status == "A") {
                                        if ($scope.chkStatus && !$scope.SelectedPackage>0)
                                        var itemtoAddtoDb = {
                                            SSIdPackageId: $scope.CurrentPackage.SSIDPackageId,
                                            UserId: $scope.UserDetail.WifiUserId,
                                            TransactionId: result.Result.Transaction.TransactionId,
                                            PostingId: result.Result.PostingList.Posting.PostingId,
                                            PackageType: $scope.CurrentPackage.PackageType,
                                            PackageLimit: $scope.CurrentPackage.PackageLimit,
                                            PricePaid: $scope.AddPost * $scope.CurrentPackage.PricePaid,
                                            PackageStartTime: $scope.CurrentPackage.PackageStartTime,
                                            PackageEndTime: new Date().toJSON(),
                                            IsActive:"false"
                                        }
                                    else
                                        var itemtoAddtoDb = {
                                            SSIdPackageId: $scope.CurrentPackage.SSIDPackageId,
                                            UserId: $scope.UserDetail.WifiUserId,
                                            TransactionId: result.Result.Transaction.TransactionId,
                                            PostingId: result.Result.PostingList.Posting.PostingId,
                                            PackageType: $scope.CurrentPackage.PackageType,
                                            PackageLimit: $scope.CurrentPackage.PackageLimit,
                                            PricePaid: $scope.AddPost * $scope.CurrentPackage.PricePaid,
                                            PackageStartTime: $scope.CurrentPackage.PackageStartTime,
                                            PackageEndTime: $scope.CurrentPackage.PackageEndTime,
                                            IsActive:"true"
                                        }
                                        ManageWifiUserService.AddPackagetoDb1(itemtoAddtoDb).success(function (result) {

                                            var itemtoAdd = {
                                                UserName: $scope.UserDetail.UserName,
                                                Price: $scope.AddPostReplace,
                                                PackageName: $scope.NewPackageName
                                            }
                                            if ($scope.SelectedPackage>0) {

                                                ManageWifiUserService.AddPackage(itemtoAdd).success(function (result) {
                                                    $scope.status = result.Result.Result.Status;

                                                    if ($scope.status == "A") {
                                                        var itemtoAddtoDb = {
                                                            NetWorkOfSiteId: $scope.SelectedSSID,
                                                            CredentialUserName: $scope.UserDetail.CredentialUserName,
                                                            PackageId: $scope.PackgId,
                                                            SSIdPackageId: $scope.PackageId,
                                                            UserId: $scope.UserDetail.WifiUserId,
                                                            TransactionId: result.Result.Transaction.TransactionId,
                                                            PostingId: result.Result.PostingList.Posting.PostingId,
                                                            PackageType: $scope.PackageType,
                                                            PackageLimit: $scope.PackageLimit,
                                                            PricePaid: $scope.AddPostReplace,
                                                            PackageValidity: $scope.PackageValidity                                                       
                                                        }
                                                        ManageWifiUserService.AddPackagetoDb(itemtoAddtoDb).success(function (result) {
                                                            $scope.setSelectedItem($scope.idSelectedItem, $scope.SelectedUser);
                                                            $scope.Reset();
                                                        }, function (error) {
                                                        });
                                                    }
                                                }, function (error) {

                                                });
                                            }
                                            $scope.setSelectedItem($scope.idSelectedItem, $scope.SelectedUser);
                                            $scope.Reset();
                                        }, function (error) {
                                        });
                                    }
                                }, function (error) {

                                });

                            }, function (error) {
                            });
                        }
                    }, function (error) {

                    });
                }            
        }        
    }

    $scope.ShowAccountDetails = function () {        
        if ($scope.RefundPer > 0 && (!$scope.chkStatus) && ($scope.SelectedPackage <= 0))
        {
            $scope.Operation = "REFUND" + " " + $scope.selectedvalues + "%";
        }
        if ($scope.RefundPer > 0 && ($scope.chkStatus) && ($scope.SelectedPackage <= 0))
        {
            $scope.Operation = "CLOSE, REFUND" + " " + $scope.selectedvalues + "%";
        }
        if ($scope.RefundPer > 0 && ($scope.chkStatus) && ($scope.SelectedPackage > 0)) {
            $scope.Operation = "RENEW, REFUND" + " " + $scope.selectedvalues + "%";
        }
        if ($scope.RefundPer <= 0 && (($scope.chkStatus) || ($scope.SelectedPackage > 0))) {
            $scope.Operation = "RENEW" + " " + "NEW PACKAGE";
        }            

        $scope.RefundDetails = false;
        $scope.AccountDetails = true;
        $scope.CancelOrConfirm = true;
        if($scope.selectedvalues==100)
        {
            $scope.NoAddPost = false;
            $scope.NoVoidPost = true;
        }
        if (($scope.RefundPer > 0 && !$scope.checkboxchkd) || ($scope.RefundPer == 0 && $scope.checkboxchkd))
        {
            $scope.NoAddPost = false;
            $scope.NoVoidPost = false;
            $scope.RefundDetails = true;
            $scope.AccountDetails = false;
            $scope.CancelOrConfirm = false;
            //toastr.warning("Incorrect option selected");
        }
        else
        {
            $scope.RefundDetails = false;
            $scope.AccountDetails = true;
            $scope.CancelOrConfirm = true;
            $scope.NoAddPost = true;
            $scope.NoVoidPost = true;
        }
        if($scope.SelectedPackage==0)
        {
            $scope.NoAddPostReplace = false;
            $scope.AddPostReplace = "";
        }
        else
        {
            $scope.NoAddPostReplace = true;
            angular.forEach($scope.SSIDDetails, function(value, key){
                if($scope.SelectedPackage==value.Package.PackageId.toString())
                {
                    $scope.AddPostReplace = value.Price;
                }                    
            });            
        }            
    };

    $scope.ShowRefundDetails = function () {
        $scope.RefundDetails = true;
        $scope.AccountDetails = false;
        $scope.CancelOrConfirm = false;
    };

    $scope.getRefundPer = function () {
        if ($scope.RefundPer == 1)
        {
            $scope.selectedvalues = 100 - $scope.CurrentPackage.PerDataUsed;
            $scope.AddPost = (100 - $scope.selectedvalues) / 100;
        }
        else {
            $scope.selectedvalues = $scope.RefundPer;
            $scope.AddPost = (100 - $scope.selectedvalues) / 100;
        }
    }

    $scope.NewPackage = false;

    $scope.ShowHideDiv = function () {
        if ($scope.chkStatus) {
            $scope.NewPackage = true;
        var item = {
                NetWorkOfSiteId: $scope.SelectedSSID
        };
        ManageWifiUserService.GetPackagesWithSSID(item).success(function (result) {
            $scope.SSIDDetails = result.lstSSSIDPackage;


        }, function (error) { });
        }
        else {
            $scope.NewPackage = false;
            $scope.SelectedPackage = 0;
        }        
    }
    
    var localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: 1 };
    $scope.GetwifiUserDetails = function () {

        $('.checkbox-list').not(this).prop('checked', false);
        $scope.UserUsagePackage = false;
        ManageWifiUserService.GetAllWifiUsersWithNetWorkOfSite(localStorageItem).success(function (data) {
            $scope.lstWifiUsersData = data.lstWifiUser;
            $scope.pageCount = data.TotalPages;
            //$scope.lstAgeData = data.lstAge;
            //$scope.lstGenderData = data.lstGender;
        }, function (error) { });
    }

    $scope.GetSSIDAsPerSite = function () {
        ManageWifiUserService.FetchSSID(localStorageItem).success(function (data) {
            if (localStorage.getItem("NetworkSiteIds")) {
                //console.log($scope.lstNetWorkOfSitesData);
                $scope.lstNetWorkOfSitesData = [];
                var ids = localStorage.getItem("NetworkSiteIds").toString().split(",");
                if (ids.length > 0 && data.lstNetWorkOfSites.length > 0) {
                    angular.forEach(data.lstNetWorkOfSites, function (item) {
                        if (ids.indexOf(item.NetWorkOfSiteId.toString()) != -1)
                            $scope.lstNetWorkOfSitesData.push(item);
                    });
                }
            }
            else {
                $scope.lstNetWorkOfSitesData = data.lstNetWorkOfSites;
            }
        }, function (error) { });      
    }

    $scope.idSelectedItem = null;
    $scope.SelectedUser = null;
    $scope.setSelectedItem = function (value, User) {
        $scope.Reset();       
        $scope.idSelectedItem = value;
        $scope.SelectedUser = User;
        $scope.UserUsagePackage = true;
        ManageWifiUserService.GetUsagePackages(User, $scope.SelectedSSID).success(function (result) {
            $scope.CurrentPackage = result.CurrentUserUsagepackages;
            $scope.HistoryPackage = result.HistoryUserUsagepackages;
            var index = $scope.lstWifiUsersData.indexOf(User);
            $scope.UserDetail = $scope.lstWifiUsersData[index];
            if ($scope.CurrentPackage != null)
            {
                $scope.RefundPackage = true;
                if ($scope.CurrentPackage.PerDataUsed>=100) {
                    $scope.ClosePackage = false;
                    $scope.NewPackage = true;
                    var item = {
                        NetWorkOfSiteId: $scope.SelectedSSID
                    };
                    ManageWifiUserService.GetPackagesWithSSID(item).success(function (result) {
                        $scope.SSIDDetails = result.lstSSSIDPackage;
                    }, function (error) { });
                }
                else {
                    $scope.ClosePackage = true;
                    $scope.NewPackage = false;
                    $scope.SelectedPackage = 0;
                }
            }            
            else {
                $scope.ClosePackage = false;
                $scope.NewPackage = true;
                $scope.RefundPackage = false;
                var item = {
                    NetWorkOfSiteId: $scope.SelectedSSID
                };
                ManageWifiUserService.GetPackagesWithSSID(item).success(function (result) {
                    $scope.SSIDDetails = result.lstSSSIDPackage;
                }, function (error) { });
            }            
        }, function (error) { });
        };



    $scope.UserActivity = function () {        
        ManageWifiUserService.GetUserActivity($scope.CurrentPackage.UserId).success(function (response) {
            //alert(response);
            $('#ModalUserActivity').modal('show');
            $scope.UserActivityData = response.res;
        }, function (error) {
            //alert(error);
        });
    }

    $scope.ExtendValidity = function () {
        $scope.package = $scope.CurrentPackage;
        if ($scope.package.PackageType == 10) {
            $scope.package.PackageType = "Period";
        }
        else if ($scope.package.PackageType == 20) {
            $scope.package.PackageType = "Session";
        }
        else if ($scope.package.PackageType == 30) {
            $scope.package.PackageType = "Data";
        }
        else {

        }
        $('#ModalExtendValidity').modal('show');
    }

    $scope.ExtendPackageValidity = function () {        
        var item = {
            ExtraValidity: ($scope.ExtraData / 100) * $scope.CurrentPackage.PackageValidity,
            UserPackageId: $scope.CurrentPackage.UserPackageId
        }
        ManageWifiUserService.AddExtraValidity(item).success(function (response) {
            $('#ModalExtendValidity').modal('hide');
            $scope.setSelectedItem($scope.idSelectedItem, $scope.SelectedUser);
        }, function (error) {
            //alert(error);
        });
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
        if (pageNumber < $scope.maxSize)
        {      
            $scope.range = function () {
                var input = [];
                for (var i = 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                    //alert(input[0]);
                }
                return input;
            };
        }

        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };

        $scope.currentPage = pageNumber;

        $scope.GetwifiUserDetails();
        
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
        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;

        $scope.GetwifiUserDetails();
    }

    $scope.onPrevClick = function (pageNumber) {
        if (pageNumber<=$scope.maxSize) {
            $scope.range = function () {
                var input = [];
                for (var i = 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                    //alert(input[0]);
                }

                return input;
            };
        }
        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;

        $scope.GetwifiUserDetails();
    }

    $scope.onFirstClick = function (pageNumber) {
            $scope.range = function () {
                var input = [];
                for (var i = 1; i <= $scope.pageCount; i++) {
                    input.push(i);
                    //alert(input[0]);
                }

                return input;
            };
        
        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;
        $scope.GetwifiUserDetails();
    }

    $scope.onLastClick = function (pageNumber) {
        $scope.range = function () {
            var input = [];
            for (var i = $scope.pageCount - $scope.maxSize + 1; i <= $scope.pageCount; i++) {
                input.push(i);
                //alert(input[0]);
            }

            return input;
        };

        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: pageNumber, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID };
        $scope.currentPage = pageNumber;

        $scope.GetwifiUserDetails();
    }

    $scope.maxSize = 3;
    

   
    
    $scope.FilterUserDetails = function () {
        var range = $('#dtFromDate').val();
        var dates = range.split(" - ");
        var dtFromDate = dates[0];
        var dtToDate = dates[1];

        var range1 = $('#dtFromDate1').val();
        var dates1 = range1.split(" - ");
        var dtFromDate1 = dates1[0];
        var dtToDate1 = dates1[1];
        
        localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: 1, QuerySearch: $scope.queryText, NetWorkOfSiteId: $scope.SelectedSSID,FromDate:dtFromDate,ToDate:dtToDate,FromDate1:dtFromDate1,ToDate1:dtToDate1};
       
        $scope.chckedWifiUsers.length = 0;
        $scope.chckedWifiUSerIndexs.length = 0;
        $scope.dvUserDetails = false;
        $scope.GetwifiUserDetails();
   }

    //$scope.FilterUserDetails = function () {
    //    localStorageItem = { SiteId: parseInt(localStorage.getItem("SiteId")), SiteName: localStorage.getItem("SiteName").toString().trim(), ControllerIpAddress: localStorage.getItem("cptUrl").toString().trim(), PageSize: parseInt($scope.PageSize) == "0" ? 20 : parseInt($scope.PageSize), pageNumber: 1, QuerySearch: $scope.queryText };
    //    $scope.GetSSIDAsPerSite();
    //}

      $scope.chckedWifiUSerIndexs = [];
      $scope.chckedWifiUsers = [];

      $scope.checkedCheckBoxIndex = function (objectUserDetails) {

        $scope.lstStatus = [
           { key: "Active", value: "Active" },
           { key: "Locked", value: "Locked" }
        ];
       
        //if ($scope.chckedWifiUSerIndexs.findIndex(x=>x.WifiUser.UserId === objectUserDetails.WifiUser.UserId) === -1) {
        //    $scope.chckedWifiUSerIndexs.push(objectUserDetails);
        //    $scope.chckedWifiUsers.push(objectUserDetails.WifiUser.UserName);
        //}
        //else {
        //    $scope.chckedWifiUSerIndexs.splice($scope.chckedWifiUSerIndexs.findIndex(x=>x.WifiUser.UserId === objectUserDetails.WifiUser.UserId), 1);
        //    $scope.chckedWifiUsers.splice($scope.chckedWifiUsers.indexOf(objectUserDetails.WifiUser.UserName), 1);
        //}

        //if($scope.chckedWifiUSerIndexs.length==1)
        //{
        //    $scope.dvPassport = true;
        //}
        //else {
        //    $scope.dvPassport = false;
        //    $scope.AddGroup = false;
        //}

      //  localStorage.setItem("WiFiUsers", JSON.stringify($scope.chckedWifiUsers));
      }

      
    
      $scope.selectWifiUsers = function (userId, netWorkOfSiteId) {
          //alert(netWorkOfSiteI
          ManageWifiUserService.GetWifiUserDetails(userId, netWorkOfSiteId).success(function (data) {
              $scope.WifiUser = data.WifiUser;
              $scope.Device = data.Device;
              $scope.dvUserDetails = true;
       }, function (error) { });
    }

    $scope.UpdateUserDetails = function (objectUserDetails,mac) {
        //objectUserDetails.UsersAddress.UserId = objectUserDetails.UserId;
        var itemToSend = { NetworkOfSiteId: $scope.SelectedSSID, MacAddress: mac, UpdateWifiUserDto: objectUserDetails };
        alert(JSON.stringify(objectUserDetails));
        ManageWifiUserService.UpdateOneWifiUserDetails(objectUserDetails).success(function (data) {
            location.reload();
        }, function (error) { });
    }


    $scope.DeleteParticularUser = function (userName, macAddress) {
        var index = $scope.SSIdDetails.findIndex(x => x.NetWorkOfSiteId === parseInt($scope.SelectedSSID))
        var objNetwork = $scope.SSIdDetails[index];
        var item = { ServerIP: localStorage.getItem('cptUrl'), MacAddress: macAddress, SsidName: objNetwork.SsidName, UserName: userName };
        ManageWifiUserService.DeleteOneWifiUser(item).success(function (data) {
            location.reload();
        }, function (error) { });
    }


    $scope.AddOneMacAddressForWifiUser = function () {
        $scope.MacAddress.UserId = $scope.chckedWifiUSerIndexs[0].UserId;
        ManageWifiUserService.AddMacAdress($scope.MacAddress).success(function (data) {
            location.reload();
        }, function (error) { });
    }


    $scope.DeleteMacAddressDevice = function (MacAddress) {
        ManageWifiUserService.DeleteMacAddress(MacAddress).success(function (data) {
            location.reload();
        }, function (error) { });
    }

    $scope.UpdatePasswordDetails = function (MacAddress,Password) {
        Validate();
        var item = { "MacAddress": MacAddress, "NetWorkOfSiteId": $scope.SelectedSSID, "Password": Password };
        ManageWifiUserService.UpdatePasswordDetails(item).success(function (data) {
            location.reload();
        }, function (error) { });
    }

    $scope.GetSSID = function () {
        //$scope.lstMacAddressData = [];
        ManageWifiUserService.FetchSSID(localStorageItem).success(function (SSIdList) {
            //$scope.lstMacAddressData.push({ MacAddress: "" });
            $scope.SSIdDetails = SSIdList.lstNetWorkSiteConfiguration;
            //alert("Data saved successfully");cptUrl
        }, function (error) { });
    }

    $scope.CreateNewWifiUserByAdmin = function () {
        if (!$scope.SelectedSSID) {
            toastr.warning("select the SSId First");
            return false;
        }
        $scope.item.SSIDName = $scope.SelectedSSID
        $scope.item.ServerIP = localStorage.getItem('cptUrl');
        ManageWifiUserService.CreteWifiUser($scope.item).success(function (data) {
            window.location.href = "/Account/UserDetails";
        }, function (error) { });
    }

    $scope.addMac = function () {
        $scope.lstMacAddressData.push({ MacAddress: "" });
    }
    $scope.removeMac = function () {
        $scope.lstMacAddressData.splice(-1, 1);
    }

}]);

