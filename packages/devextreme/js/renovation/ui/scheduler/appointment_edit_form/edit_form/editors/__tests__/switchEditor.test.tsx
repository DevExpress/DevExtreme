import { SwitchEditor } from '../switchEditor';

describe('Logic', () => {
  describe('initDate', () => {
    it('should correctly change value', () => {
      const editor = new SwitchEditor({
        value: true,
        valueChange: jest.fn((value) => value),
      });

      expect(editor.value)
        .toEqual(undefined);

      editor.initDate();
      expect(editor.value)
        .toEqual(true);

      editor.props.value = false;
      editor.initDate();
      expect(editor.value)
        .toEqual(true);
    });
  });

  describe('onToggle', () => {
    it('should correctly change value', () => {
      const editor = new SwitchEditor({
        value: false,
        valueChange: jest.fn((value) => value),
      });

      editor.onToggle(true);

      expect(editor.value)
        .toEqual(true);

      expect(editor.props.valueChange)
        .toBeCalledWith(true);
    });
  });
});
