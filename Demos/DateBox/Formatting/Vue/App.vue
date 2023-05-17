<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Locale-dependent format</div>
        <div class="dx-field-value">
          <DxDateBox
            :show-clear-button="true"
            :use-mask-behavior="true"
            :input-attr="{ 'aria-label': 'Date' }"
            type="datetime"
            placeholder="12/31/2018, 2:52 PM"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Built-in predefined format</div>
        <div class="dx-field-value">
          <DxDateBox
            :show-clear-button="true"
            :use-mask-behavior="true"
            :value="date"
            :input-attr="{ 'aria-label': 'Date' }"
            placeholder="10/16/2018"
            display-format="shortdate"
            type="date"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">LDML pattern</div>
        <div class="dx-field-value">
          <DxDateBox
            :show-clear-button="true"
            :use-mask-behavior="true"
            :input-attr="{ 'aria-label': 'Date' }"
            :value="date"
            placeholder="Tuesday, 16 of Oct, 2018 14:52"
            display-format="EEEE, d of MMM, yyyy HH:mm"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Format with literal characters</div>
        <div class="dx-field-value">
          <DxDateBox
            :show-clear-button="true"
            :use-mask-behavior="true"
            :input-attr="{ 'aria-label': 'Date' }"
            :value="date"
            placeholder="Year: 2018"
            display-format="'Year': yyyy"
            type="date"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxDateBox from 'devextreme-vue/date-box';

export default {
  components: {
    DxDateBox,
  },
  data() {
    return {
      date: new Date(2018, 9, 16, 15, 8, 12),
    };
  },
};
</script>
<style>
.dx-fieldset {
  min-height: 500px;
}
</style>
