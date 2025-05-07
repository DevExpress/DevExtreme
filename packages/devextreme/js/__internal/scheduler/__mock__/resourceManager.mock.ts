import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { ResourceManager } from '../utils/resource_manager/resource_manager';

export const resourceItemsByIdMock = {
  'nested.priorityId': [
    { id: 1, text: 'Low Priority', color: '#1e90ff' },
    { id: 2, text: 'High Priority', color: '#ff9747' },
  ],
  assigneeId: [
    { guid: 1, name: 'Samantha Bright', mainColor: '#727bd2' },
    { guid: 2, name: 'John Heart', mainColor: '#32c9ed' },
    { guid: 3, name: 'Todd Hoffman', mainColor: '#2a7ee4' },
    { guid: 4, name: 'Sandra Johnson', mainColor: '#7b49d3' },
  ],
  roomId: [
    { id: 0, text: 'Room 1', color: '#aaa' },
    { id: 1, text: 'Room 2', color: '#ccc' },
    { id: 2, text: 'Room 3', color: '#777' },
  ],
};

export const resourceIndexesMock = Object.keys(resourceItemsByIdMock);

export const resourceConfigMock = [{
  allowMultiple: false,
  dataSource: resourceItemsByIdMock['nested.priorityId'],
  fieldExpr: 'nested.priorityId',
  displayExpr: 'text',
  label: 'Priority',
}, {
  fieldExpr: 'assigneeId',
  allowMultiple: true,
  dataSource: new DataSource({
    store: new CustomStore({
      load: (): object[] => resourceItemsByIdMock.assigneeId,
    }),
    paginate: false,
  }),
  valueExpr: 'guid', // Resource instance's field used instead of "id"
  colorExpr: 'mainColor', // Resource instance's field used instead of "color"
  displayExpr: 'name', // Resource instance's field used instead of "text"
  label: 'Assignee',
}, {
  field: 'roomId',
  dataSource: resourceItemsByIdMock.roomId,
  label: 'Room',
}];

export const getResourceManagerMock = (): ResourceManager => new ResourceManager(
  resourceConfigMock.map((item) => ({ ...item })),
);
