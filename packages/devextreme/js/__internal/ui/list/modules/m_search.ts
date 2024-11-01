import TextBox from '@js/ui/text_box';
import searchBoxMixin from '@js/ui/widget/ui.search_box_mixin';
// @ts-expect-error
searchBoxMixin.setEditorClass(TextBox);
