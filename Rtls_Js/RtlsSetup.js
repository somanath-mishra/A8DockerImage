//this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {
    var BaseUrl = localStorage.getItem('rtlsUrl');
    var GetRtlsConfigUrl = BaseUrl + "/api/GetRtlsConfiguration";
    var GetListOfDeviceUrl = BaseUrl + "/UIData/AjaxListOfMacAddress";//"/UIData/ListOfMacAddress";//
    var SaveDeviceApi = BaseUrl + "/Device/Save";
    var saveRtlsConfigUrl = BaseUrl + "/api/SaveAndUpdateRtlsConfiguration";
    var UpdateIsDisplayUrl = BaseUrl + "/Device/UpdateDisplay/";
    var RegisterIntoEngageUrl = BaseUrl + "/RealTimeLocation/AddDevices/";
    var DeRegisterIntoEngageUrl = BaseUrl + "/RealTimeLocation/DeRegisterDevices/";
    var DeleteFromRtlsUrl = BaseUrl + "/RealTimeLocation/DeleteDevices";
    var UpdateIsTrackByAdminUrl = BaseUrl + "/Device/UpdateTrackByAdmin/";
    var UpdateIsEntryNotifyUrl = BaseUrl + "/Device/UpdateEntryNotify/";
    var checkLocationServiceConfigured = BaseUrl + "/api/IsRtlsConfigurationExist?SiteId=" + localStorage.getItem('SiteId');
    var SyncWithOmniEngine = BaseUrl + "/RealTimeLocation/GetBlackListDevices/";
    //var saveRtlsTrigger = BaseUrl + "/api/SaveAndUpdateRtlsConfiguration";    

    var GetDevicesFromEngageUrl = BaseUrl + "/RealTimeLocation/GetDevices/";

    //Store the SiteId and SiteName inside the form
    $("#hdnSiteId").val(parseInt(localStorage.getItem('SiteId')));
    $("#hdnSiteName").val(localStorage.getItem('SiteName').toString().trim());

    //GetListOfData(GetListOfDeviceUrl);
    var PostCommonLoadData = $("#fromRtlsConfig").serialize();
    //Get the RTLS Configuration details if it arlready set

    $.ajax({
        url: GetRtlsConfigUrl,
        data: PostCommonLoadData,
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        },
        success: function (data) {
            if (data.RtlsConfiguration != null) {
                $("#txtOmniBaseAddressUri").val(data.RtlsConfiguration.OmniBaseAddressUri)
                $("#txtEngageBuildingName").val(data.RtlsConfiguration.EngageBuildingName);
                $("#txtEngageSiteName").val(data.RtlsConfiguration.EngageSiteName);
                $("#txtEngageBaseAddressUri").val(data.RtlsConfiguration.EngageBaseAddressUri);
                $("#hdnRtlsConfigurationId").val(data.RtlsConfiguration.RtlsConfigurationId);
                $("#rtlsEngine").val(data.RtlsConfiguration.RtlsEngineType);
                //alert(data.TotalPage);
            }
            if(data.RtlsConfiguration.RtlsEngineType==2)
            {
                $("#dvEngageEngine").hide();
                $("#dvOmniEngine").show();
            }
            else {
                $("#dvEngageEngine").show();
                $("#dvOmniEngine").hide();
            }
        }
    });

    $("#rtlsEngine").change(function () {
        if ($("#rtlsEngine").val() == 1)
            {
            (document.getElementById("txtEngageBuildingName").required= true);
            (document.getElementById("txtEngageSiteName").required= true);
            (document.getElementById("txtEngageBaseAddressUri").required= true);
            (document.getElementById("txtOmniBaseAddressUri").required = false);            
        }
    else {
            (document.getElementById("txtEngageBuildingName").required= false);
            (document.getElementById("txtEngageSiteName").required= false);
            (document.getElementById("txtEngageBaseAddressUri").required= false);
            (document.getElementById("txtOmniBaseAddressUri").required= true);
        }
    });

    //PostCommonLoadData = $("#fromRtlsConfig").serialize();
    GetListOfData(GetListOfDeviceUrl);

    $("select.NumberOfRecord").change(function () {
        var NumberOfRecord = $(".NumberOfRecord option:selected").val();
        $("#RecordToDisply").val(NumberOfRecord);
        $("#CurrentPage").val(0);

        GetListOfData(GetListOfDeviceUrl);
    });

    $("#rtlsEngine").change(function () {
        var NumberOfRecord = $(".NumberOfRecord option:selected").val();
        $("#RecordToDisply").val(NumberOfRecord);
        $("#CurrentPage").val(0);

        GetListOfData(GetListOfDeviceUrl);
    });

    $(document).on('click', '#btnSave', function () {
        PostCommonLoadData = $("#fromRtlsConfig").serialize();
        $.ajax({
            url: SaveDeviceApi,
            data: PostCommonLoadData,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (response) {
                location.reload();
            }
        });
    });    

    $(document).on('click', '#btnRtlsConfiguration',function () {        
        PostCommonLoadData = $("#fromRtlsConfig").serialize();
        $.ajax({
            url: saveRtlsConfigUrl,
            data: PostCommonLoadData,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (response) {
                location.reload();
            }
        });
    });


    $(document).on('click', '#chkIsDisplay', function () {
        var macDevice = null;
        macDevice = $(this).parents("tr").find(".tdMac").text().trim();
        var data = { Mac: macDevice, IsDisplay: $(this).is(":checked"), SiteId: parseInt(localStorage.getItem('SiteId')) }
        $.ajax({
            url: UpdateIsDisplayUrl,
            data: data,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (response) {

            }
        });
    });

    $(document).on('click', '#chkIsTrackByAdmin', function () {
        var macDevice = null;
        macDevice = $(this).parents("tr").find(".tdMac").text().trim();
        var data = { Mac: macDevice, IsTrackByAdmin: $(this).is(":checked"), SiteId: parseInt(localStorage.getItem('SiteId')) }
        $.ajax({
            url: UpdateIsTrackByAdminUrl,
            data: data,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (response) {

            }
        });

    });

    $(document).on('click', '#chkIsEntryNotify', function () {
        var macDevice = null;
        macDevice = $(this).parents("tr").find(".tdMac").text().trim();
        var data = { Mac: macDevice, IsEntryNotify: $(this).is(":checked"), SiteId: parseInt(localStorage.getItem('SiteId')) }
        //location.reload();
        $.ajax({
            url: UpdateIsEntryNotifyUrl,
            data: data,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (response) {

            }
        });
    });

        $("#btnRegister").on("click", function () {
            var arrData = [];
            $.each($("input[name='chkMacDevices']:checked"), function () {
                arrData.push($(this).parents("tr").find(".tdMac").text().trim());
            });
            var data = { MacAddresses: arrData, IscreatedByAdmin: true, SiteId: parseInt(localStorage.getItem('SiteId')), SiteName: localStorage.getItem('SiteName').toString().trim() }
            $.post(RegisterIntoEngageUrl, data, function (response) {
                if (response.result.returncode == 0)
                {
                    alert("Device Registered Successfully");

                }
                else {
                    alert(response.result.errmsg);
                }
                //location.reload();
                //alert($("#CurrentPage").val()-1)
                go_to_page($("#CurrentPage").val() - 1);
            });
        });

        $("#btnCheckRegister").on("click", function () {

            var data = { SiteId: parseInt(localStorage.getItem('SiteId')) }
            $.post(SyncWithOmniEngine, data, function (response) {
                //if (response.result.returncode == 0)
                //{
                //    alert("Device Registered Successfully");

                //}
                //else {
                //    alert(response.result.errmsg);
                //}
                //location.reload();
                //alert($("#CurrentPage").val()-1)
                go_to_page($("#CurrentPage").val() - 1);
            });
        });


        $(document).on('click', '#chkMacDevices', function () {
            if ($(this).is(":checked")) {
                // stop the bubbling to prevent firing the row's click event
                $(".BtnChkSelect").removeAttr("disabled");
            } else {
                $(".BtnChkSelect").attr("disabled", "disabled");
            }

        });

        $("#btnDeRegister").on("click", function () {
            var arrData = [];
            $.each($("input[name='chkMacDevices']:checked"), function () {
                arrData.push($(this).parents("tr").find(".tdMac").text().trim());
            });
            var data = { MacAddresses: arrData, SiteId: parseInt(localStorage.getItem('SiteId')), SiteName: localStorage.getItem('SiteName').toString().trim() }
            $.post(DeRegisterIntoEngageUrl, data, function (response) {
                if (response.result.returncode == 0) {
                    alert("Device Deregistered Successfully");
                }
                else {
                    alert(response.result.errmsg);
                }
                //location.reload();
                //$("#CurrentPage").val(page_num);
                go_to_page($("#CurrentPage").val() - 1);
                $(".BtnChkSelect").attr("disabled", "disabled");
            });

        });

        $("#btnDeleteMac").on("click", function () {
            var arrData = [];
            $.each($("input[name='chkMacDevices']:checked"), function () {
                arrData.push($(this).parents("tr").find(".tdMac").text().trim());
            });
           
            var data = { MacAddresses: arrData, SiteId: parseInt(localStorage.getItem('SiteId')), SiteName: localStorage.getItem('SiteName').toString().trim() }
            $.ajax({
                url: DeleteFromRtlsUrl,
                data: data,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
                },
                success: function (response) {
                   
                    if (response.result.returncode == 0)
                    {
                        alert("MacAddress Deleted SuccessFully");
                    }
                   
                    // location.reload();
                    go_to_page($("#CurrentPage").val() - 1);
                    $(".BtnChkSelect").attr("disabled", "disabled");
                }
            });

        });

        //$('#btnSave').on('click', function () {
        //    var data = new FormData();
        //    var SiteId = $('#SiteId').val();
        //    var files = $("#file").get(0).files;
        //    // Add the uploaded image content to the form data collection
        //    if (files.length > 0) {
        //        data.append("UploadedImage", files[0]);
        //        data.append("SiteId", SiteId);
        //    }
        //    // Make Ajax request with the contentType = false, and procesDate = false
        //    var ajaxRequest = $.ajax({
        //        type: "POST",
        //        url: "/api/UploadApi/UploadFile",
        //        contentType: false,
        //        processData: false,
        //        data: data
        //    });  
        //    ajaxRequest.done(function (xhr, textStatus) {

        //    });

        //});

        $("#btnCheckRegister1").on("click", function () {
            var arrData = [];
            $.each($("input[name='chkMacDevices']:checked"), function () {
                arrData.push($(this).parents("tr").find(".tdMac").text().trim());
            });
            var dataToPost = { MacAddresses: arrData, IscreatedByAdmin: true, SiteId: parseInt(localStorage.getItem('SiteId')), SiteName: localStorage.getItem('SiteName').toString().trim() }

            $.ajax({
                url: GetDevicesFromEngageUrl,
                data: dataToPost,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
                },
                success: function (response) {
                    var r = "";
                    if (response.result.returncode == 0) {
                        alert(response.result.errmsg + " ");
                    }
                    else {
                        alert(response.result.errmsg);
                    }
                    //location.reload();
                    //alert($("#CurrentPage").val()-1)
                    go_to_page($("#CurrentPage").val() - 1);
                }
            });

        });
    });

    function go_to_page(page_num) {
        //alert(page_num);
        BaseUrl = localStorage.getItem('rtlsUrl');
        $("#CurrentPage").val(page_num);
        var GetListOfDeviceUrl = BaseUrl + "/UIData/AjaxListOfMacAddress";
        GetListOfData(GetListOfDeviceUrl);
    }

    function GetListOfData(GetListOfDeviceUrl) {
        PostCommonLoadData = $("#fromRtlsConfig").serialize();        
        $.ajax({
            url: GetListOfDeviceUrl,
            data: PostCommonLoadData,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
            },
            success: function (data) {
                $('#macDetails').empty();
                if ($("#rtlsEngine").val() == 1)
                {
                    $.each(data.EngageMaclist, function (key, item) {
                        $('#macDetails').append("<tr>" +
                            "<td> <input type='checkbox' class='chkMacDevices' name='chkMacDevices' id='chkMacDevices' />  </td>" +
                            "<td class='tdMac' > " + item.Mac + "</td>" +
                            "<td>" + item.Status + "</td>" +
                            "<td> <span class='" + (item.IsCreatedByAdmin ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove') + " '></span></td>" +
                            "<td>" + item.Email + "</td>" +
                            "<td>" + item.FirstName + "</td>" +
                            "<td>" + item.LastName + "</td>" +
                            //"<td> <input type='checkbox' id='chkIsCreatedByAdmin' value='" + item.IsCreatedByAdmin + "'" + (item.IsCreatedByAdmin ? 'checked' : '') + " disabled/>" + "</td>" +
                            //"<td> <input type='checkbox' id='chkIsDisplay' class='IsDisplay' name='chkIsTrackByAdmin' value='" + item.IsDisplay + "' " + (item.IsDisplay ? 'checked' : '') + " />" + "</td>" +
                            //"<td> <input type='checkbox' id='chkIsTrackByAdmin'  name='chkIsTrackByAdmin'  value='" + item.IsTrackByAdmin + "' " + (item.IsTrackByAdmin ? 'checked' : '') + "/>" + "</td>" +
                            //"<td> <input type='checkbox' id='chkIsEntryNotify'  name='chkIsEntryNotify'  value='" + item.IsEntryNotify + "' " + (item.IsEntryNotify ? 'checked' : '') + "/>" + "</td>" +
                            "</tr>");

                    });
                    $("#TotalPage").val(data.TotalPage);
                    $("#CurrentPage").val(data.CurrentPage);
                    $("#RecordToDisply").val(data.RecordToDisply);
                    $("#TotalRecords").val(data.TotalEngageRecords);
                    $("#NumberOfRecord").val(data.RecordToDisply);
                    $("select.NumberOfRecord").val(data.RecordToDisply);


                    getPagelist(data.TotalEngageRecords, data.CurrentPage, data.RecordToDisply, 5);
                    $(".BtnChkSelect").attr("disabled", "disabled");
                }
                else {
                    $.each(data.OmniMaclist, function (key, item) {
                       $('#macDetails').append("<tr>" +
                            "<td> <input type='checkbox' class='chkMacDevices' name='chkMacDevices' id='chkMacDevices' />  </td>" +
                            "<td class='tdMac' > " + item.Mac + "</td>" +
                            "<td>" + item.Status + "</td>" +
                            "<td> <span class='" + (item.IsCreatedByAdmin ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove') + " '></span></td>" +
                            //"<td> <input type='checkbox' id='chkIsCreatedByAdmin' value='" + item.IsCreatedByAdmin + "'" + (item.IsCreatedByAdmin ? 'checked' : '') + " disabled/>" + "</td>" +
                            "<td>" + item.Email + "</td>" +
                            "<td>" + item.FirstName + "</td>" +
                            "<td>" + item.LastName + "</td>" +
                         "</tr>");
                    });
                    $("#TotalPage").val(data.TotalPage);
                    $("#CurrentPage").val(data.CurrentPage);
                    $("#RecordToDisply").val(data.RecordToDisply);
                    $("#TotalRecords").val(data.TotalOmniRecords);
                    $("#NumberOfRecord").val(data.RecordToDisply);
                    $("select.NumberOfRecord").val(data.RecordToDisply);


                    getPagelist(data.TotalOmniRecords, data.CurrentPage, data.RecordToDisply, 5);
                    $(".BtnChkSelect").attr("disabled", "disabled");
                }
               
                
            }
        });

        
    }




