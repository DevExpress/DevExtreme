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
          v-for="p in products"
          :data="p"
          :key="p.name"
          v-model:value="p.active"
          :text="p.name"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { products } from './data.js';
import { DxBarGauge, DxLabel } from 'devextreme-vue/bar-gauge';
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxBarGauge, DxLabel, DxCheckBox
  },
  data() {
    return {
      products: products,
      values: [],
      format: {
        type: 'fixedPoint',
        precision: 0
      }
    };
  },
  watch: {
    products: {
      handler: function() {
        this.values = this.getActiveItems();
      },
      deep: true
    }
  },
  created() {
    this.values = this.getActiveItems();
  },
  methods: {
    getActiveItems() {
      return this.products.filter(p=>p.active).map(p=>p.count);
    }
  }
};
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
