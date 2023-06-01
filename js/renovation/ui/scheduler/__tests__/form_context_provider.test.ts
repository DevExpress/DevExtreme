import { FormContextProvider } from '../form_context_provider';

describe('Logic', () => {
  describe('formContextValue', () => {
    it('should return correct correct context data', () => {
      const provider = new FormContextProvider({
        formContextValue: 'data',
      } as any);

      expect(provider.formContextValue)
        .toBe('data');
    });
  });
});
