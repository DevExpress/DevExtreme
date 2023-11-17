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
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  DxDataGrid, DxColumn, DxEditing, DxFilterRow,
} from 'devextreme-vue/data-grid';
import DxSelectBox, { DxSelectBoxTypes } from 'devextreme-vue/select-box';
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
import * as deMessages from 'npm:devextreme/localization/messages/de.json!json';
import * as ruMessages from 'npm:devextreme/localization/messages/ru.json!json';
import { locale as dxLocale, loadMessages, formatMessage as dxFormatMessage } from 'devextreme/localization';
import service from './data.js';

type Locale = string;

const locales: { name: string, value: Locale } = service.getLocales();
const payments: Record<string, string | number>[] = service.getPayments();
const locale: Locale = getLocale();
const editPopupOptions = { width: 700, height: 345 };
const amountEditorOptions = { format: 'currency', showClearButton: true };
const selectBoxInputAttr = { id: 'selectInput' };
const formatMessage = ref((msg) => msg);

onBeforeMount(() => {
  dxLocale(locale);
  initMessages();
});

function getLocale(): Locale {
  const storageLocale = sessionStorage.getItem('locale');
  return storageLocale != null ? storageLocale : 'en';
}
function setLocale(savingLocale: Locale) {
  sessionStorage.setItem('locale', savingLocale);
}
function initMessages() {
  loadMessages(deMessages);
  loadMessages(ruMessages);
  loadMessages(service.getDictionary());
  formatMessage.value = dxFormatMessage;
}
function changeLocale({ value }: DxSelectBoxTypes.ValueChangedEvent) {
  setLocale(value);
  document.location.reload();
}
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
