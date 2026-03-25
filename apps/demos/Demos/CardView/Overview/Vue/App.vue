<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    :card-min-width="300"
    cards-per-row="auto"
    card-footer-template="footerTemplate"
    ref="cardView"
  >
    <DxPaging
      :page-size="4"
    />
    <DxHeaderFilter
      :visible="true"
    />
    <DxSearchPanel
      :visible="true"
    />
    <DxSelection mode="multiple"/>
    <DxCardCover
      :image-expr="imageExpr"
      :alt-expr="altExpr"
    />

    <DxColumn
      data-field="Status"
      field-value-template="statusTemplate"
      :allow-search="false"
    />
    <DxColumn
      caption="Full Name"
      :allow-filtering="true"
      :allow-sorting="true"
      :calculate-field-value="calculateFullName"
    />
    <DxColumn
      caption="Position"
      data-field="Title"
    />
    <DxColumn
      data-field="Department"
    />
    <DxColumn
      data-field="Mobile_Phone"
    />
    <DxColumn
      data-field="Email"
      field-value-template="emailTemplate"
      :allow-search="false"
    />
    <DxColumn
      caption="Address"
      :allow-filtering="true"
      :allow-sorting="true"
      :calculate-field-value="calculateAddress"
    />
    <template
      #statusTemplate="{ data }"
    >
      <div
        :class="['status', {
          'status--salaried': data.field.value === 'Salaried',
          'status--commission': data.field.value === 'Commission',
          'status--terminated': data.field.value === 'Terminated',
        }]"
      >
        <span class="indicator"/>
        <span>{{ data.field.value }}</span>
      </div>
    </template>
    <template
      #emailTemplate="{ data }"
    >
      <a :href="`mailto:${data.field.value}`">{{ data.field.text }}</a>
    </template>
    <template
      #footerTemplate="{ data }"
    >
      <div class="card-footer">
        <DxButton
          text="Call"
          icon="tel"
          type="default"
          styling-mode="contained"
          @click="showNotify('Call')"
        />
        <DxButton
          text="Send Email"
          icon="message"
          type="default"
          styling-mode="contained"
          @click="showNotify('Send Email')"
        />
      </div>
    </template>
  </DxCardView>
</template>

<script setup lang="ts">
import DxCardView, {
  DxColumn, DxCardCover, DxSelection, DxPaging, DxSearchPanel, DxHeaderFilter,
} from 'devextreme-vue/card-view';
import DxButton from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';
import { ref } from 'vue';
import type { Employee } from './data.ts';
import { employees } from './data.ts';

function imageExpr({ First_Name, Last_Name }: Employee): string {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

function altExpr({ First_Name, Last_Name }: Employee): string {
  return `Photo of ${First_Name} ${Last_Name}`;
}

function calculateFullName({ First_Name, Last_Name }: Employee): string {
  return `${First_Name} ${Last_Name}`;
}

function calculateAddress({ State, City }: Employee): string {
  return `${City}, ${State}`;
}

function showNotify(text: string) {
  notify({
    message: `The "${text}" button is clicked.`,
    maxWidth: 560,
  });
}

const cardView = ref<DxCardView>();

</script>

<style>
.card-footer {
  display: flex;
  padding: 12px;
  gap: 8px;
}

.card-footer > * {
  flex-grow: 1;
  width: 100%
}

.status {
  display: flex;
  align-items: center;
}

.status--salaried {
  color: var(--dx-color-success);
}

.status--commission {
  color: var(--dx-color-warning);
}

.status--terminated {
  color: var(--dx-color-danger);
}

.indicator {
  background-color: currentcolor;
  margin-right: 8px;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}
</style>
