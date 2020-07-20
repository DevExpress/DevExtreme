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
<script>
import { DxDiagram, DxContextMenu, DxContextToolbox, DxPropertiesPanel, DxGroup, DxTab, DxHistoryToolbar, DxViewToolbar, DxMainToolbar, DxCommand, DxToolbox } from 'devextreme-vue/diagram';
import dialog from 'devextreme/ui/dialog';
import 'whatwg-fetch';

export default {
  components: {
    DxDiagram, DxContextMenu, DxContextToolbox, DxPropertiesPanel, DxGroup, DxTab, DxHistoryToolbar, DxViewToolbar, DxMainToolbar, DxCommand, DxToolbox
  },
  mounted() {
    var diagram = this.$refs['diagram'].instance;
    fetch('../../../../data/diagram-flow.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        diagram.import(JSON.stringify(json));
      })
      .catch(function() {
        throw 'Data Loading Error';
      });
  },
  methods: {
    onCustomCommand(e) {
      if(e.name === 'clear') {
        var result = dialog.confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
        result.then(
          function(dialogResult) {
            if(dialogResult) {
              e.component.import('');
            }
          }
        );
      }
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 900px;
    }
</style>
