var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
  var priceCaption = 'Price';
  var ratingCaption = 'Rating';

  $scope.buttonOptions = {
    text: 'Export multiple grids',
    icon: 'xlsxfile',
    onClick: function() {
      var dataGrid1 = $('#priceDataGrid').dxDataGrid('instance');
      var dataGrid2 = $('#ratingDataGrid').dxDataGrid('instance');

      var workbook = new ExcelJS.Workbook();
      var priceSheet = workbook.addWorksheet(priceCaption);
      var ratingSheet = workbook.addWorksheet(ratingCaption);

      priceSheet.getRow(2).getCell(2).value = 'Price';
      priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

      ratingSheet.getRow(2).getCell(2).value = 'Rating';
      ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

      function setAlternatingRowsBackground(gridCell, excelCell) {
        if(gridCell.rowType === 'header' || gridCell.rowType === 'data') {
          if(excelCell.fullAddress.row % 2 === 0) {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' }};
          }
        }
      }

      DevExpress.excelExporter.exportDataGrid({
        worksheet: priceSheet,
        component: dataGrid1,
        topLeftCell: { row: 4, column: 2 },
        customizeCell: function(options) {
          setAlternatingRowsBackground(options.gridCell, options.excelCell)
        }
      }).then(function() {
        return DevExpress.excelExporter.exportDataGrid({
          worksheet: ratingSheet,
          component: dataGrid2,
          topLeftCell: { row: 4, column: 2 },
          customizeCell: function(options) {
            setAlternatingRowsBackground(options.gridCell, options.excelCell)
          }
        });
      }).then(function() {
          workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
          });
      });
    }
  }

  $scope.tabPanelOptions = {
    dataSource: [{
      title: priceCaption,
      template: function() {
        return $("<div id='priceDataGrid'>").dxDataGrid({
          width: '100%',
          columns: [
            { dataField: 'Product_ID', caption: 'ID', width: 50 },
            { dataField: 'Product_Name', caption: 'Name' },
            { dataField: 'Product_Sale_Price', caption: 'Sale Price', dataType: 'number', format: 'currency' },
            { dataField: 'Product_Retail_Price', caption: 'Retail Price', dataType: 'number', format: 'currency' }
          ],
          showBorders: true,
          rowAlternationEnabled: true,
          dataSource: {
            store: {
              type: 'odata',
              url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
              key: 'Product_ID'
            },
            select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
            filter: ['Product_ID', '<', 10]
          }
        });
      }
    }, {
      title: ratingCaption,
      template: function() {
        return $("<div id='ratingDataGrid'>").dxDataGrid({
          width: '100%',
          columns: [
            { dataField: 'Product_ID', caption: 'ID', width: 50 },
            { dataField: 'Product_Name', caption: 'Name' },
            { dataField: 'Product_Consumer_Rating', caption: 'Rating' },
            { dataField: 'Product_Category', caption: 'Category' }
          ],
          showBorders: true,
          rowAlternationEnabled: true,
          dataSource: {
            store: {
              type: 'odata',
              url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
              key: 'Product_ID'
            },
            select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
            filter: ['Product_ID', '<', 10]
          }
        });
      }
    }],
    itemTitleTemplate: function(itemData, itemIndex, itemElement) {
      itemElement.append("<span class='dx-tab-text'>" + itemData.title + "</span>");
    },
    deferRendering: false
  };
});