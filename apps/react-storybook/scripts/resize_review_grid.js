export default function renderResizeReview(DataGrid) {
    const scenario = new URLSearchParams(window.location.search).get('scenario');
    const rtlEnabled = false;
    let scrollInitialized = false;
    
    new DataGrid(document.getElementById('grid'), {
        dataSource: [
            { ID: 1, CompanyName: 'Super Mart of the West', City: 'Bentonville', State: 'Arkansas', Phone: '(800) 555-2797', Fax: '(800) 555-2171' },
            { ID: 2, CompanyName: 'Electronics Depot', City: 'Atlanta', State: 'Georgia', Phone: '(800) 595-3232', Fax: '(800) 595-3231' },
            { ID: 3, CompanyName: 'K&S Music', City: 'Minneapolis', State: 'Minnesota', Phone: '(612) 304-6073', Fax: '(612) 304-6074' },
            { ID: 4, CompanyName: "Tom's Club", City: 'Issaquah', State: 'Washington', Phone: '(800) 955-2292', Fax: '(800) 955-2293' },
            { ID: 5, CompanyName: 'E-Mart', City: 'Hoffman Estates', State: 'Illinois', Phone: '(847) 286-2500', Fax: '(847) 286-2501' },
            { ID: 6, CompanyName: 'Walters', City: 'Deerfield', State: 'Illinois', Phone: '(847) 940-2500', Fax: '(847) 940-2501' },
        ],
        keyExpr: 'ID',
        columns: [
            'CompanyName', 'City', 'State',
            { dataField: 'Phone', fixed: scenario === 'widget', fixedPosition: 'right' },
            { dataField: 'Fax', fixed: true, fixedPosition: 'right' },
        ],
        columnResizingMode: scenario === 'fixed' ? 'nextColumn' : 'widget',
        allowColumnResizing: true,
        columnWidth: 'auto',
        rtlEnabled,
        showBorders: true,
        width: 500,
        height: 300,
        onContentReady(e) {
            if (!scrollInitialized) {
                scrollInitialized = true;
                e.component.getScrollable().scrollTo({ left: 50 });
            }
        },
    });
}
