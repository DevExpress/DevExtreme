<template>
  <DxCardView
    :data-source="employees"
    key-expr="id"
    :search-panel="{ // todo: move to nested
      visible: true,
    }"
  >
    <DxCardCover
      :image-expr="imageExpr"
      :alt-expr="altExpr"
    />
    <DxEditing
      :allowAdding="true"
      :allowUpdating="true"
      :allowDeleting="true"
      :popup="{ // todo: move to nested
        title: 'Employee Info',
        showTitle: true,
        width: 700,
        height: 525,
      }"
      :form="{ // todo: move to nested
        items: [
          {
            caption: 'Personal Data',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['firstName', 'lastName', 'birthDate', 'picture'],
          }, {
            caption: 'Main Info',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['hireDate', 'title', {
              dataField: 'notes',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 100,
              },
            }],
          }, {
            caption: 'Contacts',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: [
              {
                dataField: 'address',
                colSpan: 2,
              }, 'city', 'zipcode', 'mobilePhone', 'email',
            ],
          },
        ],
      }"
    />
    <DxColumn
      caption="Full Name"
      :calculate-field-value="calculateFullName"
    />
    <DxColumn
      data-field="birthDate"
      data-type="date"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="hireDate"
      data-type="date"
    >
      <DxRequiredRule/>
      <DxCustomRule
        message="Hire date cannot be earlier than birth date"
        :validation-callback="hireDateValidationCallback"
      />
    </DxColumn>
    <DxColumn
      caption="Position"
      data-field="title"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn data-field="department"/>
    <DxColumn data-field="address"/>
    <DxColumn data-field="mobilePhone">
      <DxRequiredRule/>
      <DxPatternRule
        message="Your phone must have '(555) 555-5555' format!"
        :pattern="/^\(\d{3}\) \d{3}-\d{4}$/i"
      />
    </DxColumn>
    <DxColumn data-field="email">
      <DxRequiredRule/>
      <DxAsyncRule
        message="Email address is not unique"
        :validation-callback="emailValidationCallback"
      />
    </DxColumn>
    <DxColumn
      data-field="notes"
      :visible="false"
    />
    <DxColumn
      data-field="firstName"
      :visible="false"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="lastName"
      :visible="false"
    >
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      data-field="city"
      :visible="false"
    />
    <DxColumn
      data-field="zipcode"
      :visible="false"
    />
    <DxColumn
      data-field="picture"
      :visible="false"
    />
  </DxCardView>
</template>
<script setup lang="ts">
  import { DxCardView, DxColumn, DxCardCover, DxEditing, DxRequiredRule, DxEmailRule, DxPatternRule, DxAsyncRule, DxCustomRule } from 'devextreme-vue/card-view';
  import { employees, Employee } from './data.ts';

  function altExpr({ fullName }: Employee) {
    return `Photo of ${fullName}`;
  }

  function imageExpr({ picture }: Employee) {
    return picture;
  }

  function calculateFullName({firstName, lastName}: Employee) {
    return `${firstName} ${lastName}`;
  }

  const emailValidationUrl = 'https://js.devexpress.com/Demos/NetCore/RemoteValidation/CheckUniqueEmailAddress';

  async function emailValidationCallback(params) {
    const response = await fetch(emailValidationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;',
      },
      body: JSON.stringify({
        id: params.data.id,
        email: params.value,
      }),
    });

    const result = await response.json();

    return result;
  };

  function hireDateValidationCallback(params) {
    return new Date(params.data.hireDate) > new Date(params.data.birthDate);
  };
</script>
