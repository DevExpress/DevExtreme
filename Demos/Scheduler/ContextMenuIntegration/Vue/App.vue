<template>
  <div>
    <DxScheduler
      ref="scheduler"
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

<script>
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import DxContextMenu from 'devextreme-vue/context-menu';

import ItemTemplate from './ItemTemplate.vue';
import { resourcesData, data } from './data.js';

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxContextMenu,
    ItemTemplate,
  },
  data() {
    return {
      views: ['day', 'month'],
      currentDate: new Date(2020, 10, 25),
      dataSource: data,
      groups: undefined,
      crossScrollingEnabled: false,
      resourcesData,
      disabled: true,
      contextMenuItems: [],
      target: appointmentClassName,
    };
  },
  methods: {
    onAppointmentContextMenu({ appointmentData, targetedAppointmentData }) {
      const scheduler = this.$refs.scheduler.instance;
      const resourceItems = resourcesData.map((item) => ({
        ...item,
        onItemClick: ({ itemData }) => scheduler.updateAppointment(appointmentData, {
          ...appointmentData,
          ...{ roomId: [itemData.id] },
        }),
      }));
      this.target = appointmentClassName;
      this.disabled = false;
      this.contextMenuItems = [
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
    },
    onCellContextMenu({ cellData }) {
      const scheduler = this.$refs.scheduler.instance;
      this.target = cellClassName;
      this.disabled = false;
      this.contextMenuItems = [
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
            if (this.groups) {
              this.crossScrollingEnabled = false;
              this.groups = null;
            } else {
              this.crossScrollingEnabled = true;
              this.groups = ['roomId'];
            }
          },
        },
        {
          text: 'Go to Today',
          onItemClick: () => {
            this.currentDate = new Date();
          },
        },
      ];
    },

    onContextMenuItemClick(e) {
      e.itemData.onItemClick(e);
    },
  },
};
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
