<template>
  <div
    :class="markWeekEnd(cellData)"
  >
    <div :class="markTraining(cellData)">
      {{ cellData.text }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cellData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    markWeekEnd(cellData) {
      function isWeekEnd(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
      }
      const classObject = {};
      classObject[`employee-${cellData.groups.employeeID}`] = true;
      classObject[`employee-weekend-${cellData.groups.employeeID}`] = isWeekEnd(cellData.startDate);
      return classObject;
    },

    markTraining(cellData) {
      const classObject = {
        'day-cell': true
      };

      classObject[this.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
      return classObject;
    },

    getCurrentTraining(date, employeeID) {
      var result = (date + employeeID) % 3,
        currentTraining = `training-background-${result}`;

      return currentTraining;
    }
  }
};
</script>
<style>
.day-cell {
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
}

.employee-1 {
    background-color: rgba(86, 202, 133, 0.1);
}

.employee-2 {
    background-color: rgba(255, 151, 71, 0.1);
}

.employee-weekend-1 {
    background-color: rgba(86, 202, 133, 0.2);
}

.employee-weekend-2 {
    background-color: rgba(255, 151, 71, 0.2);
}

.training-background-0 {
    background-image: url("../../../../images/gym/icon-abs.png");
}

.training-background-1 {
    background-image: url("../../../../images/gym/icon-step.png");
}

.training-background-2 {
    background-image: url("../../../../images/gym/icon-fitball.png");
}

.dx-theme-material .name h2 {
    font-size: 28px;
}
</style>
