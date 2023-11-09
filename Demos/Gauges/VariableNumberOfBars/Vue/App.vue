<template>
  <div>
    <div class="long-title">
      <h3>Sampling by Goods</h3>
    </div>
    <div id="gauge-demo">
      <DxBarGauge
        id="gauge"
        ref="gauge"
        :start-value="0"
        :end-value="50"
        :values="values"
      >
        <DxLabel
          :format="format"
        />
      </DxBarGauge>
      <div id="panel">
        <DxCheckBox
          v-for="p in productsRef"
          :data="p"
          :key="p.name"
          v-model:value="p.active"
          :text="p.name"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { DxBarGauge, DxLabel } from 'devextreme-vue/bar-gauge';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { products } from './data.js';

const productsRef = ref(products);
const getActiveItems = () => products.filter((p) => p.active).map((p) => p.count);
const values = ref(getActiveItems());
const format = {
  type: 'fixedPoint',
  precision: 0,
};

watch(() => productsRef, () => {
  values.value = getActiveItems();
}, {
  deep: true,
});
</script>
<style scoped>
#gauge-demo {
  height: 440px;
  width: 100%;
}

#gauge {
  width: 80%;
  height: 100%;
  margin-top: 20px;
  float: left;
}

#panel {
  width: 150px;
  text-align: left;
  margin-top: 20px;
  float: left;
}

.dx-checkbox {
  margin-bottom: 10px;
  display: block;
}

.long-title h3 {
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
