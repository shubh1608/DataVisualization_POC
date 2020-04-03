var dashboard = {

    Init: function () {
        var me = dashboard;
        me.bindEvents();
        me.showTable([]);
    },

    bindEvents: function () {
        var me = dashboard;

        $("#btnTable").off("click");
        $("#btnTable").on("click", me.fetchTblData);

        $("#btnBarChart").off("click");
        $("#btnBarChart").on("click", function () {
            var queryData ={
                hostid: $("#tblHostId").val(),
                startDate: $("#txtTblStartDate").val(),
                endDate: $("#txtTblEndDate").val()
            }
            me.showBarChart();
        });

        $("#btnLineChart").off("click");
        $("#btnLineChart").on("click", function () {
            me.showLineChart();
        });
    },

    fetchTblData: function(){
        var me = dashboard;
        var url = "http://10.11.15.80:8080/rocket-debug/cassandra/calls";
        $.ajax({
            type: 'Get',
            contentType: 'application/json',
            timeout: 360000,
            url: url,
            contentType: 'application/json',
            success: function (data) {
                alert("success");
                alert(data);
            },
            error: function(error){
                alert(error);
            }
        });
    },

    showTable: function (jsonArr) {
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "400px",
            sorting: true,
            paging: true,
            data: jsonArr,
            fields: [
                // { name: "created", type: "text", width: 100, title: "Created Date", align: "center" },
                { name: "callid", type: "number", width: 80, title: "Call Id", align: "center" },
                { name: "src", type: "text", width: 100, title: "Source", align: "center" },
                { name: "dst", type: "text", width: 100, title: "Destination", align: "center" },
                { name: "mos", type: "number", title: "MOS Score", align: "center" }
            ]
        });
    },

    showBarChart: function () {
        var ctx = $('#barChart');
        var barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                datasets: [{
                    label: '# calls',
                    data: [1, 2, 1, 5, 2, 3, 4, 5, 6, 12, 19, 20, 21, 22, 23, 30, 33, 27, 24, 17, 8, 7, 4, 2],
                    backgroundColor: 'rgba(0,51,102,0.6)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },

    showLineChart: function () {
        var hostIdData = {
            labels: [188130, 188142, 188145, 188146, 188148, 188147, 188149, 188151,
                188152, 188153, 188150, 188154, 188156, 188157, 188158, 188144,
                188159, 188160, 188161, 188162, 188163, 188155, 188164],
            datasets: [
                {
                    label: "HostId: 69653",
                    data: [4.4, 4.4, 4.1, 4.3, 4.4, 4.4, 4.4, 4.4, 4.1, 4.1, 4.1, 4.2, 4.3, 4.3, 4.4, 4.4, 4.4, 4.4, 4.3, 4.3, 4.3, 4.3, 4.2],
                    backgroundColor: "blue",
                    borderColor: "lightblue",
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
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }]
                }
            }
        });
    },

    callApi: function (url, queryData) {
        $.ajax(url,
            {
                dataType: 'json', // type of response data
                timeout: 500,     // timeout milliseconds
                data:queryData,
                success: function (data, status, xhr) {   // success callback function
                    $('p').append(data.firstName + ' ' + data.middleName + ' ' + data.lastName);
                },
                error: function (jqXhr, textStatus, errorMessage) { // error callback 
                    $('p').append('Error: ' + errorMessage);
                }
            });
    }

}

$(function () {
    dashboard.Init();
});