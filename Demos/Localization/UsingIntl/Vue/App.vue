<template>
  <div>
    <DxDataGrid
      :data-source="payments"
      key-expr="PaymentId"
    >
      <DxEditing
        :allow-updating="true"
        :popup="editPopupOptions"
        mode="popup"
      />
      <DxFilterRow
        :visible="true"
        apply-filter="auto"
      />
      <DxColumn
        :caption="formatMessage('Number')"
        :allow-editing="false"
        :width="100"
        data-field="PaymentId"
      />
      <DxColumn
        :caption="formatMessage('Contact')"
        data-field="ContactName"
      />
      <DxColumn
        :caption="formatMessage('Company')"
        data-field="CompanyName"
      />
      <DxColumn
        :caption="formatMessage('Amount')"
        :editor-options="amountEditorOptions"
        data-field="Amount"
        data-type="number"
        format="currency"
      />
      <DxColumn
        :caption="formatMessage('PaymentDate')"
        data-field="PaymentDate"
        data-type="date"
      />
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <label for="selectInput">Language </label>
        <DxSelectBox
          :data-source="locales"
          :value="locale"
          :input-attr="selectBoxInputAttr"
          value-expr="Value"
          display-expr="Name"
          @valueChanged="changeLocale($event)"
        />
      </div>
    </div>

  </div>
</template>
<script>

import { DxDataGrid, DxColumn, DxEditing, DxFilterRow } from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';

import deMessages from 'npm:devextreme/localization/messages/de.json!json';
import ruMessages from 'npm:devextreme/localization/messages/ru.json!json';

import { locale, loadMessages, formatMessage } from 'devextreme/localization';

import service from './data.js';

export default {
  components: {
    DxSelectBox,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxFilterRow
  },
  data() {
    return {
      locale: null,
      locales: service.getLocales(),
      payments: service.getPayments(),
      editPopupOptions: { width:700, height:345 },
      amountEditorOptions: { format: 'currency', showClearButton: true },
      selectBoxInputAttr: { id: 'selectInput' }
    };
  },
  created() {
    this.locale = this.getLocale();
    this.initMessages();
    locale(this.locale);
  },
  methods: {
    getLocale() {
      const locale = sessionStorage.getItem('locale');
      return locale != null ? locale : 'en';
    },
    setLocale(locale) {
      sessionStorage.setItem('locale', locale);
    },
    initMessages() {
      loadMessages(deMessages);
      loadMessages(ruMessages);
      loadMessages(service.getDictionary());
    },
    changeLocale(e) {
      this.setLocale(e.value);
      document.location.reload();
    },
    formatMessage: formatMessage
  }
};
</script>
<style scoped>

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.option {
    margin-top: 10px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option > label {
    margin-right: 10px;
}

.option > .dx-selectbox {
    display: inline-block;
    vertical-align: middle;
}
</style>
