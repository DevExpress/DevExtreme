<template>
  <DxSelectBox
    :items="[1, 2, 3, 4, 8]"
    v-model="cardsPerRow"
  />
  <DxCardView
    id="cardview"
    :data-source="employees"
    key-expr="ID"
    width="100%"
    :cards-per-row="cardsPerRow"
  >
    <DxPaging :page-size="8"/>
    <DxPager
      :allowed-page-sizes="[5, 8, 15, 30]"
      :show-info="true"
      :show-navigation-buttons="true"
      :show-page-size-selector="true"
      :visible="true"
    />
    <DxCardCover
      :image-expr="imageExpr"
      alt-expr="'FirstName'"
    />
    <DxColumn
      caption="Full Name"
      :calculate-cell-value="fullName"
    />
    <DxColumn data-field="Prefix"/>
    <DxColumn data-field="Position"/>
    <DxColumn data-field="BirthDate"/>
    <DxColumn data-field="HireDate"/>
    <DxColumn data-field="Address"/>
  </DxCardView>
</template>

<script>
import {
  DxCardView,
  DxPaging,
  DxPager,
  DxColumn,
  DxCardCover,
} from 'devextreme-vue/card-view';
import { DxSelectBox } from 'devextreme-vue';
import { employees } from './data';

export default {
  components: {
    DxCardView,
    DxPaging,
    DxPager,
    DxColumn,
    DxCardCover,
    DxSelectBox,
  },
  data() {
    return {
      employees,
      cardsPerRow: 3,
    };
  },
  methods: {
    fullName(data) {
      return `${data.FirstName} ${data.LastName}`;
    },
    imageExpr(data) {
      return `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;
    },
  },
};
</script>
