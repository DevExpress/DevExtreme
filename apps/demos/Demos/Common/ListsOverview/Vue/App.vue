<template>
  <div>
    <div class="left">
      <DxList
        :data-source="dataSource"
        :grouped="true"
        :search-enabled="true"
        :selected-item-keys="[currentHotel.Id]"
        class="list"
        selection-mode="single"
        @selection-changed="listSelectionChanged"
      >
        <template #item="{ data: item }">
          <div>
            <div class="hotel">
              <div class="name">{{ item.Hotel_Name }}</div>
              <div class="address">{{ item.Postal_Code + ', ' + item.Address }}</div>
              <div
                :class="item.Hotel_Class.toLowerCase()"
                class="type"
              />
            </div>
            <div class="price-container">
              <div class="price">{{ currency(item.Price) }}</div>
              <div class="caption">per<br>night</div>
            </div>
          </div>
        </template>
        <template #group="{ data: item }">
          <div class="city">{{ item.key }}</div>
        </template>
      </DxList>
    </div>
    <div class="right">
      <div class="header">
        <div class="name-container">
          <div class="name">{{ currentHotel.Hotel_Name }}</div>
          <div
            :class="currentHotel.Hotel_Class.toLowerCase()"
            class="type"
          />
        </div>
        <div class="price-container">
          <div class="price">{{ currency(currentHotel.Price) }}</div>
          <div class="caption">per<br>night</div>
        </div>
      </div>
      <DxTileView
        :data-source="currentHotel.Images"
        :height="224"
        :base-item-height="100"
        :base-item-width="137"
        :item-margin="12"
        class="tile"
        no-data-text=""
      >
        <template #item="{ data: item }">
          <img
            class="tile-image"
            :alt="item.FileName"
            :src="'../../../../images/hotels/' + item.FileName"
          >
        </template>
      </DxTileView>
      <div class="address">{{ currentHotel.Postal_Code }}, {{ currentHotel.Address }}</div>
      <div class="description">{{ currentHotel.Description }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTileView from 'devextreme-vue/tile-view';
import DxList, { type DxListTypes } from 'devextreme-vue/list';
import { ArrayStore } from 'devextreme-vue/common/data';
import { data } from './data.ts';

const currentHotel = ref(data[0]);

const dataSource = {
  store: new ArrayStore({
    data,
    key: 'Id',
  }),
  group: 'City',
  searchExpr: ['Hotel_Name', 'City', 'Address'],
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const currency = (d: number) => currencyFormatter.format(d);

function listSelectionChanged(e: DxListTypes.SelectionChangedEvent) {
  currentHotel.value = e.addedItems[0];
}
</script>
<style>
.left {
  float: left;
  width: 330px;
  height: 470px;
  padding: 20px;
  background-color: var(--dx-color-options-panel-bg);
  margin-right: 30px;
}

.right {
  overflow: hidden;
}

.left .list .dx-list-group-header {
  font-weight: normal;
  font-size: 18px;
}

.left .list .hotel {
  float: left;
}

.left .list .hotel .name {
  font-weight: bold;
}

.right .header {
  height: 70px;
}

.right .header .name-container {
  float: left;
}

.right .header .name {
  font-size: 30px;
  font-weight: bold;
}

.right .header .price-container {
  padding-top: 27px;
}

.right .name-container .type {
  margin-top: 0;
}

.right .tile {
  margin: 0 -12px;
}

.right .tile-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.right .address {
  padding-top: 30px;
  font-size: 18px;
  opacity: 0.7;
}

.right .description {
  margin: 10px 0;
}

.type {
  margin: 3px 0 5px;
  height: 14px;
  background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2218px%22%20height%3D%2214px%22%20%3E%3Cpolyline%20fill%3D%22%23F05B41%22%20points%3D%227.5%2C0%209.972%2C4.399%2014.999%2C5.348%2011.5%2C9.015%2012.135%2C14%207.5%2C11.866%202.865%2C14%203.5%2C9.015%200.001%2C5.348%205.028%2C4.399%207.5%2C0%20%22%2F%3E%3C%2Fsvg%3E');
  background-size: 18px 14px;
}

.type.gold {
  width: 54px;
}

.type.platinum {
  width: 72px;
}

.type.diamond {
  width: 90px;
}

.price-container {
  float: right;
  padding-top: 13px;
}

.price-container > div {
  display: inline-block;
}

.price-container .price {
  font-size: 25px;
}

.price-container .caption {
  font-size: 11px;
  line-height: 12px;
  padding-left: 6px;
}
</style>
