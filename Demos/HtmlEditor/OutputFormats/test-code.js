testUtils.postponeUntilFound('.value-content').then(() => {
    testUtils.findElements('.value-content').forEach(x=>{
        var text = x.textContent;
        x.textContent = text.replace(/src\s*=\s*"(.+?)"/, 'src="images/widgets/HtmlEditor.svg"');
    });
})
