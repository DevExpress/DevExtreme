import { getGroupPanelData } from '../utils';

describe('GroupPanel utils', () => {
  describe('getGroupPanelData', () => {
    const groupsBase = [{
      name: 'group 1',
      items: [{
        text: 'item 1', id: 1, color: 'color 1',
      }, {
        text: 'item 2', id: 2, color: 'color 2',
      }],
      data: [{
        text: 'item 1', id: 1, color: 'color 1',
      }, {
        text: 'item 2', id: 2, color: 'color 2',
      }],
    }, {
      name: 'group 2',
      items: [{
        text: 'item 3', id: 1, color: 'color 3',
      }, {
        text: 'item 4', id: 2, color: 'color 4',
      }],
      data: [{
        text: 'item 3', id: 1, color: 'color 3',
      }, {
        text: 'item 4', id: 2, color: 'color 4',
      }],
    }];

    it('should transform grouping data into group items', () => {
      const groupPanelData = getGroupPanelData(groupsBase, 1, false, 3);

      expect(groupPanelData)
        .toEqual({
          groupPanelItems: [[{
            ...groupsBase[0].items[0],
            data: groupsBase[0].data[0],
            resourceName: groupsBase[0].name,
            key: '0_group 1_1',
          }, {
            ...groupsBase[0].items[1],
            data: groupsBase[0].data[1],
            resourceName: groupsBase[0].name,
            key: '0_group 1_2',
          }], [{
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '0_group 2_1',
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '0_group 2_2',
          }, {
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '1_group 2_1',
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '1_group 2_2',
          }]],
          baseColSpan: 3,
        });
    });

    it('should work when data parameter is undefined', () => {
      const groups = [{
        name: 'group 1',
        items: [{
          text: 'item 1', id: 1, color: 'color 1',
        }, {
          text: 'item 2', id: 2, color: 'color 2',
        }],
      }] as any;
      const groupPanelData = getGroupPanelData(groups, 1, false, 5);

      expect(groupPanelData)
        .toEqual({
          groupPanelItems: [[{
            ...groups[0].items[0],
            resourceName: groups[0].name,
            key: '0_group 1_1',
          }, {
            ...groups[0].items[1],
            resourceName: groups[0].name,
            key: '0_group 1_2',
          }]],
          baseColSpan: 5,
        });
    });

    it('should transform grouping data into group items corectly when appointments are groupped by date', () => {
      const groupPanelData = getGroupPanelData(groupsBase, 2, true, 7);

      expect(groupPanelData)
        .toEqual({
          groupPanelItems: [[{
            ...groupsBase[0].items[0],
            data: groupsBase[0].data[0],
            resourceName: groupsBase[0].name,
            key: '0_group 1_1_group_by_date_0',
            isFirstGroupCell: true,
            isLastGroupCell: false,
          }, {
            ...groupsBase[0].items[1],
            data: groupsBase[0].data[1],
            resourceName: groupsBase[0].name,
            key: '0_group 1_2_group_by_date_0',
            isFirstGroupCell: false,
            isLastGroupCell: true,
          }, {
            ...groupsBase[0].items[0],
            data: groupsBase[0].data[0],
            resourceName: groupsBase[0].name,
            key: '0_group 1_1_group_by_date_1',
            isFirstGroupCell: true,
            isLastGroupCell: false,
          }, {
            ...groupsBase[0].items[1],
            data: groupsBase[0].data[1],
            resourceName: groupsBase[0].name,
            key: '0_group 1_2_group_by_date_1',
            isFirstGroupCell: false,
            isLastGroupCell: true,
          }], [{
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '0_group 2_1_group_by_date_0',
            isFirstGroupCell: true,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '0_group 2_2_group_by_date_0',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '1_group 2_1_group_by_date_0',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '1_group 2_2_group_by_date_0',
            isFirstGroupCell: false,
            isLastGroupCell: true,
          }, {
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '0_group 2_1_group_by_date_1',
            isFirstGroupCell: true,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '0_group 2_2_group_by_date_1',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[0],
            data: groupsBase[1].data[0],
            resourceName: groupsBase[1].name,
            key: '1_group 2_1_group_by_date_1',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }, {
            ...groupsBase[1].items[1],
            data: groupsBase[1].data[1],
            resourceName: groupsBase[1].name,
            key: '1_group 2_2_group_by_date_1',
            isFirstGroupCell: false,
            isLastGroupCell: true,
          }]],
          baseColSpan: 7,
        });
    });
  });
});
