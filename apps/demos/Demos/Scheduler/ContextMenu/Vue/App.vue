<template>
  <div>
    <DxScheduler
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
        icon="conferenceroomoutline"
      />
    </DxScheduler>

    <DxContextMenu
      :data-source="contextMenuItems"
      :width="200"
      target=".dx-scheduler"
      :on-item-click="onContextMenuItemClick"
      :on-hiding="onContextMenuHiding"
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
import { DxScheduler, DxResource, type DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { DxContextMenu, type DxContextMenuTypes } from 'devextreme-vue/context-menu';
import ItemTemplate from './ItemTemplate.vue';
import { resourcesData, data } from './data.ts';
import type { ContextMenuItem } from './types';

const views = ['day', 'month'];
const currentDate = ref(new Date(2020, 10, 25));
const dataSource = data;
const groups = ref<string[]>([]);
const crossScrollingEnabled = ref(false);
const contextMenuItems = ref<ContextMenuItem[]>([]);

const onAppointmentContextMenu = (e: DxSchedulerTypes.AppointmentContextMenuEvent) => {
  const items = getAppointmentContextMenuItems(e);
  contextMenuItems.value = items;
};

const onCellContextMenu = (e: DxSchedulerTypes.CellContextMenuEvent) => {
  const items = getCellContextMenuItems(e);
  contextMenuItems.value = items;
};

const onContextMenuItemClick = (e: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) => {
  e.itemData?.onItemClick?.(e);
};

const onContextMenuHiding = () => {
  contextMenuItems.value = [];
};

const getAppointmentContextMenuItems = (
  e: DxSchedulerTypes.AppointmentContextMenuEvent,
): ContextMenuItem[] => {
  const scheduler = e.component;
  const { appointmentData: appointment, targetedAppointmentData: targetedAppointment } = e;

  return [
    {
      text: 'Open',
      onItemClick: () => { scheduler.showAppointmentPopup(appointment); },
    },
    {
      text: 'Delete',
      onItemClick: () => { scheduler.deleteAppointment(appointment); },
    },
    {
      text: 'Repeat Weekly',
      beginGroup: true,
      onItemClick: () => {
        scheduler.updateAppointment(appointment, {
          ...appointment,
          startDate: targetedAppointment?.startDate,
          recurrenceRule: 'FREQ=WEEKLY',
        });
      },
    },
    {
      text: 'Set Room',
      beginGroup: true,
      disabled: true,
    },
    ...resourcesData.map((item) => ({
      ...item,
      onItemClick: (clickEvent: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) => {
        scheduler.updateAppointment(appointment, {
          ...appointment,
          roomId: [clickEvent.itemData?.id],
        });
      },
    })),
  ];
};

const getCellContextMenuItems = (
  e: DxSchedulerTypes.CellContextMenuEvent,
): ContextMenuItem[] => {
  const scheduler = e.component;

  return [
    {
      text: 'New Appointment',
      onItemClick: () => {
        scheduler.showAppointmentPopup({
          startDate: e.cellData.startDateUTC,
        }, true);
      },
    },
    {
      text: 'New Recurring Appointment',
      onItemClick: () => {
        scheduler.showAppointmentPopup({
          startDate: e.cellData.startDateUTC,
          recurrenceRule: 'FREQ=DAILY',
        }, true);
      },
    },
    {
      text: 'Group by Room/Ungroup',
      beginGroup: true,
      onItemClick: () => {
        if (groups.value.length) {
          groups.value = [];
          crossScrollingEnabled.value = false;
        } else {
          groups.value = ['roomId'];
          crossScrollingEnabled.value = true;
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
};

</script>
