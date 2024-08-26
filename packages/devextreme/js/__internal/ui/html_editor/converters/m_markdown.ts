// import { getWindow } from '@js/core/utils/window';
// import Errors from '@js/ui/widget/ui.errors';

// import converterController from '../m_converterController';

class MarkdownConverter {
  // _markdown2Html: any;

  // _html2Markdown: any;

  constructor() {
    // const window = getWindow();
    // eslint-disable-next-line no-console
    console.log('custom');
  }

  toHtml(markup) {
    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }
  }

  fromHtml(htmlMarkup) {
    return htmlMarkup;
  }

  toHtmlWithCustomConverter(markdownMarkup) {
    const markup = markdownMarkup?.replace?.(new RegExp('\\r?\\n', 'g'), '');

    return markup;
  }
}

// converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
