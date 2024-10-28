/**
* DevExtreme (esm/renovation/ui/editors/common/editor_label_props.js)
* Version: 24.2.0
* Build date: Fri Oct 25 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { isMaterial, current } from '../../../../ui/themes';
export const EditorLabelProps = {
  label: '',
  get labelMode() {
    return isMaterial(current()) ? 'floating' : 'static';
  }
};
