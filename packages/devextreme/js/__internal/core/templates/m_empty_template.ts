import $ from '../renderer';
import { TemplateBase } from './template_base';

export class EmptyTemplate extends TemplateBase {
    _renderCore() {
        return $();
    }
}
