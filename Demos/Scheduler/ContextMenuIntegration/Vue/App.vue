<template>
  <div>
    <DxScheduler
      ref="schedulerRef"
      time-zone="America/Los_Angeles"
      :groups="groups"
      :data-source="dataSource"
      :views="views"
      :current-date="currentDate"
      :cross-scrolling-enabled="crossScrollingEnabled"
      :start-day-hour="9"
      :height="730"
      :on-appointment-context-menu="onAppointmentContextMenu"
      :on-cell-context-menu="onCellContextMenu"
      current-view="month"
      recurrence-edit-mode="series"
    >
      <DxResource
        :data-source="resourcesData"
        field-expr="roomId"
        label="Room"
      />
    </DxScheduler>
    <DxContextMenu
      :items="contextMenuItems"
      :width="200"
      :disabled="disabled"
      :target="target"
      :on-item-click="onContextMenuItemClick"
      item-template="itemTemplateSlot"
    >
      <template #itemTemplateSlot="{ data: itemData }">
        <ItemTemplate :item-data="itemData"/>
      </template>
    </DxContextMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { DxResource, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import DxContextMenu from 'devextreme-vue/context-menu';
import ItemTemplate from './ItemTemplate.vue';
import { resourcesData, data } from './data.ts';

const views = ['day', 'month'];
const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';
const currentDate = ref(new Date(2020, 10, 25));
const dataSource = data;
const groups = ref<string[]>(undefined);
const crossScrollingEnabled = ref(false);
const disabled = ref(true);
const contextMenuItems = ref([]);
const target = ref(appointmentClassName);
const schedulerRef = ref<DxScheduler>();

function onAppointmentContextMenu(
  { appointmentData, targetedAppointmentData }: DxSchedulerTypes.AppointmentContextMenuEvent,
) {
  const scheduler = schedulerRef.value!.instance!;
  const resourceItems = resourcesData.map((item) => ({
    ...item,
    onItemClick: ({ itemData }) => scheduler?.updateAppointment(appointmentData, {
      ...appointmentData,
      ...{ roomId: [itemData.id] },
    }),
  }));
  target.value = appointmentClassName;
  disabled.value = false;
  contextMenuItems.value = [
    {
      text: 'Open',
      onItemClick: () => scheduler.showAppointmentPopup(appointmentData),
    },
    {
      text: 'Delete',
      onItemClick: () => scheduler.deleteAppointment(appointmentData),
    },
    {
      text: 'Repeat Weekly',
      beginGroup: true,
      onItemClick: () => scheduler.updateAppointment(appointmentData, {
        startDate: targetedAppointmentData.startDate,
        recurrenceRule: 'FREQ=WEEKLY',
      }),
    },
    { text: 'Set Room', beginGroup: true, disabled: true },
    ...resourceItems,
  ];
}
function onCellContextMenu({ cellData }: DxSchedulerTypes.CellContextMenuEvent) {
  const scheduler = schedulerRef.value!.instance!;
  target.value = cellClassName;
  disabled.value = false;
  contextMenuItems.value = [
    {
      text: 'New Appointment',
      onItemClick: () => scheduler.showAppointmentPopup(
        { startDate: cellData.startDate },
        true,
      ),
    },
    {
      text: 'New Recurring Appointment',
      onItemClick: () => scheduler.showAppointmentPopup(
        {
          startDate: cellData.startDate,
          recurrenceRule: 'FREQ=DAILY',
        },
        true,
      ),
    },
    {
      text: 'Group by Room/Ungroup',
      beginGroup: true,
      onItemClick: () => {
        if (groups.value) {
          crossScrollingEnabled.value = false;
          groups.value = null;
        } else {
          crossScrollingEnabled.value = true;
          groups.value = ['roomId'];
        }
      },
    },
    {
      text: 'Go to Today',
      onItemClick: () => {
        currentDate.value = new Date();
      },
    },
  ];
}
function onContextMenuItemClick(e) {
  e.itemData.onItemClick(e);
}
</script>

<style scoped>
.dx-menu-item-content span {
  margin-right: 5px;
}

.dx-menu-item-has-submenu .dx-icon-spinright {
  position: absolute;
  top: 7px;
  right: 2px;
}
</style>
