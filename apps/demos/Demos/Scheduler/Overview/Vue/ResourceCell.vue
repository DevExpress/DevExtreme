<template>
  <div>
    <div
      :style="'background:' + employee.color"
      class="name"
    >
      <h2>{{ employee.text }}</h2>
    </div>
    <div class="avatar" :title="employee.text">
      <img :src="employee.data.avatar" :alt="`${employee.text} photo`">
    </div>
    <div
      :style="'color:' + employee.color"
      class="info"
    >
      Age: {{ employee.data.age }}
      <br>
      <b>{{ employee.data.discipline }}</b>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  employee?: any
}>(), {
  employee: () => {},
});
</script>
<style>
.avatar {
  width: 124px;
  float: left;
  overflow: hidden;
  position: relative;
  height: 124px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
}

.avatar[title="John Heart"] img {
  position: relative;
  width: 126px;
  height: 130px;
  object-fit: contain;
  top: 5px;
  left: 3px;
}

.avatar[title="Sandra Johnson"] img {
  position: relative;
  width: 126px;
  height: 130px;
  object-fit: contain;
  top: 5px;
  left: 3px;
}

.name {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.name h2 {
  color: #fff;
  font-size: 28px;
  text-align: left;
  padding: 0 0 5px 175px;
  margin: 0;
}

.info {
  width: auto;
  text-align: left;
  height: 100%;
  font-size: 11pt;
  font-weight: normal;
  padding: 25px 20px;
  color: #707070;
}

.dx-color-scheme-contrast .info {
  color: #fff;
}
</style>
