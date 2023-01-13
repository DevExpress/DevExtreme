<template>
  <div class="form">

    <div class="label">Default mode</div>
    <div>
      <img
        id="product1"
        src="../../../../images/products/17.png"
      >

      <DxTooltip
        :hide-on-outside-click="false"
        target="#product1"
        show-event="mouseenter"
        hide-event="mouseleave"
      >
        ExcelRemote IR
      </DxTooltip>
    </div>

    <div class="label">With template</div>
    <div>
      <img
        id="product2"
        src="../../../../images/products/3.png"
      >

      <DxTooltip
        :hide-on-outside-click="false"
        target="#product2"
        show-event="mouseenter"
        hide-event="mouseleave"
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
      >

      <DxTooltip
        :target="'#product3'"
        show-event="mouseenter"
        hide-event="mouseleave"
        :position="'top'"
        :animation="animationConfig"
        :hide-on-outside-click="false"
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
    DxTooltip,
  },

  data() {
    return {
      animationConfig: {
        show: {
          type: 'slide',
          from: {
            top: -100,
            opacity: 0,
          },
          to: {
            top: 0,
            opacity: 1,
          },
        },
        hide: {
          type: 'pop',
          from: {
            scale: 1,
            opacity: 1,
          },
          to: {
            scale: 0.1,
            opacity: 0,
          },
        },
      },
    };
  },
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
