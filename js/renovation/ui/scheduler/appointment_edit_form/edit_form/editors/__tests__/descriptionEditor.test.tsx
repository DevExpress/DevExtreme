import { DescriptionEditor } from '../descriptionEditor';

describe('Logic', () => {
  describe('initDate', () => {
    it('should correctly init value', () => {
      const expected = 'test';
      const editor = new DescriptionEditor({
        value: expected,
      } as any);

      expect(editor.value)
        .toEqual(undefined);

      editor.initDate();
      expect(editor.value)
        .toEqual(expected);

      editor.props.value = 'test 123';
      editor.initDate();
      expect(editor.value)
        .toEqual(expected);
    });
  });
});
