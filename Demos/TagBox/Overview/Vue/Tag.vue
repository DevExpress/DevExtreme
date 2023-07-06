<template>
  <div>
    <div
      ref="target"
      :class="{'dx-tag-content': true, 'disabled-tag': isDisabled}"
      :aria-disabled="isDisabled"
      @mouseenter="show = true"
      @mouseleave="show = false"
    >
      <img
        :src="tagData.ImageSrc"
        class="tag-img"
      >
      <span>{{ tagData.Name }}</span>
      <div
        v-if="!isDisabled"
        class="dx-tag-remove-button"
      />
    </div>

    <DxPopover
      :visible="show"
      :target="target"
    >
      <p>
        <b>Name: </b><span>{{ tagData.Name }}</span>
      </p>
      <p>
        <b>Price: </b><span>{{ tagData.Price }}</span>
      </p>
      <p>
        <b>In-stock: </b><span>{{ tagData.Current_Inventory }}</span>
      </p>
      <p>
        <b>Category: </b><span>{{ tagData.Category }}</span>
      </p>
    </DxPopover>
  </div>
</template>
<script>
import { ref } from 'vue';
import DxPopover from 'devextreme-vue/popover';

export default {
  components: {
    DxPopover,
  },
  props: {
    tagData: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const target = ref(null);

    return {
      target,
    };
  },
  data() {
    return {
      isDisabled: this.tagData.Name === 'SuperHD Video Player',
      show: false,
    };
  },
};
</script>
<style scoped>
.dx-tag-content {
  display: flex;
  align-items: center;
}

.tag-img {
  height: 30px;
  margin-right: 5px;
}

.dx-tag-content.disabled-tag {
  padding-right: 6px;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
