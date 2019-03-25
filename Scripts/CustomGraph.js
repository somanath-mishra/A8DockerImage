GenerateReport();

function GenerateReport() {
var CpServiceUrl = localStorage.getItem("CpUrl").toString().trim();
    //var SearchId = document.getElementById("ddlSelect").value;
var SiteData = parseInt(localStorage.getItem("SiteId"));
$("#siteDdl").val(SiteData);
var SearchId = $("#ddlSelect").val();

var GraphId = window.location.pathname.split("/")[2] == "Index" ? 100 : 200;

//var dataObj = { SitedId: siteId, SiteName: selectedText, searchCategory: SearchId }
var dataObj = { searchCategory: SearchId, SiteId: SiteData, GraphTypeId: GraphId }

if (SearchId == 4) {
    var range = $('#inpDatePicker').val();
    var dates = range.split(" - ");
    var startDate = dates[0];
    var endDate = dates[1];
    dataObj.FromDateTime = startDate;
    dataObj.ToCurrentDateTime = endDate;
}

$.post(CpServiceUrl + "/RealTimeDataApi/GetAnalysisData", dataObj, function (resultJSON) {
        var arr = new Array();
        var arrData = new Array();
        var arrData1 = new Array();
        var arrData2 = new Array();
        var dataPieResult = new Array();
        var arrNetworkData = new Array();
        var dataUserDemographics = new Array();
        var dataGenderDemographics = new Array();

        for (key in resultJSON.ResultAreaGraph) {
            var result = resultJSON.ResultAreaGraph[key];
            arr.push(result.Name);
            arrData.push(result.Value1);
            arrData1.push(result.Value2);
            arrData2.push(result.Value3)
        }

        if (window.location.pathname.split("/")[2] == "Index") {
            document.getElementById("totalUsers").innerHTML = resultJSON.Result.TotalUsers;
            document.getElementById("totalSession").innerHTML = resultJSON.Result.TotalSessions;
            document.getElementById("totalRegisters").innerHTML = resultJSON.Result.RegisteredUsers;
            document.getElementById("totalMaleUsers").innerHTML = resultJSON.Result.MaleUsers;
            document.getElementById("totalFemaleUsers").innerHTML = resultJSON.Result.FemaleUsers;
            document.getElementById("totalNotAnswered").innerHTML = resultJSON.Result.TotalUsers - (resultJSON.Result.MaleUsers + resultJSON.Result.FemaleUsers);
            document.getElementById("rowIOS").innerHTML = resultJSON.Result.NoOfIosUsers;
            document.getElementById("rowAndroid").innerHTML = resultJSON.Result.NoOfAndriodUsers;
            document.getElementById("rowWindow").innerHTML = resultJSON.Result.NoOfWindowUsers;
            document.getElementById("rowOthers").innerHTML = resultJSON.Result.NoOfOthersUsers;
            document.getElementById("totalAvgTime").innerHTML = resultJSON.Result.AverageTime;
            document.getElementById("TotalBandWidth").innerHTML = resultJSON.Result.TotalUsage;

            //Bind the Label for User Demographices

            document.getElementById("dataRange13").innerHTML = resultJSON.Result.RangeStart13;
            document.getElementById("dataRange18").innerHTML = resultJSON.Result.RangeStart18;
            document.getElementById("dataRange25").innerHTML = resultJSON.Result.RangeStart25;
            document.getElementById("dataRange35").innerHTML = resultJSON.Result.RangeStart35;
            document.getElementById("dataRange45").innerHTML = resultJSON.Result.RangeStart45;
            document.getElementById("dataRange55").innerHTML = resultJSON.Result.RangeStart55;
            document.getElementById("dataRange65").innerHTML = resultJSON.Result.RangeStart65;
            //document.getElementById("percentageMale").innerHTML = resultJSON.Result[0].PercentageMale;
            //document.getElementById("percentageFemale").innerHTML = resultJSON.Result[0].PercentageFemale;

            //Data with Android,IOS,Window and Others
            dataPieResult.push(resultJSON.Result.NoOfIosUsers);
            dataPieResult.push(resultJSON.Result.NoOfAndriodUsers);
            dataPieResult.push(resultJSON.Result.NoOfWindowUsers);
            dataPieResult.push(resultJSON.Result.NoOfOthersUsers);

            // Data for total NetWorkUsageUp and NetWorkUsageDown
            arrNetworkData.push(resultJSON.Result.NetworkUsageUp);
            arrNetworkData.push(resultJSON.Result.NetWorkUsageDown);

            //Data for User Demographics Chart
            dataUserDemographics.push(resultJSON.Result.RangeStart13);
            dataUserDemographics.push(resultJSON.Result.RangeStart18);
            dataUserDemographics.push(resultJSON.Result.RangeStart25);
            dataUserDemographics.push(resultJSON.Result.RangeStart35);
            dataUserDemographics.push(resultJSON.Result.RangeStart45);
            dataUserDemographics.push(resultJSON.Result.RangeStart55);
            dataUserDemographics.push(resultJSON.Result.RangeStart65);

            dataGenderDemographics.push(resultJSON.Result.MaleUsers);
            dataGenderDemographics.push(resultJSON.Result.FemaleUsers);
            dataGenderDemographics.push(resultJSON.Result.TotalUsers - (resultJSON.Result.MaleUsers + resultJSON.Result.FemaleUsers));


            //Show the Pie Chart as per the Device

            $('#PieChartUserDemographics').remove(); // this is my <canvas> element
            $('#PieChartUserDemographicsContainer').append('<canvas id="PieChartUserDemographics" @*style="margin: 0x 0px 0px 0px;height:100px;width:150px;" height="100px" width="200px"*@></canvas>');
            var ctxDoughNut = document.getElementById('PieChartUserDemographics').getContext('2d');
            //ctxRes.defaults.global.legend.display = false;
            var myChartUserDemoGraphics = new Chart(ctxDoughNut, {
                type: 'doughnut',
                data: {
                    labels: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-65', '65+'],
                    datasets: [{
                        backgroundColor: [
                          "#FFC0CB",
                          "#3498DB",
                          "#E74C3C",
                          "#1ABB9C",
                          "#9B59B6",
                          "#000000",
                          "#FFFF00"
                        ],
                        data: dataUserDemographics
                    }]
                }
            });

            document.getElementById('tbl_AgeRange').className = "unhide";


            $('#PieChart').remove(); // this is my <canvas> element
            $('#PiechartContainer').append('<canvas id="PieChart" @*style="margin: 0x 0px 0px 0px;height:100px;width:150px;" height="100px" width="200px"*@></canvas>');

            //Show the Pie Chart for Usser DemoGraphics
            var ctxDoughNutUserDemo = document.getElementById('PieChart').getContext('2d');

            //ctxRes.defaults.global.legend.display = false;
            var myChart = new Chart(ctxDoughNutUserDemo, {
                type: 'doughnut',
                data: {
                    labels: ['IOS', 'Android', 'Window', 'Others'],
                    datasets: [{
                        backgroundColor: [
                            "#3498DB",
                            "#1ABB9C",
                            "#9CC2CB",
                            "#E74C3C"
                        ],
                        data: dataPieResult
                    }]
                }
            });

            document.getElementById('tbl_DeviceDetails').className = "unhide";

            $('#GenderPieChart').remove(); // this is my <canvas> element
            $('#GenderPieChartContainer').append('<canvas id="GenderPieChart"></canvas>');

            //Show the Pie Chart for Usser DemoGraphics
            var ctxDoughNutGenderDemo = document.getElementById('GenderPieChart').getContext('2d');

            //ctxRes.defaults.global.legend.display = false;
            var myGenderChart = new Chart(ctxDoughNutGenderDemo, {
                type: 'doughnut',
                data: {
                    labels: ['Male', 'Female', 'Not Answered'],
                    datasets: [{
                        backgroundColor: [
                            "#9B59B6",
                            "#1ABB9C",
                            "#9CC2CB"
                        ],
                        data: dataGenderDemographics
                    }]
                }
            });

            document.getElementById('tbl_GenderDetails').className = "unhide";


            //Total NetWorkUsage Grah for with NetWorkUp Usage and NetWork down Usage
            //Show the Pie Chart as per the Device

            $('#NetworkPieChart').remove(); // this is my <canvas> element
            $('#NetwotkPieChartContainer').append('<canvas id="NetworkPieChart"><canvas>');

            var canvasctxNetwork = document.getElementById('NetworkPieChart');
            var ctxNetwork = canvasctxNetwork.getContext('2d');
            //ctxRes.defaults.global.legend.display = false;
            ctxNetwork.clearRect(0, 0, canvasctxNetwork.width, canvasctxNetwork.height);
            var myChart = new Chart(ctxNetwork, {
                type: 'pie',
                data: {
                    labels: ['NetworkUp', 'NetWorkDown'],
                    datasets: [{
                        backgroundColor: [
                          "#2ecc71",
                          "#3498db"
                        ],
                        data: arrNetworkData
                    }]
                }
            });

            //Area chart to show the AreaChart for Total Sessiona and Avg session between the time period

            $('#AreaChart').remove(); // this is my <canvas> element
            $('#AreaChartContainer').append('<canvas id="AreaChart"><canvas>');
            var ctx = document.getElementById('AreaChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: arr,
                    fillColor: "rgba(252,147,65,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(173,173,173,1)",
                    pointStrokeColor: "#fff",
                    datasets: [
                    {
                        label: 'No Of Sessions',
                        data: arrData,
                        backgroundColor: "rgb(138,28,42)"
                    }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: true,
                                labelString: "No. Of Session",
                                fontColor: "rgb(138,28,42)",
                            }
                        }],
                        xAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: false,
                                labelString: "Time in Hours",
                                fontColor: "rgb(138,28,42)",
                            }
                        }]
                    }
                }
            });

            if (SearchId == 0) {
                myChart.options.scales.xAxes[0].scaleLabel.display = true;
                myChart.update();
            }


            $('#AreaChart1').remove(); // this is my <canvas> element
            $('#AreaChartContainer1').append('<canvas id="AreaChart1"><canvas>');
            var ctx = document.getElementById('AreaChart1').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: arr,
                    fillColor: "rgba(252,147,65,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(173,173,173,1)",
                    pointStrokeColor: "#fff",
                    datasets: [
                        {
                            label: 'Average Session Length In Minutes',
                            data: arrData1,
                            backgroundColor: "rgb(222,94,45)"
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: true,
                                labelString: "Avg. Session Length",
                                fontColor: "rgb(222,94,45)",
                            }
                        }],
                        xAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: false,
                                labelString: "Time in Hours",
                                fontColor: "rgb(222,94,45)",
                            }
                        }]
                    }
                }
            });

            if (SearchId == 0) {
                myChart.options.scales.xAxes[0].scaleLabel.display = true;
                myChart.update();
            }
        }

        else {
            document.getElementById("totalUsageUp").innerHTML = resultJSON.WifiUsageGraphReturn.NetworkUsageUp;
            document.getElementById("totalUsageDown").innerHTML = resultJSON.WifiUsageGraphReturn.NetWorkUsageDown;
            document.getElementById("AvgUsageSession").innerHTML = resultJSON.WifiUsageGraphReturn.AvgUsage;
            document.getElementById("PeakUsageInPeriod").innerHTML = resultJSON.WifiUsageGraphReturn.PeakUsage;


            $('#UsageUpAreaChart').remove(); // this is my <canvas> element
            $('#UsageUpAreaChartContainer').append('<canvas id="UsageUpAreaChart"><canvas>');
            var canvasBandwidthNetwork = document.getElementById('UsageUpAreaChart');
            var ctxBandwidthNetwork = canvasBandwidthNetwork.getContext('2d');
            var myChart = new Chart(ctxBandwidthNetwork, {
                type: 'line',
                data: {
                    labels: arr,
                    fillColor: "rgba(252,147,65,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(173,173,173,1)",
                    pointStrokeColor: "#fff",
                    datasets: [
                    {
                        label: 'Usage Up',
                        data: arrData,
                        backgroundColor: "rgb(138,28,42)"
                    }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: true,
                                labelString: "MB",
                                fontColor: "rgb(138,28,42)",
                            }
                        }]
                    }
                }
            });

            $('#UsageDownAreaChart').remove(); // this is my <canvas> element
            $('#UsageDownAreaChartContainer').append('<canvas id="UsageDownAreaChart"><canvas>');
            var ctx = document.getElementById('UsageDownAreaChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: arr,
                    fillColor: "rgba(252,147,65,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(173,173,173,1)",
                    pointStrokeColor: "#fff",
                    datasets: [
                        {
                            label: 'Usage Down',
                            data: arrData1,
                            backgroundColor: "rgb(222,94,45)"
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: true,
                                labelString: "MB",
                                fontColor: "rgb(222,94,45)",
                            }
                        }]
                    }
                }
            });


            $('#SessionActiveAreaChart').remove(); // this is my <canvas> element
            $('#SessionActiveAreaChartContainer').append('<canvas id="SessionActiveAreaChart"><canvas>');
            var ctx = document.getElementById('SessionActiveAreaChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: arr,
                    fillColor: "rgba(252,147,65,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(173,173,173,1)",
                    pointStrokeColor: "#fff",
                    datasets: [
                        {
                            label: 'Usage Down',
                            data: arrData2,
                            backgroundColor: "rgb(232,173,63)"
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            //gridLines: {
                            //    color: "black",
                            //    borderDash: [2, 5],
                            //},
                            scaleLabel: {
                                display: true,
                                labelString: "MB",
                                fontColor: "rgb(232,173,63)",
                            }
                        }]
                    }
                }
            });
        }
})
.fail(function (response) {
    toastr.error('Error: ' + response.responseJSON.ExceptionMessage);
});
}