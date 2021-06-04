/* eslint-disable max-classes-per-file */
import Editor from '../editor';
import OldEditor from '../../../../ui/editor/editor';

const mockIsEditorMock = jest.fn().mockReturnValue(false);

jest.mock('../../../../../ui/editor/editor', () => (
  { isEditor: (inst) => mockIsEditorMock(inst) }));
jest.mock('../../component');
class TestEditor extends Editor {

}

describe('Static methods', () => {
  it('isEditor', () => {
    const instance = new TestEditor({} as any, {});
    expect((OldEditor as any).isEditor(instance)).toBe(true);
    expect(mockIsEditorMock).toHaveBeenCalledWith(instance);
  });
});
