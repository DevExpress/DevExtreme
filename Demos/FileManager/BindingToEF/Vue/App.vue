<template>
  <DxFileManager
    :file-system-provider="remoteProvider"
    :allowed-file-extensions="allowedFileExtensions"
    :height="550"
    current-path="Documents/Reports"
  >
    <DxPermissions
      :create="true"
      :copy="true"
      :move="true"
      :delete="true"
      :rename="true"
    />
    <DxItemView>
      <DxDetails>
        <DxColumn data-field="thumbnail"/>
        <DxColumn data-field="name"/>
        <DxColumn
          data-field="dateModified"
          caption="Modified"
        />
        <DxColumn
          data-field="created"
          caption="Created"
          data-type="date"
        />
        <DxColumn
          data-field="modifiedBy"
          caption="Modified By"
          :visible-index="2"
        />
      </DxDetails>
    </DxItemView>
  </DxFileManager>
</template>

<script>
import { DxFileManager, DxPermissions, DxItemView, DxDetails, DxColumn } from 'devextreme-vue/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-db'
});

const allowedFileExtensions = [];

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxItemView,
    DxDetails,
    DxColumn
  },

  data() {
    return {
      remoteProvider,
      allowedFileExtensions
    };
  }
};
</script>
