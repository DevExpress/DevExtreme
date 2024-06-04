The TreeMap component visualizes data as a set of rectangles (tiles). The tile size corresponds to a data point value relative to other data points. 

The TreeMap component works with collections of objects. If objects in your collection have a plain structure, the component visualizes them as tiles. If your data is hierarchical, the TreeMap displays it as a group of nested tiles.

To bind data to the component, assign the collection of objects to the TreeMap's [dataSource](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#dataSource) property. 

Once you assign the data source, specify the [valueField](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#valueField) and [labelField](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#labelField) properties. If you specify these properties, the component can determine the object fields that indicate TreeMap labels and values in the collection. The default values for these properties are `value` and `name`, respectively. This demo uses default values, so there is no need to explicitly specify value and label fields.

You can simulate a [hierarchical data structure](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/HierarchicalDataStructure) with a plain data structure as shown in this demo. To implement this technique, specify the [idField](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#idField) and [parentField](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#parentField) properties. This demo specifies `idField: 'id'` and `parentField: 'parentId'`, respectively.

For example, one group of objects in the demo data appears as follows:

    {
        id: '3',
        name: 'Australia',
    }, {
        id: '3_1',
        parentId: '3',
        value: 4840600,
        name: 'Sydney',
        country: 'Australia',
    }, {
        id: '3_2',
        parentId: '3',
        value: 4440000,
        name: 'Melbourne',
        country: 'Australia',
    },

This group of objects produces a tile with the **Australia** label. The **Australia** tile has two nested tiles labeled **Sydney** and **Melbourne**.

To make the TreeMap more informative, you can specify a [title](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/title/) and implement a [tooltip](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/tooltip/).

