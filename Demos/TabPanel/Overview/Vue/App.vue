<template>
  <div>
    <DxTabPanel
      :height="260"
      :data-source="companies"
      v-model:selected-index="selectedIndex"
      :loop="loop"
      :animation-enabled="animationEnabled"
      :swipe-enabled="swipeEnabled"
    >
      <template #title="{ data: company }">
        <span>{{ company.CompanyName }}</span>
      </template>
      <template #item="{ data: company }">
        <div class="tabpanel-item">
          <div>
            <p>
              <b>{{ company.City }}</b>
              (<span>{{ company.State }}</span>)
            </p>
            <p>
              <span>{{ company.Zipcode }}</span>
              <span>{{ company.Address }}</span>
            </p>
          </div>
          <div>
            <p>
              Phone: <b>{{ company.Phone }}</b>
            </p>
            <p>
              Fax: <b>{{ company.Fax }}</b>
            </p>
            <p>
              Website:
              <a
                :href="company.Website"
                target="_blank"
              >
                {{ company.Website }}
              </a>
            </p>
          </div>
        </div>
      </template>
    </DxTabPanel>
    <div class="item-box">
      Item <span>{{ selectedIndex + 1 }}</span> of <span>{{ companies.length }}</span>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="loop"
          text="Loop enabled"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="animationEnabled"
          text="Animation enabled"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="swipeEnabled"
          text="Swipe enabled"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxCheckBox from 'devextreme-vue/check-box';
import DxTabPanel from 'devextreme-vue/tab-panel';

import { multiViewItems } from './data.js';

export default {
  components: {
    DxCheckBox,
    DxTabPanel
  },
  data() {
    return {
      selectedIndex: 0,
      loop: false,
      animationEnabled: true,
      swipeEnabled: true,
      companies: multiViewItems
    };
  }
};
</script>
<style>
.tabpanel-item {
    height: 200px;
    user-select: none;
    padding-left: 25px;
    padding-top: 55px;
}

.mobile .tabpanel-item {
    padding-top: 10px;
}

.tabpanel-item  > div {
    float: left;
    padding: 0 85px 10px 10px
}

.tabpanel-item  p {
    font-size: 16px;
    margin: 0;
}

.item-box {
    font-size: 16px;
    margin: 15px 0 45px 10px;
}

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}
</style>
