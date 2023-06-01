<template>
  <div>
    <Button text="Click Me!" @click="onClick" />
  </div>
</template>
<script>
import Button from '../../../../../artifacts/vue/renovation/ui/button';

export default {
  components: {
    Button,
  },
  methods: {
      onClick: () => alert('OK')
  },
};
</script>
