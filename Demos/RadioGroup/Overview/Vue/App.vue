<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxRadioGroup
            :items="priorities"
            :value="priorities[0]"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxRadioGroup
            :items="priorities"
            :value="priorities[1]"
            :disabled="true"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Horizontal layout</div>
        <div class="dx-field-value">
          <DxRadioGroup
            :items="priorities"
            :value="priorities[0]"
            layout="horizontal"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom item template</div>
        <div class="dx-field-value">
          <div id="radio-group-with-template">
            <div :class="colorPriority.toLowerCase()">
              <DxRadioGroup
                :items="priorities"
                v-model:value="colorPriority"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Event handling</div>
        <div class="dx-field-value">
          <div id="radio-group-with-selection">
            <DxRadioGroup
              :items="priorities"
              :value="selectionPriority"
              @valueChanged="changeSelectionPriority"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="tasks-list">
      Tasks by selected priority:
      <ul id="list">
        <li
          v-for="task in selectedTasks"
          :key="task.id"
        >{{ task.subject }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import DxRadioGroup from 'devextreme-vue/radio-group';
import { priorities, tasks } from './data.js';

export default {
  components: {
    DxRadioGroup
  },
  data() {
    return {
      priorities,
      tasks,
      colorPriority: priorities[2],
      selectionPriority: priorities[0]
    };
  },
  computed: {
    selectedTasks() {
      return tasks.filter(task => task.priority == this.selectionPriority);
    }
  },
  methods: {
    changeSelectionPriority(e) {
      this.selectionPriority = e.value;
    }
  }
};
</script>

