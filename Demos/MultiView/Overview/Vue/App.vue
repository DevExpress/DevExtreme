<template>
  <div id="multiview">
    <div>
      Item <span>{{ selectedIndex + 1 }}</span> of <span>{{ companies.length }}</span>: <i>Swipe the view horizontally to switch to the next view.</i>
    </div>
    <DxMultiView
      :height="300"
      :data-source="companies"
      v-model:selected-index="selectedIndex"
      :loop="loop"
      :animation-enabled="animationEnabled"
    >
      <template #item="{ data: company }">
        <div>
          <div class="multiview-item">
            <h1>{{ company.CompanyName }}</h1>
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
        </div>
      </template>
    </DxMultiView>
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
    </div>
  </div>
</template>
<script>

import DxCheckBox from 'devextreme-vue/check-box';
import DxMultiView from 'devextreme-vue/multi-view';

import { multiViewItems } from './data.js';

export default {
  components: {
    DxCheckBox,
    DxMultiView
  },
  data() {
    return {
      selectedIndex: 0,
      loop: false,
      animationEnabled: true,
      companies: multiViewItems
    };
  }
};
</script>
<style>
#multiview {
    margin-top: 25px;
}

.multiview-item {
    margin:25px;
    user-select: none;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    padding: 20px 0 30px;
}

.multiview-item  > div {
    padding-top: 20px;
}

#multiview > div:first-child {
    padding-left: 25px;
}

#multiview  p,
#multiview  h1  {
    margin: 0;
}

#multiview  h1 {
    font-size: 34px;
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
