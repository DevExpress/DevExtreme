<template>
  <svg class="template">
    <text
      class="template-name"
      x="50%"
      y="20%"
    >
      {{ employee.Full_Name }}
    </text>
    <text
      class="template-title"
      x="50%"
      y="45%"
    >
      {{ employee.Title }}
    </text>
    <text
      class="template-button"
      x="50%"
      y="85%"
      @click="showEmployeeInfo"
    >
      Show Details
    </text>
  </svg>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
  employee: Record<string, any>
  showInfo: Function
}>(), {
  employee: () => ({}),
  showInfo: () => ({}),
});
function showEmployeeInfo() {
  props.showInfo(props.employee);
}
</script>

<style>
    #diagram .template .template-name {
      font-weight: bold;
      text-decoration: underline;
    }

    #diagram .template .template-title {
      font-style: italic;
    }

    #diagram .template .template-button {
      cursor: pointer;
      font-size: 8pt;
      fill: navy;
    }

    #diagram .template .template-button:hover {
      text-decoration: underline;
    }
</style>
