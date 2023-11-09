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
      :on-appointment-added="showAddedToast"
      :on-appointment-updated="showUpdatedToast"
      :on-appointment-deleted="showDeletedToast"
      current-view="week"
    >
      <DxEditing
        :allow-adding="allowAdding"
        :allow-deleting="allowDeleting"
        :allow-updating="allowUpdating"
        :allow-resizing="allowResizing"
        :allow-dragging="allowDragging"
      />
    </DxScheduler>
    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { DxEditing, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import DxCheckBox from 'devextreme-vue/check-box';
import notify from 'devextreme/ui/notify';
import { data } from './data.ts';

const views = ['day', 'week'];
const currentDate = new Date(2021, 3, 29);
const dataSource = data;
const allowAdding = ref(true);
const allowDeleting = ref(true);
const allowUpdating = ref(true);
const allowResizing = ref(true);
const allowDragging = ref(true);

function showToast(event, value, type) {
  notify(`${event} "${value}" task`, type, 800);
}
function showAddedToast(e: DxSchedulerTypes.AppointmentAddedEvent) {
  showToast('Added', e.appointmentData.text, 'success');
}
function showUpdatedToast(e: DxSchedulerTypes.AppointmentUpdatedEvent) {
  showToast('Updated', e.appointmentData.text, 'info');
}
function showDeletedToast(e: DxSchedulerTypes.AppointmentDeletedEvent) {
  showToast('Deleted', e.appointmentData.text, 'warning');
}
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
    display: inline-block;
    width: 19%;
  }

  .options-container {
    display: flex;
    align-items: center;
  }
</style>
