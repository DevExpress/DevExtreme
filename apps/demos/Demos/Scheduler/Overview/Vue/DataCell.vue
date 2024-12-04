<template>
  <div
    :class="markWeekEnd(cellData)"
  >
    <div :class="markTraining(cellData)">
      {{ cellData.text }}
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  cellData?: any
}>(), {
  cellData: () => {},
});

function markWeekEnd(cellData) {
  function isWeekEnd(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
  const classObject = {};
  classObject[`employee-${cellData.groups.employeeID}`] = true;
  classObject[`employee-weekend-${cellData.groups.employeeID}`] = isWeekEnd(cellData.startDate);
  return classObject;
}
function markTraining(cellData) {
  const classObject = {
    'day-cell': true,
  };

  classObject[
    getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)
  ] = true;
  return classObject;
}
function getCurrentTraining(date, employeeID) {
  const result = (date + employeeID) % 3;
  const currentTraining = `training-background-${result}`;

  return currentTraining;
}
</script>
<style>
.day-cell {
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.dx-scheduler-appointment {
  color: rgba(255, 255, 255, 1);
}

.employee-1 {
  background-color: rgba(55, 126, 58, 0.08);
}

.employee-2 {
  background-color: rgba(194, 81, 0, 0.08);
}

.employee-weekend-1 {
  background-color: rgba(55, 126, 58, 0.12);
}

.employee-weekend-2 {
  background-color: rgba(194, 81, 0, 0.12);
}

.training-background-0 {
  background-image: url("../../../../images/Scheduler/Overview/icon-abs.png");
}

.training-background-1 {
  background-image: url("../../../../images/Scheduler/Overview/icon-step.png");
}

.training-background-2 {
  background-image: url("../../../../images/Scheduler/Overview/icon-fitball.png");
}
</style>
