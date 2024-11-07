$(() => {
  const updateValueContent = (value) => {
    $('.value-content').text(value);
  };

  const converter = {
    toHtml(value) {
      const result = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(value)
        .toString();

      return result;
    },
    fromHtml(value) {
      const result = window.unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeRemark)
        .use(remarkStringify)
        .processSync(value)
        .toString();

      return result;
    }
  };

  const editorInstance = $('.html-editor').dxHtmlEditor({
    height: 300,
    converter,
    value: markup,
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        'bold', 'italic',
        {
          name: 'header',
          acceptedValues: [false, 1, 2, 3, 4, 5],
          options: { inputAttr: { 'aria-label': 'Header' } },
        },
      ],
    },
    onValueChanged({ value }) {
      updateValueContent(value);
    },
  }).dxHtmlEditor('instance');

  updateValueContent(markup);
});
