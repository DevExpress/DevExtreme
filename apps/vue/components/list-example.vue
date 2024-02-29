<template>
  <example-block title="dxList">
    <h4>List of simple items</h4>
    <dx-list :items="simpleData" />
    <br />
    <dx-text-box v-model:value="item" />
    <dx-button text="Add" @click="add" />
    <h4>List with item template</h4>
    <dx-list :items="listData">
      <template #item="{ data, index }">
        <div>{{ index + 1 }} - <i>{{ data.day }}</i></div>
      </template>
      <template #weekend>
        <b>No templates on weekend</b>
      </template>
    </dx-list>
    <br />
    <h4>List with static items</h4>
    <dx-list>
      <dx-item>1</dx-item>
      <dx-item>2</dx-item>
      <dx-item>
        <template>3 - <i>third</i></template>
      </dx-item>
    </dx-list>
    <h4>List with several templates</h4>
    <dx-list
    itemTemplate="weekday"
    :items="listData"
    >
      <template #weekday="{ data }">
        <s>{{ data.day }}</s>
      </template>
      <template #weekend="{ data }">
        <b>{{ data.day }}</b>
      </template>
    </dx-list>
    <br />
    <dx-button text="Toggle Weekend" @click="toggleWeekend" />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "../data";
import { DxList, DxItem } from "devextreme-vue/list";
import { DxButton, DxTextBox } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxList,
    DxItem,
    DxTextBox
  },
  data: function () {
    return {
      item: "",
      simpleData: [1, 2, 3, 4],
      listData: orangesByDay
    };
  },
  methods: {
    add() {
      if (this.item) {
        this.simpleData.push(this.item);
        this.item = "";
      }
    },
    toggleWeekend() {
      this.listData[5].disabled = !this.listData[5].disabled;
      this.listData[6].disabled = !this.listData[6].disabled;
    }
  }
};
</script>
