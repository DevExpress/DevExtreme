<template>
  <div class="form">

    <div class="label">Default mode</div>
    <div>
      <img
        id="product1"
        src="../../../../images/products/17.png"
        @mouseenter="toggleDefault"
        @mouseleave="toggleDefault"
      >

      <DxTooltip
        v-model:visible="defaultVisible"
        :close-on-outside-click="false"
        target="#product1"
      >
        ExcelRemote IR
      </DxTooltip>
    </div>

    <div class="label">With template</div>
    <div>
      <img
        id="product2"
        src="../../../../images/products/3.png"
        @mouseenter="toggleWithTemplate"
        @mouseleave="toggleWithTemplate"
      >

      <DxTooltip
        v-model:visible="withTemplateVisible"
        :close-on-outside-click="false"
        target="#product2"
        position="right"
      >
        <img
          :width="150"
          src="../../../../images/products/3.png"
        ><br>
        <b>SuperPlasma 50</b><br> 2400$
      </DxTooltip>
    </div>

    <div class="label">With animation</div>
    <div>
      <img
        :id="'product3'"
        src="../../../../images/products/15.png"
        @mouseenter="toggleWithAnimation"
        @mouseleave="toggleWithAnimation"
      >

      <DxTooltip
        :target="'#product3'"
        :position="'top'"
        :animation="animationConfig"
        v-model:visible="withAnimationVisible"
        :close-on-outside-click="false"
      >
        Projector PlusHD
      </DxTooltip>
    </div>

  </div>
</template>
<script>
import { DxTooltip } from 'devextreme-vue/tooltip';

export default {
  components: {
    DxTooltip
  },

  data() {
    return {
      defaultVisible: false,
      withAnimationVisible: false,
      withTemplateVisible: false,
      animationConfig: {
        show: {
          type: 'slide',
          from: {
            top: -100,
            opacity: 0
          },
          to: {
            top: 0,
            opacity: 1
          }
        },
        hide: {
          type: 'pop',
          from: {
            scale: 1,
            opacity: 1
          },
          to: {
            scale: 0.1,
            opacity: 0
          }
        }
      }
    };
  },

  methods: {
    toggleDefault() {
      this.defaultVisible = !this.defaultVisible;
    },

    toggleWithTemplate() {
      this.withTemplateVisible = !this.withTemplateVisible;
    },

    toggleWithAnimation() {
      this.withAnimationVisible = !this.withAnimationVisible;
    }
  }
};
</script>
<style>
.form {
  padding: 20px;
}

.form img {
  width: 100px;
  margin: 10px 0 30px;
}

.label {
  font-size: 16px;
}
</style>
