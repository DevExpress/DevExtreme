<template>
  <example-block title="dxMenu">
    <h4>Menu with simple items</h4>
    <dx-menu>
      <dx-item text="Item 1" icon="user">
        <dx-item text="Item 1-1" />
        <dx-item text="Item 1-2" />
        <dx-item text="Item 1-3" icon="edit">
          <dx-item text="Item 1-3-1" />
        </dx-item>
        <dx-item>
          <div>Inline template</div>
          <dx-item text="Item 1-4-1" />
        </dx-item>
      </dx-item>
      <dx-item text="Item 2" />
      <dx-item text="Item 3" />
    </dx-menu>
    <h4>Menu with static item templates</h4>
    <dx-menu>
      <dx-item>
        Item 1
        <dx-item> Item 1-1 </dx-item>
        <dx-item> Item 1-2 </dx-item>
        <dx-item>
          Item 1-3
          <dx-item> Item 1-3-1 </dx-item>
        </dx-item>
      </dx-item>
      <dx-item>
        <template>Item 2</template>
      </dx-item>
      <dx-item>
        <template>Item 3</template>
      </dx-item>
    </dx-menu>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxMenu, DxItem } from "devextreme-vue/menu";

export default {
  components: {
    ExampleBlock,
    DxMenu,
    DxItem
  }
};
</script>
