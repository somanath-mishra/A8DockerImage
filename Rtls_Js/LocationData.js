var BaseUrl = localStorage.getItem("rtlsUrl");
var LocationDataUrl = BaseUrl + "/UIData/GetLocationData/";
var FilterUrl = BaseUrl + "/UIData/FilterLocationData";
var DatatoupdateUrl = BaseUrl + "/UIData/UpdateRTLSDataDelete";

//On Page Load we need to call
GetLocationData(LocationDataUrl);

//On the drop down changes funtion need to call
$("select.NumberOfRecord").change(function () {
    var NumberOfRecord = $(".NumberOfRecord option:selected").val();
    $("#RecordToDisply").val(NumberOfRecord);
    $("#CurrentPage").val(0);
    GetLocationData(LocationDataUrl);
});

//On the page change need to call
function go_to_page(page_num) {
  
    $("#CurrentPage").val(page_num);
  
    GetLocationData(LocationDataUrl);


}

function filter() {
    //alert("filter js called");
    //alert($("#IdMacAddress").val());
    //alert($("#IdArea").val());
    if (!$("#IdMacAddress").val() && !$("#IdArea").val()) {
        toastr.error("Please enter MacAddress or Area to start Filter");
        return false;
    }
    FilterData = { MacAddress: $("#IdMacAddress").val(), AreaName: $("#IdArea").val(), SiteName: localStorage.getItem("SiteName"), SiteId: parseInt(localStorage.getItem("SiteId")), TotalPage: $("TotalPage").val(), CurrentPage: $("#CurrentPage").val(), RecordToDisply: $("#RecordToDisply").val(), TotalRecords: $("#TotalRecords").val() }
    //alert(FilterData.AreaName);
    $.ajax({
        url: FilterUrl,
        data: FilterData,
        type: "POST",
        //beforeSend: function (xhr) {
        //    xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        //},
        success: function (data) {
            //alert("inside success");
            $('#macDetails').empty();
            $.each(data.lstLocationData, function (key, item) {

                $('#macDetails').append("<tr>" +
                    "<td>" + item.MacAddress + "</td>" +
                    "<td>" + item.UserName + "</td>" +
                    "<td>" + new Date(item.NotifyDateTime+'Z')  + "</td>" +
                    "<td>" + new Date(item.NotificationSenderTimeStamp) + "</td>" +
                    "</tr>");

            });
            $("#TotalPage").val(data.TotalPage);
            $("#CurrentPage").val(data.CurrentPage);
            $("#RecordToDisply").val(data.RecordToDisply);
            $("#TotalRecords").val(data.TotalRecords);
            $("#NumberOfRecord").val(data.RecordToDisply);
            $("select.NumberOfRecord").val(data.RecordToDisply);


            getPagelist(data.TotalRecords, data.CurrentPage, data.RecordToDisply, 5);
            $(".BtnChkSelect").attr("disabled", "disabled");
        }
    });
}


function GetLocationData(url) {
    PostCommonLoadData = { SiteName: localStorage.getItem("SiteName"), SiteId: parseInt(localStorage.getItem("SiteId")), TotalPage: $("TotalPage").val(), CurrentPage: $("#CurrentPage").val(), RecordToDisply: $("#RecordToDisply").val(), TotalRecords: $("#TotalRecords").val() };
    $.ajax({
        url: url,
        data: PostCommonLoadData,
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        },
        success: function (data) {
            $("#dropdownfordelete").val(data.TimeFrame);
            $('#macDetails').empty();
            $.each(data.lstLocationData, function (key, item) {
                var day = moment.unix((item.NotificationSenderTimeStamp.substring(0, item.NotificationSenderTimeStamp.length - 3))); //seconds

                $('#macDetails').append("<tr>" +
                    "<td>" + item.MacAddress + "</td>" +
                    "<td>" + item.UserName + "</td>" +
                    "<td>" + moment.utc(item.NotifyDateTime).format('DD-MM-YYYY HH:mm:ss') + "</td>" +
                    "<td>" + day.format("DD-MM-YYYY HH:mm:ss") + "</td>" +
                    "</tr>");
            });
            $("#TotalPage").val(data.TotalPage);
            $("#CurrentPage").val(data.CurrentPage);
            $("#RecordToDisply").val(data.RecordToDisply);
            $("#TotalRecords").val(data.TotalRecords);
            $("#NumberOfRecord").val(data.RecordToDisply);
            $("select.NumberOfRecord").val(data.RecordToDisply);


            getPagelist(data.TotalRecords, data.CurrentPage, data.RecordToDisply, 5);
            $(".BtnChkSelect").attr("disabled", "disabled");
        }
    });
}

$("select.dropdownfordelete").change(function () {

    var deletedropdownValue = $(".dropdownfordelete option:selected").val();

    DatatoUpdate = { SiteId: parseInt(localStorage.getItem("SiteId")), TimeFrame: deletedropdownValue };
    $.ajax({
        url: DatatoupdateUrl,
        data: DatatoUpdate,
        type: "POST",
        //beforeSend: function (xhr) {
        //    xhr.setRequestHeader("Authorization", "BEARER " + localStorage.getItem('hdnrtlstoken').toString());
        //},
        success: function (data) {
            alert("dataupdated");
        }
    });

});
