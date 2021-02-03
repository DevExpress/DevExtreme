<template>
  <div>
    <h4 class="example-title">{{ title }}</h4>
    <pre v-if="stateStr">{{ stateStr }}</pre>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    state: Object
  },
  data() {
    return { a: 1 };
  },
  computed: {
    stateStr: function () {
      return JSON.stringify(this.state, null, "  ");
    }
  }
};
</script>

<style scoped>
.example-title {
  background-color: #375a7f;
  color: white;
  padding: 7px 15px;
}
</style>
