<template>
  <div :class="['hidden-days-demo', { 'is-invalid': isInvalid }]">
    <div class="scheduler-container">
      <DxScheduler
        time-zone="America/Los_Angeles"
        :data-source="dataSource"
        :views="views"
        :hidden-week-days="hiddenWeekDays"
        :current-date="currentDate"
        current-view="week"
        :start-day-hour="9"
        :height="730"
      />
    </div>
    <div class="options">
      <div class="caption">
        Visible Week Days
      </div>
      <div
        v-for="(label, idx) in dayLabels"
        :key="idx"
        class="option"
      >
        <DxCheckBox
          :text="label"
          :value="visibleDays[idx]"
          @value-changed="(e: DxCheckBoxTypes.ValueChangedEvent) => onDayToggled(idx, e.value)"
        />
      </div>
      <div class="validation-message">
        {{ validationMessage }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import DxScheduler, { type DxSchedulerTypes } from 'devextreme-vue/scheduler';
import DxCheckBox, { type DxCheckBoxTypes } from 'devextreme-vue/check-box';
import { ArrayStore } from 'devextreme-vue/common/data';
import { data } from './data.ts';

const dataSource = new ArrayStore({
  key: 'id',
  data,
});

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultVisible = [true, true, true, false, true, false, true];
const views = ['week', 'workWeek', 'month', 'timelineWeek', 'agenda'];
const validationMessage = 'The hiddenWeekDays option cannot hide all days of the week. At least one day must remain visible.';

const currentDate = new Date(2021, 3, 26);

const visibleDays = reactive([...defaultVisible]);

const allDays: DxSchedulerTypes.DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const hiddenWeekDays = computed(() => allDays.filter((d) => !visibleDays[d]));

const isInvalid = computed(() => visibleDays.every((v) => !v));

function onDayToggled(idx: number, value: boolean | null | undefined) {
  visibleDays[idx] = !!value;
}
</script>
