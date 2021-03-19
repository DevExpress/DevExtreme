<template>
  <div id="app">
      <Button
        text="Click Me!"
        @click="click"
        icon="download"
      >
      </Button>
  </div>
</template>

<script>

import Button from "./artifacts/vue/renovation/ui/button";

export default {
  name: 'App',
  components: {
      Button
  },

  methods: {
      click(){
          alert("Clicked")
      }
  }
}
</script>


<style lang="scss">
@import url(./artifacts/css/dx.light.css);
</style>

