<template>
  <div>
    <img
      v-if="cellData.Task_Assigned_Employee"
      :src="cellData.Task_Assigned_Employee.Picture"
      alt=""
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
  object-fit: contain;
  margin-right: 14px;
  border-radius: 25px;
  border: 1px solid lightgray;
  background-color: #fff;
}
</style>
