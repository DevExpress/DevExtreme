import Component from './component';
import { extend } from '../../core/utils/extend';

export default class TooltipItemContent extends Component {
    _setOptionsByReference() {
        super._setOptionsByReference();

        extend(this._optionsByReference, {
            item: true
        });
    }
}
