<template>
  <div class="images">
    <div
      v-for="house in houses"
      :key="house.ID"
    >
      <div
        class="item-content"
        @click="showHouse(house)"
      >
        <img :src="house.Image">
        <div class="item-options">
          <div>
            <div class="address">{{ house.Address }}</div>
            <div class="price large-text">{{ currency(house.Price) }}</div>
            <div class="agent">
              <div :id="'house' + house.ID">
                <img src="../../../../images/icon-agent.svg">
                Listing agent
              </div>
            </div>
          </div>
        </div>
        <DxPopover
          :position="position"
          :target="'#house' + house.ID"
          :width="260"
          show-event="mouseenter"
          hide-event="mouseleave"
          content-template="popoverContent"
        >
          <template #popoverContent="{ data }">
            <div class="agent-details">
              <img :src="house.Agent.Picture">
              <div>
                <div class="name large-text">{{ house.Agent.Name }}</div>
                <div class="phone">Tel: {{ house.Agent.Phone }}</div>
              </div>
            </div>
          </template>
        </DxPopover>
      </div>
    </div>

    <DxPopup
      :width="660"
      :height="540"
      :show-title="true"
      :title="currentHouse.Address"
      :drag-enabled="false"
      :close-on-outside-click="true"
      v-model:visible="popupVisible"
    >
      <template #content="{ data }">
        <div class="popup-property-details">
          <div class="large-text">{{ currency(currentHouse.Price) }}</div>
          <div class="opacity">{{ currentHouse.Address }}, {{ currentHouse.City }}, {{ currentHouse.State }}</div>
          <DxButton
            :text="favoriteText"
            :width="210"
            :height="44"
            class="favorites"
            icon="favorites"
            @click="changeFavoriteState"
          />
          <div class="images">
            <img :src="currentHouse.Image">
            <img :src="currentHouse.Image.replace('.jpg', 'b.jpg')">
          </div>
          <div>{{ currentHouse.Features }}</div>
        </div>
      </template>
    </DxPopup>
  </div>

</template>
<script>

import DxButton from 'devextreme-vue/button';
import DxPopup from 'devextreme-vue/popup';
import DxPopover from 'devextreme-vue/popover';

import notify from 'devextreme/ui/notify';

import { housesSource } from './data.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const
  ADD_TO_FAVORITES = 'Add to Favorites',
  REMOVE_FROM_FAVORITES = 'Remove from Favorites';

export default {
  components: {
    DxButton, DxPopup, DxPopover
  },
  data: function() {
    return {
      houses: housesSource,
      currentHouse: housesSource[0],
      popupVisible: false,
      position: {
        offset: '0, 2',
        at: 'bottom',
        my: 'top',
        collision: 'fit flip'
      }
    };
  },
  computed: {
    favoriteText() {
      return this.currentHouse.Favorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES;
    }
  },
  methods: {
    currency(val) {
      return currencyFormatter.format(val);
    },
    showHouse(house) {
      this.currentHouse = house;
      this.popupVisible = true;
    },
    changeFavoriteState() {
      let favoriteState = !this.currentHouse.Favorite;
      let message = `This item has been ${
        favoriteState ? 'added to' : 'removed from'
      } the Favorites list!`;
      this.currentHouse.Favorite = favoriteState;
      notify({
        message: message,
        width: 450
      },
      favoriteState ? 'success' : 'error', 2000
      );
    }
  }
};
</script>
<style src="./styles.css"></style>
