/* eslint-env browser */
let reportData = null;
let selectedSuiteIdx = 0;
let selectedSpecIdx = null;

function renderSidebar(suites) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    // Add sticky header with run button
    if(!document.getElementById('sidebar-header')) {
        const header = document.createElement('div');
        header.id = 'sidebar-header';
        header.innerHTML = '<button id="run-tests-btn" class="run-tests-btn">Run tests</button>';
        sidebar.appendChild(header);
    }
    suites.forEach((suite, suiteIdx) => {
        const suiteDiv = document.createElement('div');
        suiteDiv.className = 'suite-item' + (suiteIdx === selectedSuiteIdx ? ' selected' : '');
        suiteDiv.innerHTML = `<div class="suite-title">${suite.title}</div>`;
        suiteDiv.onclick = () => {
            selectedSuiteIdx = suiteIdx;
            selectedSpecIdx = null;
            renderSidebar(suites);
            renderMain();
        };
        sidebar.appendChild(suiteDiv);

        // specs list
        const specList = document.createElement('ul');
        specList.className = 'spec-list';
        suite.specs.forEach((spec, specIdx) => {
            const status = getSpecStatus(spec);
            const duration = getSpecDuration(spec);
            const specItem = document.createElement('li');
            specItem.className = 'spec-item' + (suiteIdx === selectedSuiteIdx && specIdx === selectedSpecIdx ? ' selected' : '');
            specItem.innerHTML = `
        <span class="spec-title">${spec.title}</span>
        <span class="spec-status ${status}">${status}</span>
        <span class="spec-duration">${duration.toFixed(1)}s</span>
      `;
            specItem.onclick = (e) => {
                e.stopPropagation();
                selectedSuiteIdx = suiteIdx;
                selectedSpecIdx = specIdx;
                renderSidebar(suites);
                renderMain();
            };
            specList.appendChild(specItem);
        });
        sidebar.appendChild(specList);
    });
}

function getSpecStatus(spec) {
    const hasFailed = spec.tests.some(test =>
        test.results.some(r => r.status === 'failed')
    );
    const hasFlaky = spec.tests.some(test =>
        test.status === 'flaky'
    );
    if(hasFlaky) return 'flaky';
    if(hasFailed) return 'failed';
    return 'passed';
}

function getSpecDuration(spec) {
    let total = 0;
    spec.tests.forEach(test => {
        test.results.forEach(r => {
            total += r.duration || 0;
        });
    });
    return total / 1000;
}

function getApproveButtonHTML(group) {
    const expected = group.find(a => a.name.includes('expected'));
    const actual = group.find(a => a.name.includes('actual'));
    const expectedPath = encodeURIComponent(relativeTestResultsPath(expected.path));
    const actualPath = encodeURIComponent(relativeTestResultsPath(actual.path));

    if(expected && actual) {
        return `
        <button class="copy-screenshot-btn" data-expected="${expectedPath}" data-actual="${actualPath}">
            Approve
        </button>
        `;
    }

    return '';
}

function renderBreadcrumbs(suite, spec) {
    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'breadcrumbs';
    breadcrumbs.innerHTML = `<span class="breadcrumb-suite">${suite.title}</span> → <span class="breadcrumb-spec">${spec.title}</span>`;
    return breadcrumbs;
}
function renderSnippetHtml(spec) {
    const snippet = document.createElement('div');
    // eslint-disable-next-line no-restricted-syntax
    for(const test of spec.tests) {
        // eslint-disable-next-line no-restricted-syntax
        for(const result of test.results) {
            if(result.error && result.error.snippet) {
                snippet.innerHTML = `<pre class="snippet-block"><code>${escapeHtml(result.error.snippet)}</code></pre>`;
                return snippet;
            }
        }
    }

    return snippet;
}

function renderMain() {
    const main = document.getElementById('main');
    const suite = reportData.suites[selectedSuiteIdx];
    const spec = suite.specs[selectedSpecIdx];
    main.innerHTML = '';
    if(selectedSpecIdx == null) {
        main.innerHTML = '<div class="no-screenshots">Select a spec to view screenshots</div>';
        return;
    }

    const allPNG = [];
    spec.tests.forEach(test => {
        test.results.forEach(result => {
            if(result.attachments && result.attachments.length) {
                allPNG.push(...result.attachments.filter(a => a.contentType === 'image/png'));
            }
        });
    });
    const groups = {};
    allPNG.forEach(attachment => {
        const match = attachment.name.match(/^(.*?)(-(expected|actual|diff))?\.png$/);
        const groupName = match ? match[1] + '.png' : attachment.name;
        if(!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(attachment);
    });
    const groupNames = Object.keys(groups);
    if(groupNames.length === 0) {
        main.innerHTML = '<div class="no-screenshots">No screenshots found for this spec</div>';
        return;
    }
    main.appendChild(renderBreadcrumbs(suite, spec));
    main.appendChild(renderSnippetHtml(spec));
    main.innerHTML += groupNames.map((groupName) => {
        const group = groups[groupName];
        const hasDiff = group.some(a => a.name.includes('diff'));
        let images = [];
        let groupTitle = groupName;
        let groupClass = 'screenshot-group-title';
        let copyButtonHtml = '';

        switch(true) {
            case hasDiff:
                images = ['expected', 'actual', 'diff']
                    .map(type => group.find(a => a.name.includes(type)))
                    .filter(Boolean);
                copyButtonHtml = getApproveButtonHTML(group);
                break;
            case groupName === 'screenshot':
                images = group;
                groupTitle += ' [screenshot after test finished]';
                groupClass += ' final-screenshot';
                break;
            default:
                images = [group.find(a => a.name.includes('expected')) || group[0]];
                groupTitle += ' [new screenshot]';
                groupClass += ' new-screenshot';
                break;
        }

        return `
          <div class="screenshot-group">
            <div class="${groupClass}">${groupTitle} ${copyButtonHtml}</div>
            <div class="screenshot-list">
              ${images.map(a => `<img src="${relativeTestResultsPath(a.path)}" alt="${a.name}">`).join('')}
            </div>
          </div>
        `;
    }).join('');

    // Add popup HTML if not present
    if(!document.getElementById('image-popup')) {
        const popup = document.createElement('div');
        popup.id = 'image-popup';
        popup.innerHTML = '<span id="image-popup-close">&times;</span><img src="" alt="Full size">';
        document.body.appendChild(popup);
    }
    const popup = document.getElementById('image-popup');
    const popupImg = popup.querySelector('img');
    const popupClose = document.getElementById('image-popup-close');
    popupClose.onclick = () => {
        popup.classList.remove('active');
        popupImg.src = '';
    };
    popup.onclick = (e) => {
        if(e.target === popup) {
            popup.classList.remove('active');
            popupImg.src = '';
        }
    };

    Array.from(document.getElementsByClassName('copy-screenshot-btn')).forEach(btn => {
        btn.onclick = async function() {
            const from = decodeURIComponent(this.getAttribute('data-actual'));
            const to = decodeURIComponent(this.getAttribute('data-expected'));
            try {
                const resp = await fetch('/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ from, to })
                });
                const result = await resp.json();
                if(result.success) {
                    const parent = this.parentElement;
                    this.remove();
                    const check = document.createElement('span');
                    check.className = 'approve-check';
                    check.title = 'Approved';
                    check.innerHTML = '&#10003;';
                    parent.appendChild(check);
                } else {
                    // eslint-disable-next-line no-alert
                    alert('Error: ' + (result.error || 'Failed to copy file.'));
                }
            } catch(err) {
                // eslint-disable-next-line no-alert
                alert('Error: ' + err.message);
            }
        };
    });

    // Add click handler for images
    Array.from(document.querySelectorAll('.screenshot-list img')).forEach(img => {
        img.style.cursor = 'zoom-in';
        img.onclick = function(e) {
            popupImg.src = this.src;
            popup.classList.add('active');
        };
    });
}

function relativeTestResultsPath(absPath) {
    const norm = absPath.replaceAll('\\', '/');

    const idxTestResults = norm.indexOf('/test-results/');
    if(idxTestResults >= 0) return norm.substring(idxTestResults);

    const idxSnapshots = norm.indexOf('/snapshots/');
    if(idxSnapshots >= 0) return norm.substring(idxSnapshots);

    return absPath;
}

async function renderReport() {
    const response = await fetch('/test-results/report.json');
    reportData = await response.json();
    if(!reportData.suites || !Array.isArray(reportData.suites)) {
        document.getElementById('main').innerHTML = '<div>No suites found in report.json</div>';
        return;
    }
    renderSidebar(reportData.suites);
    renderMain();
}

function setSidebarDisabled(disabled) {
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;
    if(disabled) {
        sidebar.classList.add('sidebar-disabled');
    } else {
        sidebar.classList.remove('sidebar-disabled');
    }
}

function showTestProgress() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    let progress = document.getElementById('test-progress');
    if(!progress) {
        progress = document.createElement('div');
        progress.id = 'test-progress';
        document.getElementById('main').prepend(progress);
    }
    progress.classList.add('active');
    progress.textContent = 'Running tests...';
}

function updateTestProgress(text) {
    const progress = document.getElementById('test-progress');
    if(!progress) return;
    progress.classList.add('active');
    progress.textContent = text;
    progress.scrollTop = progress.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    renderReport();
    document.body.addEventListener('click', function(e) {
        if(e.target && e.target.id === 'run-tests-btn') {
            const btn = e.target;
            btn.disabled = true;
            showTestProgress();
            setSidebarDisabled(true);
            fetch('/run-tests', { method: 'POST' })
                .then(resp => resp.body.getReader())
                .then(reader => {
                    let result = '';
                    function readChunk() {
                        return reader.read().then(({ done, value }) => {
                            if(done) {
                                btn.disabled = false;
                                setSidebarDisabled(false);
                                return;
                            }
                            result += new TextDecoder().decode(value);
                            updateTestProgress(result);
                            return readChunk();
                        });
                    }
                    return readChunk();
                })
                .catch(() => {
                    updateTestProgress('Failed to start tests.');
                    btn.disabled = false;
                    setSidebarDisabled(false);
                })
                .then(renderReport);
        }
    });
});

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'

        };
        return charsToReplace[tag] || tag;
    });
}
