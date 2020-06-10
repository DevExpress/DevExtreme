<template>
  <div>
    <div>
      <p>
        <b>{{ itemData.City }}</b>
        (<span>{{ itemData.State }}</span>)
      </p>
      <p>
        <span>{{ itemData.Zipcode }}</span>
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
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
