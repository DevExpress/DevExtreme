<template>
  <div>
    <div class="options">
      <div class="caption">Notify stack</div>
      <div>position by</div>
      <DxRadioGroup
        layout="horizontal"
        :items="['alias', 'coordinates']"
        value="alias"
        @value-changed="radioGroupValueChanged($event)"
      />
      <DxSelectBox
        :items="positions"
        v-model:value="aliasPosition"
        :visible="isAlias"
      />
      <div class="section">
        <DxNumberBox
          :visible="!isAlias"
          label="top"
          v-model:value="coordinatePosition.top"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.bottom"
        />
        <DxNumberBox
          :visible="!isAlias"
          label="bottom"
          v-model:value="coordinatePosition.bottom"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.top"
        />
      </div>
      <div class="section">
        <DxNumberBox
          :visible="!isAlias"
          label="left"
          v-model:value="coordinatePosition.left"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.right"
        />
        <DxNumberBox
          :visible="!isAlias"
          label="right"
          v-model:value="coordinatePosition.right"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.left"
        />
      </div>
      <div>direction</div>
      <DxSelectBox
        :items="directions"
        v-model:value="direction"
      />
      <div class="section">
        <DxButton
          text="Show"
          width="48%"
          @click="showNotify()"
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
        'down', 'down-reverse', 'up', 'up-reverse',
        'left', 'left-reverse', 'right', 'right-reverse',
      ],
      id: 1,
      isAlias: true,
      aliasPosition: 'bottom center',
      coordinatePosition: {
        top: '',
        bottom: '',
        left: '',
        right: '',
      },
      direction: 'up',
    };
  },
  methods: {
    showNotify() {
      const position = this.isAlias ? this.aliasPosition : this.coordinatePosition;
      const direction = this.direction;

      notify({
        message: `Toast ${this.id}`,
        height: 45,
        width: 150,
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
      this.isAlias = value === 'alias';
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

.caption {
  font-weight: 600;
  font-size: 22px;
  text-align: center;
}

.section {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
