import each from 'jest-each';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '../resolve_rtl';
import { ConfigContextValue } from '../../common/config_context';
import config from '../../../core/config';

describe('rtlEnabled', () => {
  it('should return value from props if props has value', () => {
    // emulate context
    const contextConfig = { rtlEnabled: true } as ConfigContextValue;

    expect(resolveRtlEnabled(false, contextConfig)).toBe(false);
  });

  it('should return value from parent rtlEnabled context if props isnt defined', () => {
    // emulate context
    const contextConfig = { rtlEnabled: true } as ConfigContextValue;
    expect(resolveRtlEnabled(undefined, contextConfig)).toBe(true);
  });

  it('should return value from config if any other props isnt defined', () => {
    config().rtlEnabled = true;
    expect(resolveRtlEnabled(undefined, undefined)).toBe(true);
  });
});

describe('rtlEnabledDefinition', () => {
  each`
  global       | rtlEnabled   | parentRtlEnabled | expected
  ${true}      | ${true}      | ${true}          | ${false}
  ${undefined} | ${undefined} | ${undefined}     | ${false}
  ${true}      | ${true}      | ${undefined}     | ${true}
  ${true}      | ${false}     | ${undefined}     | ${true}
  ${true}      | ${true}      | ${false}         | ${true}
  ${true}      | ${false}     | ${true}          | ${true}
  ${true}      | ${undefined} | ${undefined}     | ${true}
  ${true}      | ${undefined} | ${true}          | ${false}
  ${true}      | ${undefined} | ${false}         | ${false}
  ${true}      | ${true}      | ${true}          | ${false}
    `
    .describe('resolveRtlEnabledDefinition truth table', ({
      global, rtlEnabled, parentRtlEnabled, expected,
    }) => {
      const name = `${JSON.stringify({
        global, rtlEnabled, parentRtlEnabled, expected,
      })}`;

      it(name, () => {
        config().rtlEnabled = global;
        const contextConfig = { rtlEnabled: parentRtlEnabled } as ConfigContextValue;
        expect(resolveRtlEnabledDefinition(rtlEnabled, contextConfig)).toBe(expected);
      });
    });

  it('should process undefined config', () => {
    config().rtlEnabled = true;
    expect(resolveRtlEnabledDefinition(undefined, undefined)).toBe(true);
  });
});
