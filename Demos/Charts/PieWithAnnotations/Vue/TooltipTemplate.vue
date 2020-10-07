<template>
  <div class="medal-tooltip">
    <div class="country-name">{{ data.country }}
      <br v-if="data.oldCountryName">{{ data.oldCountryName }}
    </div>
    <div>
      <span class="caption">Gold</span>: {{ data.gold }}
    </div>
    <div>
      <span class="caption">Silver</span>: {{ data.silver }}
    </div>
    <div>
      <span class="caption">Bronze</span>: {{ data.bronze }}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    annotation: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      data: this.annotation.data
    };
  }
};
</script>
<style>
.medal-tooltip {
    font-size: 12px;
}

.medal-tooltip .country-name {
    font-size: 14px;
    font-weight: 700;
    margin: 5px 0px 10px 0px;
}

.medal-tooltip .caption {
    font-weight: 600;
}
</style>
