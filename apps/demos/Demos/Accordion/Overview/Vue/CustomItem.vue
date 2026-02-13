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
        <span class="accordion-item-link">
          {{ itemData.Website }}
        </span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type CompanyData } from './data';

defineProps<{
  itemData: CompanyData
}>();
</script>
<style>
.accordion-item-link {
  color: var(--dx-color-link);
  cursor: pointer;
  text-decoration: underline;
}
</style>
