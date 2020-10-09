<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Built-in icon</div>
        <div class="dx-field-value">
          <DxButton
            icon="check"
            type="success"
            text="Done"
            @click="doneClick()"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Image icon</div>
        <div class="dx-field-value">
          <DxButton
            icon="../../../../images/icons/weather.png"
            text="Weather"
            @click="weatherClick()"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">External icon</div>
        <div class="dx-field-value">
          <DxButton
            class="send"
            icon="fa fa-envelope-o"
            text="Send"
            @click="sendClick()"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Icon only</div>
        <div class="dx-field-value">
          <DxButton
            icon="plus"
            @click="plusClick()"
          />
          <DxButton
            id="back"
            icon="back"
            @click="backClick()"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">DISABLED</div>
      <div class="dx-field">
        <div class="dx-field-value">
          <DxButton
            :disabled="true"
            icon="check"
            type="success"
            text="Done"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-value">
          <DxButton
            :disabled="true"
            icon="../../../../images/icons/weather.png"
            text="Weather"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-value">
          <DxButton
            :disabled="true"
            class="send"
            icon="fa fa-envelope-o"
            text="Send"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-value">
          <DxButton
            :disabled="true"
            icon="plus"
          />
          <DxButton
            id="back-disabled"
            :disabled="true"
            icon="back"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxButton from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxButton
  },
  methods: {
    weatherClick() {
      notify('The Weather button was clicked');
    },
    doneClick() {
      notify('The Done button was clicked');
    },
    sendClick() {
      notify('The Send button was clicked');
    },
    plusClick() {
      notify('The button was clicked');
    },
    backClick() {
      notify('The button was clicked');
    }
  }
};
</script>
<style scoped>
#back, #back-disabled {
 margin-left: 4px;
}
.dx-viewport:not(.dx-theme-ios7) .dx-fieldset {
    width: 520px;
    margin: 30px auto;
}

.dx-viewport:not(.dx-theme-ios7) .dx-fieldset:first-child {
    margin-top: 120px;
}

.dx-viewport:not(.dx-theme-ios7) .dx-fieldset-header {
    font-size: 16px;
}

.dx-viewport:not(.dx-theme-ios7) .dx-field {
    display: inline-block;
    margin-right: 24px;
}

.dx-viewport:not(.dx-theme-ios7) .dx-field-value:not(.dx-widget) > .dx-button {
    float: none;
}

.dx-viewport:not(.dx-theme-ios7) .dx-field-value:not(.dx-switch):not(.dx-checkbox):not(.dx-button),
.dx-viewport:not(.dx-theme-ios7) .dx-field-label {
    float: none;
    width: 100%;
}

.dx-viewport:not(.dx-theme-ios7) .dx-field-label {
    padding-left: 0;
}

.send .dx-button-content .dx-icon {
    font-size: 18px;
}
</style>
