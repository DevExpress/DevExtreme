<template>
  <div>
    <div class="widget-container">
      <DxGallery
        id="gallery"
        :data-source="dataSource"
        :loop="loop"
        :slideshow-delay="slideshowDelay"
        :show-nav-buttons="showNavButtons"
        :show-indicator="showIndicator"
        :height="300"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="loop"
          text="Loop mode"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="true"
          text="Slide show"
          @value-changed="setSlideshowDelay"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showNavButtons"
          text="Navigation buttons"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showIndicator"
          text="Indicator"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxCheckBox from 'devextreme-vue/check-box';
import DxGallery from 'devextreme-vue/gallery';
import { gallery } from './data.js';

export default {
  components: {
    DxCheckBox,
    DxGallery
  },
  data() {
    return {
      dataSource: gallery,
      loop: true,
      slideshowDelay: 2000,
      showNavButtons: true,
      showIndicator: true
    };
  },
  methods: {
    setSlideshowDelay(e) {
      this.slideshowDelay = e.value ? 2000 : 0;
    }
  }
};
</script>

