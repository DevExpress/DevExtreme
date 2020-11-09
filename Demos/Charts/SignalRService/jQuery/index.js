$(function(){
    $.connection.hub.url = "https://js.devexpress.com/Demos/Mvc/signalr";
    var hub = $.connection.stockTickDataHub;
  
    var store = new DevExpress.data.CustomStore({
        load: function() {
            return hub.server.getAllData();
        },
        key: "Date"
    });

    hub.client.updateStockPrice = function(data) {
        store.push([{ type: "insert", key: data.Date, data: data }]);
    };

    $.connection.hub.start({ waitForPageLoad: false }).done(function() {
        $("#chart").dxChart({
            dataSource: store,
            margin: {
                right: 30
            },
            loadingIndicator: {
                enabled: true
            },
            title: "Stock Price",
            series: [{
                pane: "Price",
                argumentField: "Date",
                type: "candlestick",
                aggregation: {
                    enabled: true,
                    method: "custom",
                    calculate: function(e) {
                        var prices = e.data.map(function(i) {
                            return i.Price;
                        });
                        if (prices.length) {
                            return {
                                Date: e.intervalStart,
                                open: prices[0],
                                high: Math.max.apply(null, prices),
                                low: Math.min.apply(null, prices),
                                close: prices[prices.length - 1]
                            };
                        }
                    }
                }
            }, {
                pane: "Volume",
                name: "Volume",
                argumentField: "Date",
                type: "bar",
                valueField: "Volume",
                color: "red",
                aggregation: {
                    enabled: true,
                    method: "sum"
                }
            }],
            panes: [{
                name: "Price"
            }, {
                name: "Volume",
                height: 80
            }],
            customizePoint: function(arg) {
                if(arg.seriesName === "Volume") {
                    var point = $("#chart").dxChart("getAllSeries")[0].getPointsByArg(arg.argument)[0].data;
                    if(point.close >= point.open) {
                        return { color: "#1db2f5" };
                    } 
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                argumentFormat: "shortDateShortTime",
                contentTemplate: function (pointInfo, element) {
                    var print = function(label, value) {
                        var span = $("<span>", { 
                            "class": "tooltip-label", 
                            text: label
                        });
                        element.append($("<div>", { 
                            text: value 
                        }).prepend(span));
                    };
                    
                    var volume = pointInfo.points.filter(function(point) {
                        return point.seriesName === "Volume";
                    })[0];
                    var prices = pointInfo.points.filter(function(point) {
                        return point.seriesName !== "Volume";
                    })[0];
                    
                    print("", pointInfo.argumentText);
                    print("Open: ", formatCurrency(prices.openValue));
                    print("High: ", formatCurrency(prices.highValue));
                    print("Low: ", formatCurrency(prices.lowValue));
                    print("Close: ", formatCurrency(prices.closeValue));
                    print("Volume: ", formatNumber(volume.value));
                }
            },
            crosshair: {
                enabled: true,
                horizontalLine: { visible: false }
            },
            zoomAndPan: {
                argumentAxis: "both"
            },
            scrollBar: {
                visible: true
            },
            legend: {
                visible: false
            },
            argumentAxis: {
                argumentType: "datetime",
                minVisualRangeLength: { minutes: 10 },
                visualRange: {
                    length: "hour"
                }
            },
            valueAxis: {
                placeholderSize: 50
            }
        });
    });
    
    var formatCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;
});
