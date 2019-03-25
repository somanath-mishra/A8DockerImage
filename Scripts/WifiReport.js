var SData = [];
var readData = [];

$("#Updatebtn_all").click(function (data) {
    GetWifiReportData();
});
//

//Function to return WifiReport Data according to date filter in WifiReport Page
function GetWifiReportData() {
    //debugger;
    var i = 0;
    var reportArr = [];
    for (i = 0; i <= 3; i++) {

        var range = $('#from_date' + i).val();
        if (range) {
            var dates = range.split(" - ");
             
            //alert(moment(dates[0]).format('MM/DD/YYYY H:mm'));
            //alert(moment(dates[1]).format('MM/DD/YYYY H:mm'));

            var startDate = moment(dates[0], "MM/DD/YYYY H:mm").toDate();
            var endDate = moment(dates[1], "MM/DD/YYYY H:mm").toDate();

            var reportObj = {
                FromDateTime: startDate,
                ToDateTime: endDate,
                SiteId: localStorage.getItem('SiteId').toString().trim(),
                Id: i
            }

            reportArr.push(reportObj);
        }
        else {
            reportArr.push([]);
        }
    }

    alert(JSON.stringify(reportArr));
    //debugger;
    var CpURL = localStorage.getItem("CpUrl").toString().trim();
    $.ajax({
        url: CpURL + 'RealTimeDataApi/GetWifiReportData',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(reportArr),
        success: function (data) {
            SData = [];
            for (var i = 0; i < data.length; i++) {
                var _notansweredGender = data[i].TotalUsers - (data[i].MaleUsers + data[i].FemaleUsers);

                var _notansweredAge = data[i].TotalUsers - (data[i].RangeStart13 + data[i].RangeStart18 + data[i].RangeStart25 + data[i].RangeStart35 + data[i].RangeStart45 + data[i].RangeStart55);
                readData = {
                    "FromDateTIme": data[i].FromDateTime, "ToDateTime": data[i].ToDateTime, "Id": data[i].Id,
                    "TotalSessions": data[i].TotalSessions, "TotalUsers": data[i].TotalUsers,"NewUsers":data[i].NewUsers,
                    "Male": data[i].MaleUsers, "Female": data[i].FemaleUsers, "NotAnsweredGender": _notansweredGender,
                    "RangeStart13": data[i].RangeStart13, "RangeStart18": data[i].RangeStart18, "RangeStart25": data[i].RangeStart25,
                    "RangeStart35": data[i].RangeStart35, "RangeStart45": data[i].RangeStart45, "RangeStart55": data[i].RangeStart55,
                    "NotAnsweredAge": _notansweredAge, "NoOfIosUsers": data[i].NoOfIosUsers, "NoOfAndriodUsers": data[i].NoOfAndriodUsers,
                    "NoOfWindowUsers": data[i].NoOfWindowUsers, "NoOfOthersUsers": data[i].NoOfOthersUsers,
                    "NoDeezerSponsers": data[i].NoDeezerSponsers, "NoSmgSponsers": data[i].NoSmgSponsers,
                    "NoDeezerAndSmgSponsers": data[i].NoDeezerAndSmgSponsers, "NoNotSelectedAnySponsers": data[i].NoNotSelectedAnySponsers

                }
                SData.push(readData);
            }
            tableData(SData);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            toastr.error("Some error occured, Please try after sometime");
        }
    });
}

function tableData(returnData) {

    for (var i = 0; i < returnData.length; i++) {
        document.getElementById("ts" + i).innerHTML = returnData[i].TotalSessions;
        document.getElementById("tu" + i).innerHTML = returnData[i].TotalUsers;
        document.getElementById("tn" + i).innerHTML = returnData[i].NewUsers;
        document.getElementById("male" + i).innerHTML = returnData[i].Male;
        document.getElementById("female" + i).innerHTML = returnData[i].Female;
        document.getElementById("NotAnswered_" + i).innerHTML = returnData[i].NotAnsweredGender;
        document.getElementById("13-17_" + i).innerHTML = returnData[i].RangeStart13;
        document.getElementById("18-24_" + i).innerHTML = returnData[i].RangeStart18;
        document.getElementById("25-34_" + i).innerHTML = returnData[i].RangeStart25;
        document.getElementById("35-44_" + i).innerHTML = returnData[i].RangeStart35;
        document.getElementById("45-54_" + i).innerHTML = returnData[i].RangeStart45;
        document.getElementById("55-64_" + i).innerHTML = returnData[i].RangeStart55;
        document.getElementById("NotAnsweredAge" + i).innerHTML = returnData[i].NotAnsweredAge;
        document.getElementById("Iphone" + i).innerHTML = returnData[i].NoOfIosUsers;
        document.getElementById("Android" + i).innerHTML = returnData[i].NoOfAndriodUsers;
        document.getElementById("Windows" + i).innerHTML = returnData[i].NoOfWindowUsers;
        document.getElementById("Others" + i).innerHTML = returnData[i].NoOfOthersUsers;

        document.getElementById("NoDeezerSponsers" + i).innerHTML = returnData[i].NoDeezerSponsers;
        document.getElementById("NoSmgSponsers" + i).innerHTML = returnData[i].NoSmgSponsers;
        document.getElementById("NoDeezerAndSmgSponsers" + i).innerHTML = returnData[i].NoDeezerAndSmgSponsers;
        document.getElementById("NoNotSelectedAnySponsers" + i).innerHTML = returnData[i].NoNotSelectedAnySponsers;
    }
}

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
function downloadCSV(SData) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: SData
    });
    if (csv == null) return;

    filename = 'WiFiReport.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
