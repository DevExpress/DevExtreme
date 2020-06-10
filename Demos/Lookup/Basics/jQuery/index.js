$(function(){
    $("#lookup").dxLookup({
        dropDownOptions: {
            showTitle: false
        },
        items: employeesList,
        value: employeesList[0]
    });
    
    $("#lookup-grouped").dxLookup({
        dataSource: new DevExpress.data.DataSource({ 
            store: employeesTasks, 
            key: "ID", 
            group: "Assigned"
        }),
        dropDownOptions: {
            closeOnOutsideClick: true,
            showTitle: false
        },
        grouped: true,
        displayExpr: "Subject"
    });
});