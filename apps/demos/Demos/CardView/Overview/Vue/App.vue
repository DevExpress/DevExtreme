<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    :card-min-width="250"
    cards-per-row="auto"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
    card-footer-template="cardFooterTemplate"
    ref="cardView"
  >
    <DxSelection mode="multiple" />
    <DxCardCover
      :image-expr="imageExpr"
      :alt-expr="altExpr"
    />

    <DxColumn
      data-field="Status"
      field-value-template="statusTemplate"
    />
    <DxColumn
      caption="Full Name"
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
      data-field="Head_ID"
      caption="Assigned To"
      :calculate-display-value="calculateAssignedTo"
      field-value-template="assignedToTemplate"
    />
    <DxColumn
      data-field="Mobile_Phone"
    />
    <DxColumn
      data-field="Email"
    />
    <DxColumn
      caption="Address"
      :calculate-field-value="calculateAddress"
    />
    <template
      #statusTemplate="{ data }"
    > 
      <div
        :class="{
          'status-ok': data.field.value === 'Salaried',
          'status-warning': data.field.value !== 'Salaried',
        }"
      >
        <span class="indicator"></span>
        <span>{{ data.field.value }}</span>
      </div>
    </template>
    <template
      #assignedToTemplate="{ data }"
    >
      <div v-if="!data.field.value">{{ data.field.text }}</div>
      <div v-if="data.field.value">
        <a class="dx-link" @click="navigateToAssignee(data.field.value)">
          {{ data.field.text }}
        </a>
      </div>
    </template>
    <template
      #footerTemplate="{ data }"
    >
      <div class="footer">
        <DxButton
          text="Call"
          icon="tel"
          type="default"
          stylingMode="contained"
          @click="showNotify('Call')"
        ></DxButton>
        <DxButton
          text="Send Email"
          icon="send"
          type="default"
          stylingMode="contained"
          @click="showNotify('Send Email')"
        ></DxButton>
      </div>
    </template>
  </DxCardView>
</template>

<script setup lang="ts">
import DxCardView, {
  DxColumn, DxCardCover, DxSelection,
} from 'devextreme-vue/card-view';
import DxButton from 'devextreme-vue/button';
import type { Employee } from './data.ts';
import { employees } from './data.ts';
import { ref } from 'vue';

// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};

// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
};

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

function calculateAssignedTo({ Head_ID }) {
  const assignedTo = employees
    .find((employee) => employee.ID === Head_ID)

  if (!assignedTo) {
    return 'None';
  }

  return `${assignedTo.First_Name} ${assignedTo.Last_Name}`;
}

const navigateToAssignee = async (value) => {
  const cardViewInstance = cardView.value!.instance!;
  
  document.querySelectorAll('.card-highlight').forEach((card) => {
    card.classList.remove('card-highlight');
  });

  const index = employees.findIndex(
    (employee) => employee.ID === value,
  );

  const pageIndex = Math.floor(index / cardViewInstance.pageSize());
  await cardViewInstance.pageIndex(pageIndex);

  const cardIndex = cardViewInstance.getCardIndexByKey(value);
  const cardElement = cardViewInstance.getCardElement(cardIndex)
  cardElement.focus();
  cardElement.classList.add('card-highlight');
}

const cardView = ref<DxCardView>();


</script>
