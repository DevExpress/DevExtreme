<template>
  <div>
    <DxBox
      :height="75"
      direction="row"
      width="100%"
    >
      <DxItem
        :ratio="1"
      >
        <template #default>
          <div class="rect demo-dark">ratio = 1</div>
        </template>
      </DxItem>
      <DxItem
        :ratio="2"
      >
        <template #default>
          <div class="rect demo-light">ratio = 2</div>
        </template>
      </DxItem>
      <DxItem
        :ratio="1"
      >
        <template #default>
          <div class="rect demo-dark">ratio = 1</div>
        </template>
      </DxItem>
    </DxBox>
    <br>
    <DxBox
      :height="75"
      direction="row"
      width="100%"
    >
      <DxItem
        :ratio="0"
        :base-size="150"
      >
        <template #default>
          <div class="rect demo-dark">150px</div>
        </template>
      </DxItem>
      <DxItem :ratio="1">
        <DxBox
          :height="75"
          class="demo-light"
          direction="row"
          width="100%"
          align="center"
          cross-align="center"
        >
          <DxItem
            :ratio="0"
            :base-size="50"
          >
            <template #default>
              <div>
                <div class="small"/>
              </div>
            </template>
          </DxItem>
          <DxItem
            :ratio="0"
            :base-size="50"
          >
            <template #default>
              <div>
                <div class="small"/>
              </div>
            </template>
          </DxItem>
          <DxItem
            :ratio="0"
            :base-size="50"
          >
            <template #default>
              <div>
                <div class="small"/>
              </div>
            </template>
          </DxItem>
        </DxBox>
      </DxItem>
      <DxItem
        :ratio="0"
        base-size="10%"
      >
        <template #default>
          <div class="rect demo-dark">10%</div>
        </template>
      </DxItem>
    </DxBox>
    <br>
    <DxBox
      :height="250"
      direction="col"
      width="100%"
    >
      <DxItem
        :ratio="1"
      >
        <template #default>
          <div class="rect demo-dark header">Header</div>
        </template>
      </DxItem>
      <DxItem
        :ratio="2"
        :base-size="0"
      >
        <DxBox
          :height="125"
          direction="row"
          width="100%"
        >
          <DxItem :ratio="1">
            <template #default>
              <div class="rect demo-dark">Left Bar</div>
            </template>
          </DxItem>
          <DxItem :ratio="1">
            <template #default>
              <div class="rect demo-light">Content</div>
            </template>
          </DxItem>
          <DxItem :ratio="1">
            <template #default>
              <div class="rect demo-dark">Right Bar</div>
            </template>
          </DxItem>
        </DxBox>
      </DxItem>
      <DxItem :ratio="1">
        <template #default>
          <div class="rect demo-dark footer">Footer</div>
        </template>
      </DxItem>
    </DxBox>
  </div>
</template>
<script>
import { DxBox, DxItem } from 'devextreme-vue/box';

export default {
  components: {
    DxBox,
    DxItem
  }
};
</script>
<style>
.rect {
    text-align: center;
    font-size: 30px;
    padding-top: 10px;
    height: 100%;
}

.demo-light {
    background: rgba(245, 229, 166, 0.5)
}

.demo-dark {
    background: rgba(148, 215, 199, 0.5);
}

.demo-dark.header {
    background: rgba(243, 158, 108, 0.5);
}

.demo-dark.footer {
    background: rgba(123, 155, 207, 0.5);
}

.small {
    height: 50px;
    border: 1px solid lightgray;
}

</style>
