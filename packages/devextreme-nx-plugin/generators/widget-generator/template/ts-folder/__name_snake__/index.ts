import type { Properties as PropertiesPublic } from '@js/ui/<%= name_snake %>';
import type <%= name_pascal %>Public from '@js/ui/<%= name_snake %>';
import Widget from '@ts/core/widget/widget';

export interface Properties extends PropertiesPublic {

}

export default class <%= name_pascal %> extends Widget<Properties> implements <%= name_pascal %>Public {

}
