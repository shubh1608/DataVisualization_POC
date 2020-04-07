var dashboard = {

    baseUrl: "http://10.11.15.80:8080/rocket/host/",

    Init: function () {
        var me = dashboard;
        var barChart = me.showBarChart();
        var lineChart = me.showLineChart();
        me.showTable([]);
        me.bindEvents(barChart,lineChart ); 
    },

    bindEvents: function (barChrt, lineChrt) {
        var me = dashboard;

        $("#btnTable").off("click");
        $("#btnTable").on("click", me.fetchTblData);

        $("#btnBarChart").off("click");
        $("#btnBarChart").on("click", function(){
            me.fetchBarChartData(barChrt)
        });

        $("#btnLineChart").off("click");
        $("#btnLineChart").on("click", function(){
            me.fetchLineChart(lineChrt)
        });
    },

    fetchTblData: function(){
        var me = dashboard;
        // var query = {
        //     hostid: 37869,
        //     startDate: "2017-01-03-01",
        //     endDate: "2017-03-24-12" 
        // };
        var query = {
            hostid: $("#txtTblHostId").val(),
            startDate: $("#txtTblStartDate").val(),
            endDate : $("#txtTblEndDate").val()
        };
        
        if(query.hostid == "" || query.startDate == "" || query.endDate == "")
        {
            alert("please provide inputs!");
        }else{
            var url = me.baseUrl + query.hostid + "/records/" + query.startDate + "/" + query.endDate;
            $("#tblDiv").loading();
            $.ajax({
                type: 'Get',
                contentType: 'application/json',
                timeout: 360000,
                url: url,
                success: function (data) {
                    $("#tblDiv").loading("stop");
                    console.log("number of records returned: "+data.length);
                    me.showTable(data);
                },
                error: function(error){
                    $("#tblDiv").loading("stop");
                    alert(error);
                }
            });
        }
    },

    fetchBarChartData: function(chart){
        var me = dashboard;

        var query = {
            hostid: $("#txtBarChartHostId").val(),
            date: $("#txtBarChartDate").val(),
        };

        if(query.hostid == "" || query.date == "")
        {
            alert("please provide inputs!");
        }else{
            var url = me.baseUrl + query.hostid + "/calls/" + query.date;
            $("#barChartDiv").loading();
            $.ajax({
                type: 'Get',
                contentType: 'application/json',
                timeout: 360000,
                url: url,
                success: function (data) {
                    $("#barChartDiv").loading("stop");
                    var dict = {};
                    for(var i=0; i<24; i++){
                        dict[i]=0;
                    }
                    for(i in data){
                        dict[data[i].hour] = data[i].count;
                    }
                    var countHr = [];
                    for(var i in dict){
                        countHr.push(dict[i]);
                    }
                    

                    //chart.data.labels = lbls
                    chart.data.datasets.forEach((dataset) => {
                        dataset.data = countHr;
                    });
                    chart.update();
                },
                error: function(error){
                    $("#barChartDiv").loading("stop");
                    alert(error);
                }
            });
        }
    },

    fetchLineChart:function(chart){
        var me = dashboard;

        var query = {
            hostid: $("#txtLineChartHostId").val(),
            startDate: $("#txtLineChartStartDate").val(),
            endDate: $("#txtLineChartEndDate").val()
        };
        
        if(query.hostid == "" || query.startDate == "" || query.endDate == "")
        {
            alert("please provide inputs!");
        }else{
            var url = me.baseUrl + query.hostid + "/mos/" + query.startDate + "/" + query.endDate;
            $("#lineChartDiv").loading();
            $.ajax({
                type: 'Get',
                contentType: 'application/json',
                timeout: 360000,
                url: url,
                success: function (data) {
                    $("#lineChartDiv").loading("stop");
                    var dict={};
                    for(var i=0; i<data.length; i++){
                        var key = data[i].year+"-"+data[i].month+"-"+data[i].day+"-"+data[i].hour; 
                        dict[key] = data[i].mos.toFixed(2);
                    }
                    var dates=Object.keys(dict);
                    var mosValues = Object.values(dict);

                    chart.data.labels = dates
                    chart.data.datasets.forEach((dataset) => {
                        dataset.data = mosValues;
                        dataset.label = "Number of datapoints: "+ data.length;
                    });
                    chart.update();
                },
                error: function(error){
                    $("#lineChartDiv").loading("stop");
                    alert(error);
                }
            });
    }
    },

    showTable: function (jsonArr) {
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "400px",
            sorting: true,
            paging: true,
            data: jsonArr,
            fields: [
                { name: "callid", type: "number", width: 80, title: "Call Id", align: "center" },
                { name: "src", type: "text", width: 100, title: "Source", align: "center" },
                { name: "dst", type: "text", width: 100, title: "Destination", align: "center" },
                { name: "mos", type: "number", title: "MOS Score", align: "center" }
            ]
        });
    },

    showBarChart: function () {
        var ctx = $('#barChart');
        var lbls = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        var barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: lbls,
                datasets: [{
                    label: '# calls',
                    // data: [],
                    backgroundColor: 'rgba(0,51,102,0.6)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        return barChart;
    },

    showLineChart: function (hostId, hours, mosValues) {
        var hostIdData = {
            labels: hours,
            datasets: [
                {
                    label: "Number of datapoints: ",
                    data: mosValues,
                    pointRadius: 0,
                    backgroundColor: 'rgba(0,51,102,0.6)',
                    borderColor: 'rgba(0,51,102,0.6)',
                    fill: false,
                    lineTension: 0,
                    radius: 5
                },]
        };
        var ctx = $('#lineChart');
        var lineChart = new Chart(ctx, {
            type: 'line',
            data: hostIdData,
            options: {
                responsive: false,
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 16
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 30,
                            maxTicksLimit: 30
                        }
                    }]
                }
            }
        });
        return lineChart;
    },

}

$(function () {
    dashboard.Init();
});