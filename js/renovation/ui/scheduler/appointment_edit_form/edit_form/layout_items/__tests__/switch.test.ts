import { getSwitchLayoutItemConfig } from '../switch';

describe('API', () => {
  describe('getSwitchLayoutItemConfig', () => {
    it('should return correct config', () => {
      const switchLayoutItemConfig = getSwitchLayoutItemConfig(
        (): any => 'switch template',
        'descriptionField',
        'description label',
      );

      expect(switchLayoutItemConfig)
        .toEqual({
          template: expect.any(Function),
          cssClass: 'dx-appointment-form-switch',
          dataField: 'descriptionField',
          label: {
            location: 'right',
            text: 'description label',
          },
        });
    });
  });
});
