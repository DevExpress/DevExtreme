$(function(){
    $("#chart").dxChart({
        palette: "soft",
        dataSource: dataSource,
        commonSeriesSettings: {
            barPadding: 0.5,
            argumentField: "state",
            type: "bar"
        },
        series: [
            { valueField: "year1970", name: "1970" },
            { valueField: "year1980", name: "1980" },
            { valueField: "year1990", name: "1990" },
            { valueField: "year2000", name: "2000" },
            { valueField: "year2008", name: "2008" },
            { valueField: "year2009", name: "2009" }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: { 
            text: "Oil Production",
            subtitle: {
                text: "(in millions tonnes)"
            }
        }
    });
});