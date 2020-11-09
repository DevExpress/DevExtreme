<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="9"
      :end-day-hour="19"
      :editing="editing"
      :on-appointment-added="showAddedToast"
      :on-appointment-updated="showUpdatedToast"
      :on-appointment-deleted="showDeletedToast"
      current-view="week"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowAdding"
          text="Allow adding"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowDeleting"
          text="Allow deleting"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowUpdating"
          text="Allow updating"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :disabled="!allowUpdating"
          v-model:value="allowResizing"
          text="Allow resizing"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :disabled="!allowUpdating"
          v-model:value="allowDragging"
          text="Allow dragging"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxScheduler from 'devextreme-vue/scheduler';

import DxCheckBox from 'devextreme-vue/check-box';

import notify from 'devextreme/ui/notify';

import { data } from './data.js';

export default {
  components: {
    DxScheduler,
    DxCheckBox
  },
  data() {
    return {
      views: ['day', 'week'],
      currentDate: new Date(2021, 4, 27),
      dataSource: data,
      allowAdding: true,
      allowDeleting: true,
      allowUpdating: true,
      allowResizing: true,
      allowDragging: true
    };
  },
  computed: {
    editing() {
      return {
        allowAdding: this.allowAdding,
        allowDeleting: this.allowDeleting,
        allowUpdating: this.allowUpdating,
        allowResizing: this.allowResizing,
        allowDragging: this.allowDragging
      };
    }
  },
  methods: {
    showToast: function(event, value, type) {
      notify(`${event} "${value}" task`, type, 800);
    },

    showAddedToast: function(e) {
      this.showToast('Added', e.appointmentData.text, 'success');
    },

    showUpdatedToast: function(e) {
      this.showToast('Updated', e.appointmentData.text, 'info');
    },

    showDeletedToast: function(e) {
      this.showToast('Deleted', e.appointmentData.text, 'warning');
    },
  },
};
</script>

<style scoped>
  .options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin-top: 10px;
    margin-right: 4px;
    display: inline-block;
    width: 19%;
  }
</style>
