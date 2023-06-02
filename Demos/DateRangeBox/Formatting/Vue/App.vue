<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Locale-dependent format</div>
        <div class="dx-field-value">
          <DxDateRangeBox
            start-date-placeholder="12/31/2018"
            end-date-placeholder="12/31/2018"
            :show-clear-button="true"
            :use-mask-behavior="true"
            :open-on-field-click="false"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Built-in predefined format</div>
        <div class="dx-field-value">
          <DxDateRangeBox
            display-format="shortdate"
            :start-date="startDate"
            :end-date="endDate"
            :show-clear-button="true"
            :use-mask-behavior="true"
            :open-on-field-click="false"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Locale Data Markup Language (LDML) pattern</div>
        <div class="dx-field-value">
          <DxDateRangeBox
            display-format="EEEE, d of MMM, yyyy"
            :start-date="startDate"
            :end-date="endDate"
            :show-clear-button="true"
            :use-mask-behavior="true"
            :open-on-field-click="false"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Format with literal characters</div>
        <div class="dx-field-value">
          <DxDateRangeBox
            display-format="'Year': yyyy, 'Month': MMM, 'Day': d"
            :start-date="startDate"
            :end-date="endDate"
            :show-clear-button="true"
            :use-mask-behavior="true"
            :open-on-field-click="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxDateRangeBox from 'devextreme-vue/date-range-box';

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();

export default {
  components: {
    DxDateRangeBox,
  },
  data() {
    return {
      startDate: new Date(now.getTime() - msInDay * 3),

      endDate: new Date(now.getTime() + msInDay * 3),
    };
  },
};
</script>
<style>
.dx-fieldset {
  min-height: 500px;
}

.dx-field {
  padding: 8px;
}
</style>
