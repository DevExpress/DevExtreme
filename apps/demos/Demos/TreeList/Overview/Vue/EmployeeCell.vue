<template>
  <div>
    <div
      v-if="cellData.Task_Assigned_Employee"
      :style="'background-image:url(' + cellData.Task_Assigned_Employee.Picture + ')'"
      class="img"
    />
    <span
      v-if="cellData.Task_Assigned_Employee"
      class="name"
    >{{ cellData.Task_Assigned_Employee.Name }}</span>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  cellData?: Record<string, any>
}>(), {
  cellData: () => ({} as Record<string, any>),
});
</script>
<style>
.img,
.name {
  display: inline-block;
  vertical-align: middle;
}

.img {
  height: 50px;
  width: 50px;
  margin-right: 14px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 25px;
  border: 1px solid lightgray;
  background-color: #fff;
}
</style>
