testUtils
    .postponeUntilFound('.demo-container')
    .then(() => testUtils.findElements(".demo-container").forEach(x=>x.style.minHeight = '450px'));
