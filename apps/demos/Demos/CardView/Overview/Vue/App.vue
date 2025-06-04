<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    :card-min-width="250"
    cards-per-row="auto"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
    card-footer-template="footerTemplate"
    ref="cardView"
  >
    <DxSelection mode="multiple"/>
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
      data-field="Mobile_Phone"
    />
    <DxColumn
      data-field="Email"
      field-value-template="emailTemplate"
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
      <div class="footer">
        <DxButton
          text="Call"
          icon="tel"
          type="default"
          styling-mode="contained"
          @click="showNotify('Call')"
        />
        <DxButton
          text="Send Email"
          icon="send"
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
  DxColumn, DxCardCover, DxSelection,
} from 'devextreme-vue/card-view';
import DxButton from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';
import { ref } from 'vue';
import type { Employee } from './data.ts';
import { employees } from './data.ts';

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
    .find((employee) => employee.ID === Head_ID);

  if (!assignedTo) {
    return 'None';
  }

  return `${assignedTo.First_Name} ${assignedTo.Last_Name}`;
}

function showNotify(text: string) {
  notify(`The "${text}" button is clicked.`);
}

const navigateToAssignee = async(value) => {
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
  const cardElement = cardViewInstance.getCardElement(cardIndex);
  cardElement.focus();
  cardElement.classList.add('card-highlight');
};

const cardView = ref<DxCardView>();

</script>

<style>
.footer {
  display: flex;
  padding: 12px;
  gap: 8px;
}

.footer > * {
  flex-grow: 1;
}

.indicator {
  display: inline-block;
  margin-right: 8px;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}

.status-ok {
  color: var(--dx-color-success);
}

.status-ok > .indicator {
  background-color: var(--dx-color-success);
}

.status-warning {
  color: var(--dx-color-warning);
}

.status-warning > .indicator {
  background-color: var(--dx-color-warning);
}
</style>
