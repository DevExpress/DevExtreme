function toggleFolder(path) {
    const testsDiv = document.getElementById('tests-' + path);
    const folderItem = testsDiv.closest('.folder-item');

    if(testsDiv.style.display === 'none') {
        testsDiv.style.display = 'block';
        folderItem.classList.add('expanded');
    } else {
        testsDiv.style.display = 'none';
        folderItem.classList.remove('expanded');
    }
}

function openTest(testPath) {
    window.open('/run/' + testPath, '_blank');
}

function expandAll() {
    document.querySelectorAll('.folder-tests').forEach(div => {
        div.style.display = 'block';
        div.closest('.folder-item').classList.add('expanded');
    });
}

function collapseAll() {
    document.querySelectorAll('.folder-tests').forEach(div => {
        div.style.display = 'none';
        div.closest('.folder-item').classList.remove('expanded');
    });
}

function runAllTests() {
    alert('Run all tests functionality will be implemented later');
}

function filterTests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const folderItems = document.querySelectorAll('.folder-item');

    folderItems.forEach(folderItem => {
        const folderName = folderItem.querySelector('.folder-name').textContent.toLowerCase();
        const testItems = folderItem.querySelectorAll('.test-item');
        let hasVisibleTests = false;

        testItems.forEach(testItem => {
            const testName = testItem.querySelector('.test-name').textContent.toLowerCase();
            const testPath = testItem.querySelector('.test-path')?.textContent.toLowerCase() || '';

            if(testName.includes(searchTerm) || testPath.includes(searchTerm)) {
                testItem.style.display = 'flex';
                hasVisibleTests = true;
            } else {
                testItem.style.display = 'none';
            }
        });

        if(folderName.includes(searchTerm) || hasVisibleTests) {
            folderItem.style.display = 'block';
            if(hasVisibleTests && searchTerm) {
                folderItem.querySelector('.folder-tests').style.display = 'block';
                folderItem.classList.add('expanded');
            }
        } else {
            folderItem.style.display = 'none';
        }
    });
}
