jQuery(document).ready(function ($) {
    var selectedRow = $("#table").find('tbody') // select table body and
        .find('tr') // select all rows that has
        .has('input[type=checkbox]:checked') // checked checkbox element
    selectedRow.click();
});
function StoreToken() {
    var authtokencp = document.getElementById("hdncptoken").value;
    var authtokenrtls = document.getElementById("hdnrtlsToken").value;
    if (authtokencp != null) {
        localStorage.setItem("hdncptoken", authtokencp);
    }
    if (authtokenrtls != null) {
        localStorage.setItem("hdnrtlstoken", authtokenrtls);
    }
}
$(".chkIsSiteSelected").change(function () {
    var checked = $(this).is(':checked');
   
    $(".chkIsSiteSelected").prop('checked', false);
    if (checked) {
        $(this).prop('checked', true);
    }
});

$("#table tr").click(function () {
    //Loading Spinner
    //  $("#divLoading").show();
    $(this).addClass('selectedindex').siblings().removeClass('selectedindex');
    var $row = $(this).closest("tr"),    // Finds the closest row <tr> 
    $tdsSiteId = $row.find("td:nth-child(1)").text().toString().trim(); // Finds the 2nd <td> element
    $(".chkIsSiteSelected").prop('checked', false);
    $(this).find('td input[type=checkbox]').prop('checked', true);
    $tdsSiteName = $row.find("td:nth-child(3)").text().toString().trim(); // Finds the 3rd <td> element
    $tdsControllerIp = $row.find("td:nth-child(6)").text().toString().trim();
    $tdsLocUrl = $row.find("td:nth-child(7)").text().toString().trim();
    $tdsRtlsUrl = $row.find("td:nth-child(8)").text().toString().trim();
    $tdsCpUrl = $row.find("td:nth-child(9)").text().toString().trim();
    var WifiUserPageUrl_Value = $(this).closest('tr').find('td:eq(9)').text().toString().trim();

    document.getElementById('site_name').innerHTML = $tdsSiteName;
    //localStorage.setItem("SiteId", SiteId_Value);
    localStorage.setItem("SiteId", $tdsSiteId);
    localStorage.setItem("SiteName", $tdsSiteName);
    localStorage.setItem("rtlsUrl", $tdsRtlsUrl);
    localStorage.setItem("CpUrl", $tdsCpUrl);
    localStorage.setItem("dashboardUrl", $tdsLocUrl);
    localStorage.setItem("cptUrl", $tdsControllerIp);
    localStorage.setItem("ManageSite", "True");
    localStorage.setItem("WifiUserPageUrl", WifiUserPageUrl_Value);

    GetSiteName();

    var sitedata = { SiteId: localStorage.getItem("SiteId") };
    $.ajax(
        {
            type: "POST",
            data: sitedata,
            url: "/MenuConfSite/a8Captiveportal/V1/SiteOperationalStatus",
            success: function(data) {
                var Controllerdata = data.ControllerData;
                var Radiusdata = data.Radius;
                var EngageServiceData = data.EngageEngine;
                var SessionData = data.SessionData;
                var LoggederrorsCount = data.LoggedErrors;

                if (Controllerdata) {
                    if (Controllerdata.PingStatus == "Success" || Controllerdata.PingStatus == "OK") {
                        $('#Controller').css('background-color', 'Green');
                        $('#Controller').val('Operational');
                    } else if (Controllerdata.PingStatus == "Failure" || Controllerdata.PingStatus == "ProtocolError") {
                        $('#Controller').css('background-color', 'Red');
                        $('#Controller').val('Failed');
                    } else {
                        $('#Controller').css('background-color', 'White');
                        $('#Controller').val('Not Deployed');
                    }
                    $('#idControllerDiv').show();
                } else {
                    $('#idControllerDiv').hide();
                }


                if (EngageServiceData) {
                    if (EngageServiceData.PingStatus == "Success" || EngageServiceData.PingStatus == "OK") {
                        $('#RTLSAPI').css('background-color', 'Green');
                        $('#RTLSAPI').val('Operational');
                    } else if (EngageServiceData.PingStatus == "Failure" || EngageServiceData.PingStatus == "ProtocolError") {
                        $('#RTLSAPI').css('background-color', 'Red');
                        $('#RTLSAPI').val('Failed');
                    }
                    $('#idRTLSDiv').show();
                } else {
                    $('#idRTLSDiv').hide();
                }

                if (Radiusdata) {
                    if (Radiusdata.PingStatus == "Success" || Radiusdata.PingStatus == "OK") {
                        $('#Radius').css('background-color', 'Green');
                        $('#Radius').val('Operational');

                    } else if (Radiusdata.PingStatus == "Failure" || Radiusdata.PingStatus == "ProtocolError") {
                        $('#Radius').css('background-color', 'Red');
                        $('#Radius').val('Failed');
                    }
                    $('#idRadiusDiv').show();
                } else {
                    $('#idRadiusDiv').hide();
                }

                if (SessionData != null) {
                    $('#Sessions').val(SessionData.PingStatus);
                }
                if (LoggederrorsCount != null) {
                    $('#Loggederrors').val(LoggederrorsCount.PingStatus);
                }
            },
            failure: function(response) {

            },
            error: function(xhr, textStatus, errorThrown) {

            }
        });
    navigation();
});

function setValue() {
    var debugValue = document.getElementById('debugStatus').value;
    if (debugValue == "on") {
        document.getElementById('debugStatus').value = "off";
    }
    else {
        document.getElementById('debugStatus').value = "on";
    }
}
