import ViewDataProvider from 'ui/scheduler/workspaces/view_data_provider';

const { test, module } = QUnit;

module('View Data Provider', {
    beforeEach: function() {
        this.viewDataProvider = new ViewDataProvider();
        this.viewData = {
            groupedData: [{
                groupIndex: 2,
                dateTable: [
                    [
                        { startDate: new Date(2020, 7, 25), endDate: new Date(2020, 7, 26), groups: 'group_2' },
                        { startDate: new Date(2020, 8, 25), endDate: new Date(2020, 8, 26) }
                    ]
                ]
            },
            {
                groupIndex: 3,
                dateTable: [
                    [
                        { startDate: new Date(2020, 7, 27), endDate: new Date(2020, 7, 28), groups: 'group_3' },
                        { startDate: new Date(2020, 8, 27), endDate: new Date(2020, 8, 28) }
                    ]
                ]
            }]
        };

        this.viewDataProvider.viewData = this.viewData;
    }
}, () => {
    module('API', () => {
        test('getStartDate', function(assert) {
            const startDate = this.viewDataProvider.getStartDate();

            assert.deepEqual(startDate, new Date(2020, 7, 25), 'Start date is correct');
        });

        test('getGroupStartDate', function(assert) {
            const group2StartDate = this.viewDataProvider.getGroupStartDate(2);

            assert.deepEqual(group2StartDate, new Date(2020, 7, 25), 'Group 2 start date is correct');

            const group3StartDate = this.viewDataProvider.getGroupStartDate(3);

            assert.deepEqual(group3StartDate, new Date(2020, 7, 27), 'Group 3 start date is correct');
        });

        test('getGroupEndDate', function(assert) {
            const group2EndDate = this.viewDataProvider.getGroupEndDate(2);

            assert.deepEqual(group2EndDate, new Date(2020, 8, 26), 'Group 2 end date is correct');

            const group3EndDate = this.viewDataProvider.getGroupEndDate(3);

            assert.deepEqual(group3EndDate, new Date(2020, 8, 28), 'Group 3 end date is correct');
        });

        test('getGroupInfo', function(assert) {
            const group2Info = this.viewDataProvider.getGroupInfo(2);

            assert.deepEqual(group2Info, 'group_2', 'Group 2 info is correct');

            const group3Info = this.viewDataProvider.getGroupInfo(3);

            assert.deepEqual(group3Info, 'group_3', 'Group 3 info is correct');
        });

        test('getCellData', function(assert) {
            this.viewDataProvider._updateViewDataMap();

            const cellData_0_1 = this.viewDataProvider.getCellData(0, 1);
            const expectedCellData_0_1 = { startDate: new Date(2020, 8, 25), endDate: new Date(2020, 8, 26) };
            assert.deepEqual(cellData_0_1, expectedCellData_0_1, 'Cell data [0, 1] is correct');

            const cellData_1_1 = this.viewDataProvider.getCellData(1, 1);
            const expectedCellData_1_1 = { startDate: new Date(2020, 8, 27), endDate: new Date(2020, 8, 28) };
            assert.deepEqual(cellData_1_1, expectedCellData_1_1, 'Cell data [1, 1] is correct');
        });
    });

    module('Generator', () => {
        test('groupedDataMap', function(assert) {
            this.viewDataProvider._updateGroupedDataMap();

            const expectedGroupedDataMap = [
                undefined,
                undefined,
                this.viewData.groupedData[0],
                this.viewData.groupedData[1]
            ];

            assert.deepEqual(
                this.viewDataProvider.groupedDataMap,
                expectedGroupedDataMap,
                'Grouped data is correct'
            );
        });
    });
});
