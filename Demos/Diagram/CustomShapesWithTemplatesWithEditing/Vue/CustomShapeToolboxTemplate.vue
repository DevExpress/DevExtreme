<template>
  <svg class="template">
    <text
      class="template-name"
      x="50%"
      y="40%"
    >
      New
    </text>
    <text
      class="template-title"
      x="50%"
      y="70%"
    >
      Employee
    </text>
  </svg>
</template>

<script>
export default {
  props: {
  },
  methods: {
  }
};
</script>

<style>
    #diagram .template .template-name {
        font-weight: bold;
        text-decoration: underline;
    }

    #diagram .template .template-title {
        font-style: italic;
    }
</style>
