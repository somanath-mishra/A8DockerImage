var SponsorCount = 0;
var values;
var CpUrl = localStorage.getItem("CpUrl").toString().trim();
var GetWifiUserDataUrl = CpUrl + '/api/Sponsers/GetSponsersWithWifiUser';

$("#btnExport").click(function (e) {
    var dtFromDate = null;
    var dtToDate = null;

    var dtFromDate1 = null;
    var dtToDate1 = null;

    var range = $('#dtFromDate').val();
    if (range) {
        var dates = range.split(" - ");
        dtFromDate = dates[0];
        dtToDate = dates[1];
    }

    var range1 = $('#dtFromDate1').val();
    if (range1) {
        var dates1 = range1.split(" - ");
        dtFromDate1 = dates1[0];
        dtToDate1 = dates1[1];
    }

    var data = { SponserId: $("#SponsorDdl").val(), NetworkofsiteId: $("#SsidDdl").val(), CreatedDateTimeFrom: dtFromDate, CreatedDateTo: dtToDate, UpdatedDateFrom: dtFromDate1, UpdatedDateTo: dtToDate1 };

    var urlDownload = CpUrl + "/api/Sponsers/ExcelSponsersWifiUser";
    //window.open(urlDownload, '_self');
    $.post(urlDownload,data).success(function (data, status) {
        downloadCSV(data);
    });
});

$("#btnFind").click(function () {
    //$("#ajaxSpinnerImage").show();
    getWifiUsers();
})

//On the drop down changes funtion need to call
$("select.NumberOfRecord").change(function () {
    var NumberOfRecord = $(".NumberOfRecord option:selected").val();
    $("#RecordToDisply").val(NumberOfRecord);
    $("#CurrentPage").val(1);
    //getWifiUsers();
});

//On the page change need to call
function go_to_page(page_num) {
    $("#CurrentPage").val(page_num);

    getWifiUsers();
}

function filter() {
    getWifiUsers();
}

function getWifiUsers() {
    //alert(localStorage.getItem('hdncptoken').toString());

    var dtFromDate = null;
    var dtToDate = null;

    var dtFromDate1 = null;
    var dtToDate1 = null;

    var range = $('#dtFromDate').val();
    if (range) {
        var dates = range.split(" - ");
        dtFromDate = dates[0];
        dtToDate = dates[1];
    }
    
    var range1 = $('#dtFromDate1').val();
    if (range1) {
        var dates1 = range1.split(" - ");
        dtFromDate1 = dates1[0];
        dtToDate1 = dates1[1];
    }
   
    var data = { SponsorId: $("#SponsorDdl").val(), NetWorkOfSiteId: $("#SsidDdl").val(), pageSize: $("#NumberOfRecord").val(), pageNumber: $("#CurrentPage").val(), FromDate: dtFromDate, ToDate: dtToDate, FromDate1: dtFromDate1, ToDate1: dtToDate1};

    $.ajax({
        url: GetWifiUserDataUrl,
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: "POST",
        beforeSend: function (xhr) {
            $("#ajaxSpinnerImage").show();
            //xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdncptoken').toString());
        },
        success: function (response) {
            var row = null;
            $("#table tbody").empty();
            $("#table tbody").empty();
            $.each(response.lstWifiUserWithSponsors, function (index, obj) {
                var row = '<tr><td"> ' + values + ' </td> <td> ' + obj.UserName + ' </td> <td>' + obj.FirstName + '</td> <td>' + obj.LastName + '</td><td>' + moment.utc(obj.CreatedDatTime).format('DD-MM-YYYY HH:mm:ss') + '</td> <td>' + moment.utc(obj.UpdateDateTime).format('DD-MM-YYYY HH:mm:ss') + '</td>' + '</td><td>' + obj.AgeRange + '</td>' + '<td>' + obj.SponserName + '</td>' + '</tr>'
                $("#table tbody").append(row);
            });

            $("#TotalPage").val(response.TotalPages);
            $("#CurrentPage").val(response.currentPage);
            $("#RecordToDisply").val(response.pageSize);
            $("#TotalRecords").val(response.TotalCount);
            $("#NumberOfRecord").val(response.pageSize);
            $("select.NumberOfRecord").val(response.pageSize);
            $('#show_paginator').empty();

            getPagelist(response.TotalCount, response.currentPage, response.pageSize, 5);
            $("#ajaxSpinnerImage").hide();
        }
    });
}

$("#SsidDdl").change(function () {
    $("#pageNumbers").hide();
    $("#table tbody").empty();
    if ($("#SsidDdl").val() <= 0) {
        $("#SponsorDdl").empty();
        return false;
    }
    $.ajax({
        type: "post",
        url: "/BusinessUserHome/GetSponsors",
        data: { NetWorkOfsiteId: $('#SsidDdl').val() },
        datatype: "json",
        traditional: true,
        success: function (data) {
            if (data.length > 0) {
                $("#divSponsors").show();
                SponsorCount = data.length;

                for (var i = 0; i < data.length; i++) {
                    var Sponsors = Sponsors + '<option value=' + data[i].Value + '>' + data[i].Text + '</option>';
                }
                $('#SponsorDdl').html(Sponsors);
                $('#SponsorDdl').multiselect("destroy").multiselect({
                    includeSelectAllOption: false
                }).multiselect('select', data[0].Value);
            }
            else {
                $('#SponsorDdl').multiselect("destroy");
                $("#SponsorDdl").empty();
                $("#divSponsors").hide();
            }
            $("#btnFind").trigger('click');
        }
    });
})
$("#SsidDdl").trigger('change');

// Function to convert Json Array object to CSV
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

//Function to download CSV
function downloadCSV(csv) {
    var data, filename, link;

    if (csv == null) return;

    filename = 'WiFiUserDetails.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
