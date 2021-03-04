<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :views="views"
      :current-date="currentDate"
      :start-day-hour="9"
      :height="600"
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
      :data-source="contextMenuItems"
      :width="200"
      :disabled="disabled"
      :target="target"
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

<script>
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import DxContextMenu from 'devextreme-vue/context-menu';

import ItemTemplate from './ItemTemplate.vue';
import { resourcesData, data } from './data.js';
import { cellContextMenuItems, appointmentContextMenuItems, setResource } from './MenuItems.js';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxContextMenu,
    ItemTemplate
  },
  data() {
    return {
      views: ['day', 'month'],
      currentDate: new Date(2020, 10, 25),
      dataSource: data,
      resourcesData: resourcesData,
      cellContextMenuItems: cellContextMenuItems,
      appointmentContextMenuItems: this.getAllAppointmentContextMenuItems(),
      disabled: true,
      contextMenuItems: [],
      contextMenuEvent: null,
      target: undefined,
    };
  },
  methods: {
    onAppointmentContextMenu(e) {
      this.target = '.dx-scheduler-appointment';
      this.disabled = false;
      this.contextMenuItems = this.appointmentContextMenuItems;
      this.contextMenuEvent = e;
    },

    onCellContextMenu(e) {
      this.target = '.dx-scheduler-date-table-cell';
      this.disabled = false;
      this.contextMenuItems = this.cellContextMenuItems;
      this.contextMenuEvent = e;
    },

    onContextMenuItemClick(e) {
      e.itemData.onItemClick(this.contextMenuEvent, e);
    },

    onContextMenuHiding() {
      this.disabled = true;
      this.contextMenuItems = [];
    },

    getAllAppointmentContextMenuItems() {
      resourcesData.map(function(item) {
        item.onItemClick = setResource;
      });
      return appointmentContextMenuItems.concat(resourcesData);
    }
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
