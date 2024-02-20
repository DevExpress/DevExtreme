<template>
  <div class="dx-fieldset form">

    <div class="dx-field">

      <div class="dx-field-label">Default mode</div>

      <div class="dx-field-value-static">
        <p>
          <span id="subject1">Google AdWords Strategy</span>
          (<a
            id="link1"
          >details</a>)
        </p>

        <DxPopover
          :width="300"
          target="#link1"
          show-event="mouseenter"
          hide-event="mouseleave"
          position="top"
        >
          Make final decision on whether we are going to
          increase our Google AdWord spend based
          on our 2013 marketing plan.
        </DxPopover>
      </div>
    </div>

    <div class="dx-field">

      <div class="dx-field-label">With title</div>

      <div class="dx-field-value-static">
        <p>
          <span id="subject2">Rollout of New Website and Marketing Brochures</span>
          (<a
            id="link2"
          >details</a>)
        </p>

        <DxPopover
          :width="300"
          :show-title="true"
          target="#link2"
          show-event="mouseenter"
          hide-event="mouseleave"
          position="top"
          title="Details"
        >
          The designs for new brochures and
          website have been approved.
          Launch date is set for Feb 28.
        </DxPopover>
      </div>
    </div>

    <div class="dx-field">

      <div class="dx-field-label">With animation</div>

      <div class="dx-field-value-static">
        <p>
          <span id="subject3">Create 2012 Sales Report</span>
          (<a
            id="link3"
          >details</a>)
        </p>

        <DxPopover
          :width="300"
          :animation="animationConfig"
          target="#link3"
          show-event="mouseenter"
          hide-event="mouseleave"
          position="top"
        >
          2012 Sales Report has to be completed
          so we can determine if major changes
          are required to sales strategy.
        </DxPopover>
      </div>
    </div>

    <div class="dx-field">

      <div class="dx-field-label">With overlay</div>

      <div class="dx-field-value-static">
        <p>
          <span id="subject4">Website Re-Design Plan</span>
          (<a
            id="link4"
          >more</a>)
        </p>

        <DxPopover
          :width="300"
          :shading="true"
          target="#link4"
          show-event="click"
          position="top"
          shading-color="rgba(0, 0, 0, 0.5)"
        >
          The changes in our brochure designs for 2013 require
          us to update key areas of our website.
        </DxPopover>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DxPopover } from 'devextreme-vue/popover';

const animationConfig = {
  show: {
    type: 'pop',
    from: {
      scale: 0,
    },
    to: {
      scale: 1,
    },
  },
  hide: {
    type: 'fade',
    from: 1,
    to: 0,
  },
};
</script>
<style>
.form a {
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 1px dashed;
  text-decoration: none;
}

.form p {
  margin: 0;
}

#link4 {
  border-bottom-style: solid;
}
</style>

