$(function(){
    var arabicColumns = [{
            dataField: "nameAr",
            caption: "الدولة"
        }, {
            dataField: "capitalAr",
            caption: "عاصمة"
        }, {
            dataField: "population",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            caption: "عدد السكان (نسمة) 2013"
        }, {
            dataField: "area",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            headerCellTemplate: function(container) {
                container.append($("<div>المساحة (كم<sup>2</sup>)</div>"));
            }
        }, {
            dataField: "accession",
            visible: false
        }],
        englishColumns = [{
            dataField: "nameEn",
            caption: "Name"
        }, {
            dataField: "capitalEn",
            caption: "Capital"
        }, {
            dataField: "population",
            format: {
                type: "fixedPoint",
                precision: 0
            },
        }, {
            dataField: "area",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            headerCellTemplate: function(container) {
                container.append($("<div>Area (km<sup>2</sup>)</div>"));
            }
        }, {
            dataField: "accession",
            visible: false
        }];
    
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: europeanUnion,
        keyExpr: "nameEn",
        showBorders: true,
        searchPanel: {
            visible: true
        },
        paging: {
            pageSize: 15
        },
        columns: englishColumns
    }).dxDataGrid("instance");
    
    var languages = ["Arabic (Right-to-Left direction)", "English (Left-to-Right direction)"];
    
    $("#select-language").dxSelectBox({
        items: languages,
        value: languages[1],
        width: 250,
        onValueChanged: function(data) {
            var isRTL = data.value === languages[0];
            dataGrid.option("rtlEnabled", isRTL);
            dataGrid.option("columns", (isRTL) ? arabicColumns : englishColumns);
            dataGrid.option("searchPanel.placeholder", (isRTL) ? "بحث" : "Search..." );       
        }
    });
});