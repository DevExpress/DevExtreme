<template>
    <example-block title="dxTabPanel">
        <dx-tab-panel :items="tabs">
            <template #tab1>
                <h3>First Tab Content</h3>
            </template>
            <template #tab2>
                <async-component/>
            </template>
        </dx-tab-panel>
    </example-block>
</template>

<script>
import Vue from "vue";
import ExampleBlock from "./example-block";
import { DxTabPanel } from "../../src";

const SecondTabComponent = Vue.extend({
    template: "<h3>Second Tab Content</h3>"
});

export default {
  components: {
    ExampleBlock,
    DxTabPanel,
    AsyncComponent: () => Promise.resolve(SecondTabComponent)
  },
  data: function() {
    return {
        tabs: [
          { title:"Sync Tab", template:"tab1" },
          { title:"Async Tab", template:"tab2" }
        ]
    };
  }
};
</script>
