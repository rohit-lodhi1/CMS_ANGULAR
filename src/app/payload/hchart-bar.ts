export class HChartBar {

    chartOptions = {
        series: [
          {
            name: "Total Income",
            data: [44, 55, 57, 56, 61]
          },
          {
            name: "TotalOutcome",
            data: [76, 85, 101, 98, 87]
          },
        
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: [
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
          ]
        },
        yaxis: {
          title: {
            text: "$ (thousands)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return "$ " + val + " thousands";
            }
          }
        }
      };
}
