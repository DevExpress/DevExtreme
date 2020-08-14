<template>
  <div>
    <DxButton
      text="Export to PDF"
      @click="onExport()"
    />

    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
    >
      <DxColumn
        :width="60"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        :width="130"
        data-field="Position"
      />
      <DxColumn
        :width="100"
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="100"
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import service from './data.js';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default {
  components: {
    DxDataGrid, DxButton, DxColumn
  },
  data() {
    return {
      dataSource: service.getEmployees()
    };
  },
  methods: {
    onExport(e) {
      var headRow = [['Prefix', 'FirstName', 'LastName', 'City', 'State', 'Position', 'BirthDate', 'HireDate']];
      var bodyRows = [];
      for(let i = 0; i < this.dataSource.length; i++) {
        var val = this.dataSource[i];
        bodyRows.push([val.FirstName, val.LastName, val.Prefix, val.City, val.State, val.Position, val.BirthDate, val.HireDate]);
      }

      var autoTableOptions = {
        theme: 'plain',
        tableLineColor: 149,
        tableLineWidth: 0.1,
        styles: { textColor: 51, lineColor: 149, lineWidth: 0 },
        columnStyles: {},
        headStyles: { fontStyle: 'normal', textColor: 149, lineWidth: 0.1 },
        bodyStyles: { lineWidth: 0.1 },
        head: headRow,
        body: bodyRows
      };

      const doc = new jsPDF();
      doc.autoTable(autoTableOptions);
      doc.save('filePDF.pdf');

      e.cancel = true;
    }
  }
};
</script>
