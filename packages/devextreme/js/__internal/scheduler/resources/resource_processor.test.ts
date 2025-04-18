import { describe, expect, it } from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { ResourceProcessor } from './resource_processor';

const rooms = [{
  text: 'Room 1',
  id: 1,
  color: '#00af2c',
}, {
  text: 'Room 2',
  id: 2,
  color: '#56ca85',
}, {
  text: 'Room 3',
  id: 3,
  color: '#8ecd3c',
}];

const roomResource = {
  fieldExpr: 'roomId',
  dataSource: rooms,
  label: 'Room',
};

const owners = [{
  text: 'Samantha Bright',
  id: 1,
  color: '#727bd2',
}, {
  text: 'John Heart',
  id: 2,
  color: '#32c9ed',
}, {
  text: 'Todd Hoffman',
  id: 3,
  color: '#2a7ee4',
}, {
  text: 'Sandra Johnson',
  id: 4,
  color: '#7b49d3',
}];

const ownerResource = {
  fieldExpr: 'ownerId',
  allowMultiple: true,
  dataSource: owners,
  label: 'Owner',
};

const appointment = {
  text: 'Website Re-Design Plan',
  startDate: new Date(2021, 6, 6),
  endDate: new Date(2021, 6, 7),
};

describe('ResourceProcessor', () => {
  describe('Array', () => {
    it('should process empty resources with empty appointment', async () => {
      const processor = new ResourceProcessor([]);

      expect(await processor.getAppointmentResourcesValues(appointment)).toEqual([]);
    });

    it('should process resource with empty text', async () => {
      const processor = new ResourceProcessor([{
        ...roomResource,
        label: undefined,
      }]);

      expect(await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 1,
      })).toEqual([{
        label: undefined,
        values: ['Room 1'],
      }]);
    });

    it('should process two resources with empty appointment', async () => {
      const processor = new ResourceProcessor([roomResource, ownerResource]);

      expect(await processor.getAppointmentResourcesValues(appointment)).toEqual([]);
    });

    it('should process single id resource with appointment', async () => {
      const processor = new ResourceProcessor([roomResource, ownerResource]);

      expect(await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 1,
      })).toEqual([{
        label: 'Room',
        values: ['Room 1'],
      }]);
    });

    it('should process multiple id resource with appointment', async () => {
      const processor = new ResourceProcessor([roomResource, ownerResource]);

      expect(await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: [1, 2],
      })).toEqual([{
        label: 'Room',
        values: ['Room 1', 'Room 2'],
      }]);
    });

    it('should process resources with appointment', async () => {
      const processor = new ResourceProcessor([roomResource, ownerResource]);

      expect(await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: [1, 2],
        ownerId: 2,
      })).toEqual([{
        label: 'Room',
        values: ['Room 1', 'Room 2'],
      }, {
        label: 'Owner',
        values: ['John Heart'],
      }]);
    });

    it('should process resources with several appointments', async () => {
      const processor = new ResourceProcessor([roomResource, ownerResource]);

      expect(await Promise.all([
        processor.getAppointmentResourcesValues({
          ...appointment,
          roomId: [1, 2],
          ownerId: 2,
        }),
        processor.getAppointmentResourcesValues({
          ...appointment,
          roomId: [2, 3],
          ownerId: 1,
        }),
      ])).toEqual([
        [{
          label: 'Room',
          values: ['Room 1', 'Room 2'],
        }, {
          label: 'Owner',
          values: ['John Heart'],
        }],
        [{
          label: 'Room',
          values: ['Room 2', 'Room 3'],
        }, {
          label: 'Owner',
          values: ['Samantha Bright'],
        }],
      ]);
    });

    it('should process field expressions of resources with appointment', async () => {
      const processor = new ResourceProcessor([{
        fieldExpr: 'OwnerId',
        valueExpr: 'Id',
        displayExpr: 'Text',
        label: 'Owner',
        dataSource: [{
          Text: 'Samantha Bright',
          Id: 1,
        }, {
          Text: 'John Heart',
          Id: 2,
        }, {
          Text: 'Todd Hoffman',
          Id: 3,
        }, {
          Text: 'Sandra Johnson',
          Id: 4,
        }],
      }]);

      expect(await processor.getAppointmentResourcesValues({
        ...appointment,
        OwnerId: [1, 3],
      })).toEqual([{
        label: 'Owner',
        values: ['Samantha Bright', 'Todd Hoffman'],
      }]);
    });
  });

  describe('DataSource', () => {
    it('should load resources once', async () => {
      let loadCount = 0;
      const processor = new ResourceProcessor([
        {
          fieldExpr: 'roomId',
          dataSource: new DataSource({
            store: new CustomStore({
              load: () => {
                loadCount += 1;
                return rooms;
              },
            }),
          }),
          label: 'Room',
        },
      ]);

      await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 1,
      });
      await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 2,
      });
      await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 3,
      });
      await processor.getAppointmentResourcesValues({
        ...appointment,
        roomId: 4,
      });

      expect(loadCount).toBe(1);
    });
    it('should process resources with appointment', async () => {
      const processor = new ResourceProcessor([
        {
          fieldExpr: 'roomId',
          dataSource: new DataSource({
            store: new CustomStore({
              load: () => rooms,
            }),
          }),
          label: 'Room',
        },
      ]);

      expect(await Promise.all([
        processor.getAppointmentResourcesValues({
          ...appointment,
          roomId: 1,
        }),
        processor.getAppointmentResourcesValues({
          ...appointment,
          roomId: [2, 3],
        }),
        processor.getAppointmentResourcesValues({
          ...appointment,
          roomId: 3,
        }),
      ])).toEqual([
        [{
          label: 'Room',
          values: ['Room 1'],
        }],
        [{
          label: 'Room',
          values: ['Room 2', 'Room 3'],
        }],
        [{
          label: 'Room',
          values: ['Room 3'],
        }],
      ]);
    });
  });
});
