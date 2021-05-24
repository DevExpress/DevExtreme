<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="true"
      key-expr="ID"
    >
      <DxPaging :enabled="false"/>
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        mode="popup"
      >
        <DxPopup
          :show-title="true"
          :width="700"
          :height="525"
          title="Employee Info"
        />
        <DxForm>
          <DxItem
            :col-count="2"
            :col-span="2"
            item-type="group"
          >
            <DxItem data-field="FirstName"/>
            <DxItem data-field="LastName"/>
            <DxItem data-field="Prefix"/>
            <DxItem data-field="BirthDate"/>
            <DxItem data-field="Position"/>
            <DxItem data-field="HireDate"/>
            <DxItem
              :col-span="2"
              :editor-options="{ height: 100 }"
              data-field="Notes"
              editor-type="dxTextArea"
            />
          </DxItem>

          <DxItem
            :col-count="2"
            :col-span="2"
            item-type="group"
            caption="Home Address"
          >
            <DxItem data-field="StateID"/>
            <DxItem data-field="Address"/>
          </DxItem>
        </DxForm>
      </DxEditing>

      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="170"
        data-field="Position"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <DxColumn
        :width="125"
        data-field="StateID"
        caption="State"
      >
        <DxLookup
          :data-source="states"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        :visible="false"
        data-field="Address"
      />
      <DxColumn
        :visible="false"
        data-field="Notes"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxPopup,
  DxLookup,
  DxForm
} from 'devextreme-vue/data-grid';
import { DxTextArea } from 'devextreme-vue/text-area';
import { DxItem } from 'devextreme-vue/form';
import { employees, states } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxPopup,
    DxLookup,
    DxForm,
    DxItem,
    DxTextArea
  },
  data() {
    return {
      dataSource: employees,
      states: states
    };
  }
};
</script>
<style>
#data-grid-demo {
  min-height: 700px;
}
</style>
