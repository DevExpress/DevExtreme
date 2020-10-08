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
          <div
            :style="{ 'background-image': 'url(../../../../images/hotels/' + item.FileName + ')' }"
            class="tile-image"
          />
        </template>
      </DxTileView>
      <div class="address">{{ currentHotel.Postal_Code }}, {{ currentHotel.Address }}</div>
      <div class="description">{{ currentHotel.Description }}</div>
    </div>
  </div>
</template>
<script>

import DxTileView from 'devextreme-vue/tile-view';
import DxList from 'devextreme-vue/list';
import ArrayStore from 'devextreme/data/array_store';
import { data } from './data.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export default {
  components: {
    DxTileView, DxList
  },
  data: function() {
    return {
      currentHotel: data[0],
      dataSource: {
        store: new ArrayStore({
          data: data,
          key: 'Id'
        }),
        group: 'City',
        searchExpr: ['Hotel_Name', 'City', 'Address']
      }
    };
  },
  methods: {
    currency(data) {
      return currencyFormatter.format(data);
    },
    listSelectionChanged(e) {
      this.currentHotel = e.addedItems[0];
    }
  }
};
</script>
<style src="./styles.css"></style>
