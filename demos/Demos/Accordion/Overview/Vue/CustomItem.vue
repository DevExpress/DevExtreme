<template>
  <div>
    <div>
      <p>
        <b>{{ itemData.City }}</b>
        (<span>{{ itemData.State }}</span>)
      </p>
      <p>
        <span>{{ itemData.Zipcode }}&nbsp;</span>
        <span>{{ itemData.Address }}</span>
      </p>
    </div>
    <div>
      <p>
        Phone: <b>{{ itemData.Phone }}</b>
      </p>
      <p>
        Fax: <b>{{ itemData.Fax }}</b>
      </p>
      <p>
        Website:
        <a
          :href="itemData.Website"
          target="_blank"
        >
          {{ itemData.Website }}
        </a>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: Record<string, any>
}>(), {
  itemData: () => ({}),
});
</script>
