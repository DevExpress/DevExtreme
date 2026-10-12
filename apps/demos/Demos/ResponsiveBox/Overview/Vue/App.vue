<template>
  <div id="page">
    <DxResponsiveBox
      :screen-by-width="screen"
      single-column-screen="sm"
    >
      <DxRow :ratio="1"/>
      <DxRow :ratio="2"/>
      <DxRow :ratio="1"/>

      <DxCol :ratio="1"/>
      <DxCol
        :ratio="2"
        screen="lg"
      />
      <DxCol :ratio="1"/>
      <DxItem>
        <DxLocation
          :row="0"
          :col="0"
          :colspan="3"
          screen="lg"
        />
        <DxLocation
          :row="0"
          :col="0"
          :colspan="2"
          screen="sm"
        />
        <div class="header item">
          <p>Header</p>
        </div>
      </DxItem>
      <DxItem>
        <DxLocation
          :row="1"
          :col="1"
          screen="lg"
        />
        <DxLocation
          :row="1"
          :col="0"
          :colspan="2"
          screen="sm"
        />
        <div class="content item">
          <p>Content</p>
        </div>
      </DxItem>
      <DxItem>
        <DxLocation
          :row="1"
          :col="0"
          screen="lg"
        />
        <DxLocation
          :row="2"
          :col="0"
          screen="sm"
        />
        <div class="left-side-bar item">
          <p>Left Bar</p>
        </div>
      </DxItem>
      <DxItem>
        <DxLocation
          :row="1"
          :col="2"
          screen="lg"
        />
        <DxLocation
          :row="2"
          :col="1"
          screen="sm"
        />
        <div class="right-side-bar item">
          <p>Right Bar</p>
        </div>
      </DxItem>
      <DxItem>
        <DxLocation
          :row="2"
          :col="0"
          :colspan="3"
          screen="lg"
        />
        <DxLocation
          :row="3"
          :col="0"
          :colspan="2"
          screen="sm"
        />
        <div class="footer item">
          <p>Footer</p>
        </div>
      </DxItem>
    </DxResponsiveBox>
  </div>

</template>
<script setup lang="ts">
import {
  DxResponsiveBox, DxItem, DxLocation, DxCol, DxRow,
} from 'devextreme-vue/responsive-box';

const screen = ((width: number) => ((width < 700) ? 'sm' : 'lg')) as unknown as () => void;
</script>
<style>
.demo-container,
#app,
#page {
  height: 100%;
  min-height: 300px;
}

.header {
  background-color: #C6B1DE;
  text-align: center;
}

.content {
  background-color: #EDBBE7;
}

.left-side-bar {
  background-color: #F9E2AE;
}

.right-side-bar {
  background-color: #9FD89F;
}

.footer {
  background-color: #B4D6FA;
}

.item {
  height: 100%;
}

#page p {
  font-size: 20px;
  padding-top: 10px;
  text-align: center;
  color: #000;
}
</style>
