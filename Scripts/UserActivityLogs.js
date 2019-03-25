var CpUrl = localStorage.getItem("CpUrl").toString().trim();
var GetUserActivityDataUrl = CpUrl + 'api/GetUserActivityLogs';

//GetUserActivityData();
$("#btnFind").click(function () {
    GetUserActivityData();
});

$("#btnExport").click(function (e) {
    e.preventDefault();
    var range = $('#dtFromDate').val();
    var dates = range.split(" - ");
    var dtFromDate = dates[0];
    var dtToDate = dates[1];
    var SelectedSsidName = $("#SsidDdl option:selected").text();
    var urlDownload = CpUrl + "/api/UserActivityExcelDownLoad?ssidName=" + SelectedSsidName + "&&fromDate=" + dtFromDate + "" + "&&toDate=" + dtToDate;
    //window.open(urlDownload, '_self');
    $.get(urlDownload).success(function (data, status) {
        downloadCSV(data);
    });
});

//On the drop down changes funtion need to call
$("select.NumberOfRecord").change(function () {
    var NumberOfRecord = $(".NumberOfRecord option:selected").val();
    $("#RecordToDisply").val(NumberOfRecord);
    $("#CurrentPage").val(0);
    //GetUserActivityData();
});

//On the page change need to call
function go_to_page(page_num) {
    $("#CurrentPage").val(page_num);
    GetUserActivityData();
}

function filter() {
    GetUserActivityData();
}


function GetUserActivityData() {
    var range = $('#dtFromDate').val();
    var dates = range.split(" - ");
    var dtFromDate = dates[0];
    var dtToDate = dates[1];
    var pageSize = $("#RecordToDisply").val();
    var SelectedSsidName = $("#SsidDdl option:selected").text();
    var pageNumberData = $("#CurrentPage").val();
    var PostCommonLoadData = { pageNumber: pageNumberData, pageSize: pageSize, FromDate: dtFromDate, Todate: dtToDate, SsidName: SelectedSsidName };
    //PostCommonLoadData = { SiteName: localStorage.getItem("SiteName"), SiteId: parseInt(localStorage.getItem("SiteId")), TotalPage: $("TotalPage").val(), CurrentPage: $("#CurrentPage").val(), RecordToDisply: $("#RecordToDisply").val(), TotalRecords: $("#TotalRecords").val() };
    //alert(JSON.stringify(PostCommonLoadData));
    $.ajax({
        url: GetUserActivityDataUrl,
        data: PostCommonLoadData,
        type: "POST",
        beforeSend: function (xhr) {
            $("#ajaxSpinnerImage").show();
            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        },
        success: function (data) {
            $('#idUserActivityDetails').empty();
            if (data.lstUserActivityLogs.lstUserActivityLogs.length>0)
            {
                $.each(data.lstUserActivityLogs.lstUserActivityLogs, function (key, item) {
                    $('#idUserActivityDetails').append("<tr>" +
                        "<td>" + moment.utc(item.LogDateTime).format('DD-MM-YYYY HH:mm:ss') + "</td>" +
                        "<td>" + item.MacAddress + "</td>" +
                        "<td>" + item.UserAction + "</td>" +
                        "<td>" + item.SsidName + "</td>" +
                        "</tr>");
                });

                $("#TotalPage").val(data.lstUserActivityLogs.TotalPages);
                $("#CurrentPage").val(data.lstUserActivityLogs.currentPage);
                $("#RecordToDisply").val(data.lstUserActivityLogs.pageSize);
                $("#TotalRecords").val(data.lstUserActivityLogs.TotalCount);
                $("#NumberOfRecord").val(data.lstUserActivityLogs.pageSize);
                $("select.NumberOfRecord").val(data.lstUserActivityLogs.pageSize);

                $('#show_paginator').empty();
                $("p").empty();
                $("p").append("<br/> Total number of Users who did not attempt to Login is &emsp;&nbsp;&nbsp;" + data.Count
                    + "<br />Total number of Users who did not attempt to Register is &nbsp;" + data.Count1);

                getPagelist(data.lstUserActivityLogs.TotalCount, data.lstUserActivityLogs.currentPage, data.lstUserActivityLogs.pageSize, 5);
            } else {
                $('#show_paginator').empty();
                $("p").empty();
               // $("#idUserActivityDetails").html("<center>There is no data</center>");
            }
           
            //$(".BtnChkSelect").attr("disabled", "disabled");
        },
        complete: function () {
            $("#ajaxSpinnerImage").hide();
        }
    });
}

//Function to download CSV
function downloadCSV(csv) {
    var data, filename, link;

    if (csv == null) return;
    var currentdate = new Date();

    var customDate = currentdate.getDate() + "/"
               + (currentdate.getMonth() + 1) + "/"
               + currentdate.getFullYear() + " @ "
               + currentdate.getHours() + ":"
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();

    filename = 'UserActivityLog' + customDate + '.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


$("#btnGetCount").click(function () {
    $.ajax({
        url: CpUrl + 'api/UnsuccessfullLogins',
        dataType: 'json',
        contentType: 'application/json',
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdncptoken').toString());
        },
        success: function (response) {
            location.reload();
        }
    });
});

