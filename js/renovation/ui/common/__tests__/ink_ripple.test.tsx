import { shallow } from 'enzyme';
import { InkRipple, viewFunction } from '../ink_ripple';
import { initConfig, showWave, hideWave } from '../../../../ui/widget/utils.ink_ripple';

jest.mock('../../../../ui/widget/utils.ink_ripple', () => ({
  ...jest.requireActual('../../../../ui/widget/utils.ink_ripple'),
  initConfig: jest.fn(),
  showWave: jest.fn(),
  hideWave: jest.fn(),
}));

describe('InkRipple', () => {
  beforeEach(() => { (initConfig as any).mockImplementation(() => 'config'); });

  afterEach(() => jest.resetAllMocks());

  describe('Render', () => {
    it('should pass all necessary properties to the root element', () => {
      const inkRipple = shallow(viewFunction({ restAttributes: { 'rest-attributes': 'restAttributes' } } as any) as any);

      expect(inkRipple.props()).toEqual({
        className: 'dx-inkripple',
        'rest-attributes': 'restAttributes',
      });
    });
  });

  describe('Behavior', () => {
    describe('Methods', () => {
      const event = {};

      describe('hideWave', () => {
        it('should call hide wave function', () => {
          new InkRipple({}).hideWave(event as Event);

          expect(hideWave).toHaveBeenCalledTimes(1);
          expect(hideWave).toHaveBeenCalledWith('config', event);
        });
      });

      describe('showWave', () => {
        it('should call show wave function', () => {
          new InkRipple({}).showWave(event as Event);

          expect(showWave).toHaveBeenCalledTimes(1);
          expect(showWave).toHaveBeenCalledWith('config', event);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('getConfig', () => {
        it('should call initConfig function with right arguments', () => {
          const config = {};
          const inkRipple = new InkRipple({ config });

          expect(inkRipple.getConfig).toBe('config');
          expect(initConfig).toBeCalledTimes(1);
          expect(initConfig).toBeCalledWith(config);
        });
      });
    });
  });
});
