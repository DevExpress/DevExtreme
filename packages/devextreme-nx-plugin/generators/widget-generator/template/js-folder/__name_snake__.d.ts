import Widget, { WidgetOptions } from './widget/ui.widget';

export interface Properties extends WidgetOptions<<%= name_pascal %>> {

}

export default class <%= name_pascal %> extends Widget<Properties> {

}
