<template>
  <div>
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="true"
      :column-auto-width="true"
      :repaint-changes-only="true"
    >
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        mode="batch"
      />
      <DxPaging :enabled="false"/>

      <DxColumn data-field="FirstName">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="LastName">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="Position">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="Phone">
        <DxRequiredRule/>
        <DxPatternRule
          :pattern="pattern"
          message="Your phone must have &quot;(555) 555-5555&quot; format!"
        />
      </DxColumn>
      <DxColumn data-field="Email">
        <DxRequiredRule/>
        <DxEmailRule/>
        <DxAsyncRule
          :validation-callback="asyncValidation"
          message="Email address is not unique"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxRequiredRule,
  DxEmailRule,
  DxPatternRule,
  DxAsyncRule
} from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridEmployeesValidation';
const dataSource = createStore({
  key: 'ID',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxRequiredRule,
    DxEmailRule,
    DxPatternRule,
    DxAsyncRule
  },
  data() {
    return {
      dataSource,
      pattern: /^\(\d{3}\) \d{3}-\d{4}$/i
    };
  },
  methods: {
    asyncValidation(params) {
      return fetch('https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
          id: params.data.ID,
          email: params.value
        })
      }).then(response => response.json());
    }
  }
};
</script>
