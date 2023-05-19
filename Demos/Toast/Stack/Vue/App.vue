<template>
  <div>
    <div class="options">
      <div>Position</div>
      <DxRadioGroup
        layout="horizontal"
        :items="['predefined', 'coordinates']"
        value="predefined"
        @value-changed="radioGroupValueChanged($event)"
      />
      <DxSelectBox
        :items="positions"
        :input-attr="{ 'aria-label': 'Position' }"
        v-model:value="predefinedPosition"
        :visible="isPredefined"
      />
      <div class="section">
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="top"
          v-model:value="coordinatePosition.top"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.bottom"
          :input-attr="{ 'aria-label': 'Position Top' }"
        />
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="bottom"
          v-model:value="coordinatePosition.bottom"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.top"
          :input-attr="{ 'aria-label': 'Position Bottom' }"
        />
      </div>
      <div class="section">
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="left"
          v-model:value="coordinatePosition.left"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.right"
          :input-attr="{ 'aria-label': 'Position Left' }"
        />
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="right"
          v-model:value="coordinatePosition.right"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.left"
          :input-attr="{ 'aria-label': 'Position Right' }"
        />
      </div>
      <div>Direction</div>
      <DxSelectBox
        :items="directions"
        :input-attr="{ 'aria-label': 'Direction' }"
        v-model:value="direction"
      />
      <div class="section">
        <DxButton
          text="Show"
          width="48%"
          @click="show()"
        />
        <DxButton
          text="Hide all"
          width="48%"
          @click="hideAll()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxButton from 'devextreme-vue/button';
import DxRadioGroup from 'devextreme-vue/radio-group';
import DxSelectBox from 'devextreme-vue/select-box';
import DxNumberBox from 'devextreme-vue/number-box';
import notify from 'devextreme/ui/notify';
import hideToasts from 'devextreme/ui/toast/hide_toasts';

export default {
  components: {
    DxButton,
    DxRadioGroup,
    DxSelectBox,
    DxNumberBox,
  },
  data() {
    return {
      types: ['error', 'info', 'success', 'warning'],
      positions: [
        'top left', 'top center', 'top right',
        'bottom left', 'bottom center', 'bottom right',
        'left center', 'center', 'right center',
      ],
      directions: [
        'down-push', 'down-stack', 'up-push', 'up-stack',
        'left-push', 'left-stack', 'right-push', 'right-stack',
      ],
      id: 1,
      isPredefined: true,
      predefinedPosition: 'bottom center',
      coordinatePosition: {
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
      },
      direction: 'up-push',
    };
  },
  methods: {
    show() {
      const position = this.isPredefined ? this.predefinedPosition : this.coordinatePosition;
      const direction = this.direction;

      notify({
        message: `Toast ${this.id}`,
        height: 45,
        width: 150,
        minWidth: 150,
        type: this.types[Math.floor(Math.random() * 4)],
        displayTime: 3500,
        animation: {
          show: {
            type: 'fade', duration: 400, from: 0, to: 1,
          },
          hide: { type: 'fade', duration: 40, to: 0 },
        },
      },
      { position, direction });
      this.id += 1;
    },

    hideAll() {
      hideToasts();
    },

    radioGroupValueChanged({ value }) {
      this.isPredefined = value === 'predefined';
    },
  },
};
</script>
<style>
.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
