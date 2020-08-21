<template>
  <div>
    <DxPivotGrid
      :height="440"
      :show-borders="true"
      row-header-layout="tree"
      :data-source="dataSource"
      @exporting="onExporting"
    >
      <DxFieldChooser :enabled="false"/>
      <DxExport :enabled="true"/>
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxExport,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from 'file-saver';
*/
import { sales } from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser
  },
  data() {
    return {
      dataSource: new PivotGridDataSource({
        fields: [{
          caption: 'Region',
          dataField: 'region',
          area: 'row',
          expanded: true
        }, {
          caption: 'City',
          dataField: 'city',
          area: 'row',
          width: 150
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
          expanded: true
        }, {
          caption: 'Sales',
          dataField: 'amount',
          dataType: 'number',
          area: 'data',
          summaryType: 'sum',
          format: 'currency',
        }],
        store: sales
      })
    };
  },
  methods: {
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales');

      exportPivotGrid({
        component: e.component,
        worksheet: worksheet
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
        });
      });
      e.cancel = true;
    }
  }
};
</script>
