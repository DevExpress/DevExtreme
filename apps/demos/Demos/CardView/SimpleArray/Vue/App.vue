<template>
  <DxCardView 
    id="cardview"
    :data-source="employees"
    key-expr="ID"
  >
    <DxColumn 
      v-for="column in columns" 
      :key="column.dataField" 
      :data-field="column.dataField" 
    />
    
    <DxCardCover
      :image-expr="imageExpr"
      alt-expr="'FirstName'"
    />
  </DxCardView>
</template>

<script>
import { defineComponent } from "vue";
import { DxCardView, DxColumn, DxCardCover } from "devextreme-vue/card-view";
import { employees } from "./data";

export default defineComponent({
  components: {
    DxCardView,
    DxColumn,
    DxCardCover,
  },
  data() {
    return {
      employees,
      columns: ['ID', 'FirstName', 'LastName', 'Prefix', 'Position', 'Picture', 'BirthDate', 'HireDate', 'Address']
    };
  },
  methods: {
    imageExpr(data) {
      return `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/${data.Picture}`;
    },
  },
});
</script>
