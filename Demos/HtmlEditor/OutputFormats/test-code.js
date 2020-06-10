var $content = $(".value-content");
var text = $content.text();

$content.text(text.replace(/src\s*=\s*"(.+?)"/, 'src="images/widgets/HtmlEditor.svg"'));