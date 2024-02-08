<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    @custom-command="onCustomCommand"
  >
    <DxContextMenu
      :enabled="true"
      :commands="['bringToFront', 'sendToBack' , 'lock' , 'unlock' ]"
    />
    <DxContextToolbox
      :enabled="true"
      :category="'flowchart'"
      :shape-icons-per-row="5"
      :width="200"
    />
    <DxPropertiesPanel
      :visibility="'visible'"
    >
      <DxTab>
        <DxGroup
          :title="'Page Properties'"
          :commands="['pageSize', 'pageOrientation' , 'pageColor' ]"
        />
      </DxTab>
    </DxPropertiesPanel>
    <DxHistoryToolbar
      :visible="false"
    />
    <DxViewToolbar
      :visible="true"
    />
    <DxMainToolbar
      :visible="true"
    >
      <DxCommand
        :name="'undo'"
      />
      <DxCommand
        :name="'redo'"
      />
      <DxCommand
        :name="'separator'"
      />
      <DxCommand
        :name="'fontName'"
      />
      <DxCommand
        :name="'fontSize'"
      />
      <DxCommand
        :name="'separator'"
      />
      <DxCommand
        :name="'bold'"
      />
      <DxCommand
        :name="'italic'"
      />
      <DxCommand
        :name="'underline'"
      />
      <DxCommand
        :name="'separator'"
      />
      <DxCommand
        :name="'fontColor'"
      />
      <DxCommand
        :name="'lineColor'"
      />
      <DxCommand
        :name="'fillColor'"
      />
      <DxCommand
        :name="'separator'"
      />
      <DxCommand
        :name="'clear'"
        :icon="'clearsquare'"
        :text="'Clear Diagram'"
      />
    </DxMainToolbar>
    <DxToolbox
      :visibility="'visible'"
      :show-search="false"
      :shape-icons-per-row="4"
      :width="220"
    >
      <DxGroup
        :category="'general'"
        :title="'General'"
      />
      <DxGroup
        :category="'flowchart'"
        :title="'Flowchart'"
        :expanded="true"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';
import {
  DxDiagram,
  DxContextMenu,
  DxContextToolbox,
  DxPropertiesPanel,
  DxGroup,
  DxTab,
  DxHistoryToolbar,
  DxViewToolbar,
  DxMainToolbar,
  DxCommand,
  DxToolbox,
} from 'devextreme-vue/diagram';
import { confirm } from 'devextreme/ui/dialog';
import 'whatwg-fetch';

const diagram = ref();

watch(diagram,
  ({ instance }) => {
    fetch('../../../../data/diagram-flow.json')
      .then((response) => response.json())
      .then((json) => {
        instance.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  });

function onCustomCommand(e) {
  if (e.name === 'clear') {
    const result = confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
    result.then(
      (dialogResult) => {
        if (dialogResult) {
          e.component.import('');
        }
      },
    );
  }
}
</script>
<style scoped>
    #diagram {
      height: 900px;
    }
</style>
