module.exports = [{
    caption: 'Company Name',
    dataField: 'CompanyName',
    dataType: 'string',
    format: undefined,
    filterOperations: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>'],
    defaultFilterOperation: '',
    lookup: {
        dataSource: [{
            value: 'K&S Music',
            text: 'K&S Music'
        }, {
            value: 'Super Mart of the West',
            text: 'Super Mart of the West'
        }],
        valueExpr: 'value',
        displayExpr: 'text'
    }
}, {
    caption: 'Date',
    dataField: 'Date',
    dataType: 'date',
    format: 'shortDate',
    filterOperations: ['=', '<>', '<', '>', '<=', '>='],
    defaultFilterOperation: ''
}, {
    caption: 'State',
    dataField: 'State',
    dataType: 'string',
    format: undefined,
    filterOperations: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>', 'isblank', 'isnotblank'],
    defaultFilterOperation: ''
},
{
    caption: 'Zipcode',
    dataField: 'Zipcode',
    dataType: 'number',
    format: undefined,
    filterOperations: ['=', '<>', '<', '>', '<=', '>='],
    defaultFilterOperation: '='
},
{
    caption: 'Contributor',
    dataField: 'Contributor',
    dataType: 'boolean',
    format: undefined,
    defaultFilterOperation: ''
},
{
    caption: 'City',
    dataField: 'City',
    dataType: 'string',
    format: undefined,
    filterOperations: ['=', '<>'],
    defaultFilterOperation: ''
},
{
    caption: 'Caption of Object Field',
    dataField: 'ObjectField',
    dataType: 'object',
    filterOperations: ['isblank', 'isnotblank'],
    defaultFilterOperation: ''
},
{
    caption: 'DateTime',
    dataField: 'DateTime',
    dataType: 'datetime',
    format: 'shortDate',
    filterOperations: ['=', '<>', '<', '>', '<=', '>='],
    defaultFilterOperation: ''
},
{
    caption: 'Product',
    dataField: 'Product',
    dataType: 'number',
    filterOperations: ['=', '<>'],
    lookup: {
        dataSource: [{
            value: 1,
            text: 'DataGrid'
        }, {
            value: 2,
            text: 'PivotGrid'
        }, {
            value: 3,
            text: 'TreeList'
        }],
        valueExpr: 'value',
        displayExpr: 'text'
    }
},
{
    caption: 'Number Field',
    dataField: 'NumberField',
    dataType: 'number'
}];
