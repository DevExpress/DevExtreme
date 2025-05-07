<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :first-day-of-week="1"
    current-view="workWeek"
    ref="schedulerRef"
  >
    <DxResource
      :data-source="assignees"
      field-expr="assigneeId"
      label="Assignee"
      :allow-multiple="true"
    />
    <DxToolbar>
      <DxItem
        location="before"
        name="dateNavigator"
        :options="dateNavigatorOptions"
      />
      <DxItem
        location="before"
        locate-in-menu="auto"
        widget="dxButton"
        :options="newEventButtonOptions"
      />
      <DxItem
        location="center"
        locate-in-menu="auto"
        template="assigneesTemplate"
      />
      <DxItem
        location="after"
        locate-in-menu="auto"
        name="viewSwitcher"
      />
    </DxToolbar>
    <template #assigneesTemplate>
      <DxTagBox
        :items="assignees"
        :input-attr="{ 'aria-label': 'Group' }"
        :element-attr="{ class: 'assignees-tag-box' }"
        display-expr="text"
        value-expr="id"
        show-selection-controls="true"
        max-displayed-tags="1"
        :value="assigneesFilterValue"
        @value-changed="onAssigneesFilterChange"
      />
    </template>
  </DxScheduler>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import DxScheduler, {
  DxResource, DxToolbar, DxItem, DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { DxTagBox, DxTagBoxTypes } from 'devextreme-vue/tag-box';
import { data, assignees } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];
const currentDate = ref(new Date(2021, 3, 27));
const assigneesFilterValue = ref([]);
const schedulerRef = ref<DxScheduler | null>(null);
const dataSource = computed(() => (assigneesFilterValue.value.length > 0
  ? data.filter((item) => assigneesFilterValue.value.some((id) => item.assigneeId.includes(id)))
  : data));

const dateNavigatorOptions = {
  onItemClick(event) {
    if (event.itemData.key === 'today') {
      currentDate.value = new Date();
    }
  },
  items: [
    { key: 'today', text: 'Today' },
    'prev',
    'next',
    'current',
  ],
};
const newEventButtonOptions = {
  icon: 'plus',
  text: 'New event',
  onClick: () => {
    schedulerRef.value!.instance!.showAppointmentPopup({
      startDate: new Date(),
    }, true);
  },
};

function onAssigneesFilterChange(event: DxTagBoxTypes.ValueChangedEvent) {
  assigneesFilterValue.value = event.value;
}
</script>

<style scoped>
  .assignees-tag-box {
    min-width: 200px;
  }
</style>
