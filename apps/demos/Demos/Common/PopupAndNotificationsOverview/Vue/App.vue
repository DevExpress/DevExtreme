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
        <img
          :alt="house.Address"
          :src="house.Image"
        >
        <div class="item-options">
          <div>
            <div class="address">{{ house.Address }}</div>
            <div class="price large-text">{{ currency(house.Price) }}</div>
            <div class="agent">
              <div :id="'house' + house.ID">
                <img
                  alt="Listing agent"
                  :src="'../../../../images/icon-agent.svg'"
                >
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
              <img
                :alt="house.Agent.Name"
                :src="house.Agent.Picture"
              >
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
      :hide-on-outside-click="true"
      v-model:visible="popupVisible"
      :show-close-button="true"
    >
      <template #content="{ data }">
        <div class="popup-property-details">
          <div class="large-text">{{ currency(currentHouse.Price) }}</div>
          <div class="opacity">
            {{ currentHouse.Address }},
            {{ currentHouse.City }},
            {{ currentHouse.State }}
          </div>
          <DxButton
            :text="favoriteText"
            :width="260"
            :height="44"
            class="favorites"
            icon="favorites"
            @click="changeFavoriteState"
          />
          <div class="images">
            <img
              :alt="currentHouse.Address"
              :src="currentHouse.Image"
            >
            <img
              :alt="currentHouse.Address"
              :src="currentHouse.Image.replace('.jpg', 'b.jpg')"
            >
          </div>
          <div>{{ currentHouse.Features }}</div>
        </div>
      </template>
    </DxPopup>
  </div>

</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DxButton from 'devextreme-vue/button';
import DxPopup from 'devextreme-vue/popup';
import DxPopover from 'devextreme-vue/popover';
import notify from 'devextreme/ui/notify';
import { housesSource } from './data.ts';

const ADD_TO_FAVORITES = 'Add to Favorites';
const REMOVE_FROM_FAVORITES = 'Remove from Favorites';
const houses = ref<Record<string, any>[]>(housesSource);
const currentHouse = ref<Record<string, any>>(housesSource[0]);
const popupVisible = ref(false);
const position = {
  offset: '0, 2',
  at: 'bottom',
  my: 'top',
  collision: 'fit flip',
};

const favoriteText = computed(
  () => (currentHouse.value.Favorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES),
);

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const currency = (val: number) => currencyFormatter.format(val);

function showHouse(house: Record<string, unknown>) {
  currentHouse.value = house;
  popupVisible.value = true;
}

function changeFavoriteState() {
  const favoriteState = !currentHouse.value.Favorite;
  const message = `This item has been ${
    favoriteState ? 'added to' : 'removed from'
  } the Favorites list!`;
  currentHouse.value.Favorite = favoriteState;
  notify({
    message,
    width: 450,
  },
  favoriteState ? 'success' : 'error',
  2000);
}
</script>
<style>
.large-text {
  font-size: 24px;
  color: var(--dxds-color-content-utility-orange-default-rest, #ff6a50);
}

.opacity {
  opacity: 0.5;
}

.images {
  font-size: 0;
}

.images > div {
  display: inline-block;
  width: 33.3%;
  vertical-align: top;
}

.images .item-content {
  position: relative;
  margin: 5px;
  color: var(--dxds-color-content-neutral-default-on-surface-rest, #fff);
  cursor: pointer;
}

.images .item-content > img {
  width: 100%;
}

.item-content .item-options {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.images .item-content:hover > .item-options {
  box-shadow: inset 0 0 0 2px var(--dxds-color-border-utility-orange-default-rest, #f05b41);
}

.item-content .item-options > div {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 64px;
  padding-top: 4px;
  background-color: color-mix(in srgb, var(--dxds-color-surface-neutral-default-static-dark-rest, rgb(19, 32, 51)) calc(var(--dxds-opacity-80, 0.8) * 100%), transparent);
  z-index: 1;
  box-sizing: border-box;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
}

.images .item-content:hover > .item-options > div {
  border-bottom: 2px solid var(--dxds-color-border-utility-orange-default-rest, #f05b41);
  border-left: 2px solid var(--dxds-color-border-utility-orange-default-rest, #f05b41);
  border-right: 2px solid var(--dxds-color-border-utility-orange-default-rest, #f05b41);
}

.item-content .item-options .address,
.item-content .item-options .price {
  max-width: 70%;
  padding-left: 8px;
}

.item-content .item-options .address {
  font-size: 14px;
}

.item-content .item-options .agent {
  font-size: 12px;
  width: 60px;
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  text-align: center;
  border-left: 1px solid color-mix(in srgb, var(--dxds-color-border-neutral-compound-on-surface-rest, rgb(255, 255, 255)) calc(var(--dxds-opacity-40, 0.4) * 100%), transparent);
  line-height: 13px;
}

.item-content .item-options .agent > div:hover {
  color: var(--dxds-color-border-utility-orange-default-rest, #f05b41);
}

.item-content .item-options .agent img {
  display: block;
  width: 13px;
  height: 16px;
  margin: 8px auto 2px;
}

.agent-details > img,
.agent-details > div {
  display: inline-block;
  vertical-align: top;
  line-height: 26px;
}

.agent-details > img {
  width: 40px;
  margin-right: 10px;
}

.agent-details .phone {
  font-size: 18px;
}

.popup-property-details {
  overflow: hidden;
  position: relative;
}

.popup-property-details .images {
  width: 700px;
}

.popup-property-details img {
  height: 205px;
  margin: 10px 10px 10px 0;
}

.dx-button.favorites {
  background-color: var(--dxds-color-border-utility-orange-default-rest, #f05b41);
  color: var(--dxds-color-content-neutral-default-on-surface-rest, #fff);
  position: absolute;
  top: 5px;
  right: 0;
}

.dx-button.favorites .dx-icon {
  color: var(--dxds-color-content-neutral-default-on-surface-rest, #fff);
}
</style>
