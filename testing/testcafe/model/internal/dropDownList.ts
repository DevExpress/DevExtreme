import { t } from 'testcafe';
import List from '../list';
import DropDownEditor from './dropDownEditor';

export default abstract class DropDownList extends DropDownEditor {
  async getList(): Promise<List> {
    await t.expect(await this.isOpened()).ok();

    return new List(await this.getPopup());
  }
}
