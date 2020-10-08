<template>
  <div>
    <div id="range-selector-demo">
      <DxRangeSelector
        id="range-selector"
        v-model:value="range"
        title="Calculate the Working Days Count in a Date Period"
      >
        <DxMargin :top="50"/>
        <DxScale
          :start-value="startValue"
          :end-value="endValue"
          tick-interval="month"
          minor-tick-interval="day"
        >
          <DxMinorTick :visible="false"/>
          <DxMarker :visible="false"/>
          <DxLabel format="MMM"/>
        </DxScale>
        <DxBehavior :call-value-changed="currentBehaviorMode"/>
        <DxSliderMarker format="dd EEEE"/>
      </DxRangeSelector>
      <h2>Working days count: {{ workingDaysCount }}</h2>
      <div class="options">
        <div class="caption">Options</div>
        <div class="option">
          <span>Handle Range Changes </span>
          <DxSelectBox
            :data-source="behaviorModes"
            :width="210"
            v-model:value="currentBehaviorMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxMinorTick,
  DxMarker,
  DxLabel,
  DxBehavior,
  DxSliderMarker
} from 'devextreme-vue/range-selector';
import { DxSelectBox } from 'devextreme-vue/select-box';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxScale,
    DxMinorTick,
    DxMarker,
    DxLabel,
    DxBehavior,
    DxSliderMarker,
    DxSelectBox
  },
  data() {
    const range = [new Date(2011, 0, 1), new Date(2011, 11, 31)];
    const behaviorModes = ['onMoving', 'onMovingComplete'];
    return {
      startValue: range[0],
      endValue: range[1],
      range,
      behaviorModes,
      currentBehaviorMode: behaviorModes[0]
    };
  },
  computed: {
    workingDaysCount() {
      const currentDate = new Date(this.range[0]);
      let workingDaysCount = 0;

      while (currentDate <= this.range[1]) {
        if(currentDate.getDay() > 0 && currentDate.getDay() < 6) {
          workingDaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return workingDaysCount;
    }
  }
};
</script>
<style scoped>
#range-selector {
  height: 200px;
}

h2 {
  text-align: center;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.option {
  margin-top: 10px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}

</style>
