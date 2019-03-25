$(document).ready(function () {
    var BaseUrl = localStorage.getItem('rtlsUrl');
    var GetRtlsArea = BaseUrl + "/api/GetRtlsArea";
    var saveRtlsTrigger = BaseUrl + "/api/SaveAndUpdateRtlsTrigger";
    //var GetListOfDeviceUrl = BaseUrl + "/UIData/AjaxListOfMacAddress";//"/UIData/ListOfMacAddress";//

    //Store the SiteId and SiteName inside the form
    $("#hdnSiteId").val(parseInt(localStorage.getItem('SiteId')));
    $("#hdnSiteName").val(localStorage.getItem('SiteName').toString().trim());
    $("#hdnRtlsConfigurationId").val(parseInt(localStorage.getItem('SiteId')));
    //GetListOfData(GetListOfDeviceUrl);
    var PostCommonLoadData = $("#fromRtlsTrigger").serialize();
    //Get the RTLS Configuration details if it arlready set

        
    //$("#idGeoFencedArea1").val(data.GeoFencedArea1);
    //$("#idGeoFencedArea2").val(data.GeoFencedArea2);
    //$("#idGeoFencedArea3").val(data.GeoFencedArea3);
    //$("#idGeoFencedArea4").val(data.GeoFencedArea4);
    $.ajax({
        url: GetRtlsArea,
        data: PostCommonLoadData,
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        },
        success: function (data) {
            // get the last DIV which ID starts with ^= "GFA"
            var $div = $('div[id^="GFA"]:last');
            // Read the Number from that DIV's ID (i.e: 3 from "GFA3")
            // And increment that number by 1
            var num = parseInt($div.prop("id").match(/\d+/g), 10) + 1;
            if (num < data.length) {
                for (var i = num; i < data.length; i++) {
                    $('#GeoFencedAreas').append("<div class='form-group' id='GFA" + i + "'>" +
                                    "<label for='GeoFencedArea" + (i + 1) + "' class='control-label col-md-6 col-sm-6 col-xs-12'>" + "GeoFencedArea" + (i + 1) + "</label>" +
                                    "<div class='col-md-6 col-sm-6 col-xs-12'>" +
                                        "<input type='text' name='GeoFencedAreas[" + i + "]' id='idGeoFencedArea" + i + "' placeholder='' class='form-control' />" +
                                        "<input type='hidden' name='id' id='RtlsId" + i + "' />" +
                                    "</div>" +
                                    "<br />" + "<br />" +
                                "</div>");
                }
            }
            if (data != null) {
                $("#idApproachNotification").val(data[0].RtlsConfiguration.ApproachNotification);
                $("#idAreaNotification").val(data[0].RtlsConfiguration.AreaNotification);
                for (var i in data) {
                    $("#idGeoFencedArea" + i).val(data[i].GeoFencedAreas);
                    $("#RtlsId" + i).val(data[i].Id);
                }
            }
        }
    });


        //PostCommonLoadData = $("#fromRtlsTrigger").serialize();
        //GetListOfData(GetListOfDeviceUrl);

        $(document).on('click', '#btnRtlsTrigger', function () {
            var arrData = [];
            var $div = $('div[id^="GFA"]:last');
            var count = parseInt($div.prop("id").match(/\d+/g), 10);
            for (var i = 0; i <= count; i++) {
                arrData.push({ GeoFencedAreas: $("#idGeoFencedArea" + i).val(), RtlsConfigurationId: localStorage.getItem('SiteId'), Id: $("#RtlsId" + i).val() });
            }
            //arrData.push({ GeoFencedAreas: $("#idGeoFencedArea1").val(), RtlsConfigurationId: localStorage.getItem('SiteId'), Id: $("#RtlsId1").val()});
            //arrData.push({ GeoFencedAreas: $("#idGeoFencedArea2").val(), RtlsConfigurationId: localStorage.getItem('SiteId'), Id: $("#RtlsId2").val()});
            //arrData.push({ GeoFencedAreas: $("#idGeoFencedArea3").val(), RtlsConfigurationId: localStorage.getItem('SiteId'), Id: $("#RtlsId3").val()});
            var elem1 = $("#idApproachNotification").val();
            var elem2 = $("#idAreaNotification").val();
            var item = {
                SiteId: localStorage.getItem('SiteId'),
                SiteName: localStorage.getItem('SiteName'),
                ApproachNotification: elem1,
                AreaNotification: elem2,
                GeoFencedAreas: arrData
            }
            $.ajax({
                url: saveRtlsTrigger,
                data: item,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
                },
                success: function (data) {
                    location.reload();
                }
            });
        });
    });