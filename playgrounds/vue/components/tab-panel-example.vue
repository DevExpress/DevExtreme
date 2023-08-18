<template>
  <example-block title="dxTabPanel">
    <dx-tab-panel :items="tabs">
      <template #tab1>
        <h3>First Tab Content</h3>
      </template>
      <template #tab2>
        <async-comp />
      </template>
    </dx-tab-panel>
  </example-block>
</template>

<script>
import Vue, { defineAsyncComponent } from "vue";
import ExampleBlock from "./example-block";
import { DxTabPanel } from "devextreme-vue";

const SecondTabComponent = {
  extends: "<h3>Second Tab Content</h3>"
};

const AsyncComp = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: "<div>I am async!</div>"
      });
    })
);

export default {
  components: {
    ExampleBlock,
    DxTabPanel,
    AsyncComp
  },
  data: function () {
    return {
      tabs: [
        { title: "Sync Tab", template: "tab1" },
        { title: "Async Tab", template: "tab2" }
      ]
    };
  }
};
</script>
