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

function openTest(testPath, autoClose = false) {
    // Start timeout tracking for this test
    startTestTimeout(testPath);
    
    // Add autoClose parameter to URL if needed
    const testUrl = autoClose ? `/run/${testPath}?autoClose=true` : `/run/${testPath}`;
    window.open(testUrl, '_blank');
}

function openTestOnPort20060(testPath) {
    const currentUrl = window.location.origin;
    const newUrl = currentUrl.replace(':3000', ':20060');
    const testUrl = `${newUrl}/run/${testPath}`;
    window.open(testUrl, '_blank');
    console.log(`🔄 Opening test on alternative port: ${testUrl}`);
}

function openInVSCode(testPath) {
    // Create Vite-compatible URL to open file in editor
    // Format: http://localhost:3000/__open-in-editor?file=path/to/file.js
    const viteEditorUrl = `http://localhost:3000/__open-in-editor?file=testing/tests/${testPath}`;
    
    // Try to open in editor via Vite
    fetch(viteEditorUrl)
        .then(response => {
            if (response.ok) {
                console.log(`📝 Opened in editor: ${testPath}`);
            } else {
                console.warn(`⚠️ Failed to open in editor: ${testPath}`);
                // Fallback to direct file URL with text fragment
                openWithTextFragment(testPath);
            }
        })
        .catch(error => {
            console.warn('⚠️ Vite editor integration not available, using fallback');
            openWithTextFragment(testPath);
        });
}

function openWithTextFragment(testPath) {
    // Create URL with text fragment to highlight the file path
    // This helps identify the file location in the browser
    const filePathHighlight = testPath.replace(/\//g, '/-,').replace(/\./g, ',-/');
    const urlWithFragment = `http://localhost:3000/run/${testPath}#:~:text=Projects/DevExtreme/packages/-,devextreme,-/testing/tests/${filePathHighlight}`;
    
    // Open in new tab
    window.open(urlWithFragment, '_blank');
    console.log(`📝 Opened with text fragment: ${testPath}`);
}

// Test timeout management
function startTestTimeout(testPath) {
    // Clear any existing timeout for this test
    if (runningTestTimeouts.has(testPath)) {
        clearTimeout(runningTestTimeouts.get(testPath));
    }
    
    // Set test as running/pending
    updateTestStatus(testPath, 'pending');
    
    // Start new timeout
    const timeoutId = setTimeout(() => {
        console.warn(`⏰ Test timeout after ${TEST_TIMEOUT_MS}ms: ${testPath}`);
        
        // Mark test as broken due to timeout
        const results = getTestResults();
        results[testPath] = {
            status: 'broken',
            timestamp: Date.now(),
            timeout: true,
            details: {
                total: 0,
                passed: 0,
                failed: 1,
                runtime: TEST_TIMEOUT_MS,
                reason: `Test timed out after ${TEST_TIMEOUT_MS / 1000} seconds`
            }
        };
        
        localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(results));
        updateTestStatus(testPath, 'broken', results[testPath].details);
        updateStats();
        
        // Remove from tracking
        runningTestTimeouts.delete(testPath);
        updateRunningTestsIndicator();
        
        console.log(`💥 Auto-marked as broken due to timeout: ${testPath}`);
    }, TEST_TIMEOUT_MS);
    
    runningTestTimeouts.set(testPath, timeoutId);
    updateRunningTestsIndicator();
    console.log(`⏱️ Started ${TEST_TIMEOUT_MS / 1000}s timeout for: ${testPath}`);
}

function clearTestTimeout(testPath) {
    if (runningTestTimeouts.has(testPath)) {
        clearTimeout(runningTestTimeouts.get(testPath));
        runningTestTimeouts.delete(testPath);
        updateRunningTestsIndicator();
        console.log(`✅ Cleared timeout for: ${testPath}`);
    }
}

function updateRunningTestsIndicator() {
    const indicator = document.getElementById('runningTestsIndicator');
    const counter = document.getElementById('runningTestsCount');
    
    if (indicator && counter) {
        const runningCount = runningTestTimeouts.size;
        counter.textContent = runningCount;
        
        if (runningCount > 0) {
            indicator.style.display = 'inline';
        } else {
            indicator.style.display = 'none';
        }
    }
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

// Test execution control
let isRunningTests = false;
let currentTestExecution = null;

// Test timeout tracking
const TEST_TIMEOUT_MS = 20000; // 20 seconds
let runningTestTimeouts = new Map(); // testPath -> timeoutId

function runAllTests() {
    const testItems = document.querySelectorAll('.test-item[data-test-path]');
    const allTestPaths = Array.from(testItems).map(item => item.getAttribute('data-test-path'));
    runTestsWithDelay(allTestPaths, 1000);
}

function runFolderTests(folderPath) {
    const folderDiv = document.querySelector(`[data-path="${folderPath}"]`);
    if (!folderDiv) return;
    
    const testItems = folderDiv.querySelectorAll('.test-item[data-test-path]');
    const testPaths = Array.from(testItems).map(item => item.getAttribute('data-test-path'));
    
    if (testPaths.length > 0) {
        console.log(`🚀 Running ${testPaths.length} tests from folder: ${folderPath}`);
        runTestsWithDelay(testPaths, 1000);
    }
}

function runTestsWithDelay(testPaths, delay) {
    if (isRunningTests) {
        console.warn('⚠️ Tests are already running');
        return;
    }
    
    isRunningTests = true;
    let currentIndex = 0;
    
    console.log(`🎯 Starting batch execution of ${testPaths.length} tests with ${delay}ms delay`);
    
    const executeNext = () => {
        if (!isRunningTests || currentIndex >= testPaths.length) {
            isRunningTests = false;
            currentTestExecution = null;
            console.log('✅ Batch test execution completed');
            return;
        }
        
        const testPath = testPaths[currentIndex];
        updateTestStatus(testPath, 'pending');
        console.log(`▶️ Running test ${currentIndex + 1}/${testPaths.length}: ${testPath}`);
        
        openTest(testPath, true); // autoClose=true for batch execution
        currentIndex++;
        
        currentTestExecution = setTimeout(executeNext, delay);
    };
    
    executeNext();
}

function stopTestExecution() {
    if (isRunningTests) {
        isRunningTests = false;
        if (currentTestExecution) {
            clearTimeout(currentTestExecution);
            currentTestExecution = null;
        }
        
        // Clear all running test timeouts
        runningTestTimeouts.forEach((timeoutId, testPath) => {
            clearTimeout(timeoutId);
            console.log(`🧹 Cleared timeout for stopped test: ${testPath}`);
        });
        runningTestTimeouts.clear();
        updateRunningTestsIndicator();
        
        console.log('🛑 Test execution stopped by user');
    }
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

// Test Results Management
const TEST_RESULTS_KEY = 'devextreme_test_results';

function getTestResults() {
    try {
        const stored = localStorage.getItem(TEST_RESULTS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('❌ Failed to load test results:', error);
        return {};
    }
}

function updateTestStatus(testPath, status, details = {}) {
    const testElement = document.querySelector(`[data-test-path="${testPath}"]`);
    if (!testElement) return;
    
    const statusElement = testElement.querySelector('.test-status');
    if (!statusElement) return;
    
    statusElement.setAttribute('data-status', status);
    
    switch(status) {
        case 'passed':
            statusElement.textContent = '✅';
            statusElement.title = `Passed (${details.passed}/${details.total} tests, ${details.runtime}ms)`;
            break;
        case 'failed':
            statusElement.textContent = '❌';
            statusElement.title = `Failed (${details.failed}/${details.total} failed, ${details.runtime}ms)`;
            break;
        case 'broken':
            const results = getTestResults();
            const result = results[testPath];
            const isTimeout = result && result.timeout;
            statusElement.textContent = isTimeout ? '⏰' : '💥';
            statusElement.title = isTimeout 
                ? `Timeout (${details.reason || 'Test timed out'})`
                : `Broken (manually marked) - ${details.reason || 'No details'}`;
            break;
        case 'pending':
        default:
            statusElement.textContent = '⏳';
            statusElement.title = 'Pending';
            break;
    }
}

function loadAndDisplayTestResults() {
    const results = getTestResults();
    const testElements = document.querySelectorAll('.test-item[data-test-path]');
    
    console.log(`📊 Loading test results for ${testElements.length} tests`);
    
    testElements.forEach(testElement => {
        const testPath = testElement.getAttribute('data-test-path');
        const result = results[testPath];
        
        if (result) {
            updateTestStatus(testPath, result.status, result.details);
        }
    });
    
    updateStats();
}

function updateStats() {
    const results = getTestResults();
    const testElements = document.querySelectorAll('.test-item[data-test-path]');
    
    let passed = 0, failed = 0, pending = 0, broken = 0;
    
    testElements.forEach(testElement => {
        const testPath = testElement.getAttribute('data-test-path');
        const result = results[testPath];
        
        if (result) {
            if (result.status === 'passed') passed++;
            else if (result.status === 'failed') failed++;
            else if (result.status === 'broken') broken++;
            else pending++;
        } else {
            pending++;
        }
    });
    
    console.log(`📈 Stats: ${passed} passed, ${failed} failed, ${broken} broken, ${pending} pending`);
    
    // Update global statistics
    updateGlobalStats(passed, failed, broken, pending);
    
    // Update folder statistics
    updateFolderStats();
}

function updateGlobalStats(passed, failed, broken, pending) {
    const globalPassedCount = document.getElementById('globalPassedCount');
    const globalFailedCount = document.getElementById('globalFailedCount');
    const globalBrokenCount = document.getElementById('globalBrokenCount');
    const globalPendingCount = document.getElementById('globalPendingCount');
    
    if (globalPassedCount) globalPassedCount.textContent = passed;
    if (globalFailedCount) globalFailedCount.textContent = failed;
    if (globalBrokenCount) globalBrokenCount.textContent = broken;
    if (globalPendingCount) globalPendingCount.textContent = pending;
    
    // Hide/show stats based on counts (optional visual enhancement)
    const globalStats = document.querySelectorAll('.global-stat');
    globalStats.forEach(stat => {
        const count = parseInt(stat.querySelector('.stat-count').textContent);
        if (count === 0) {
            stat.style.opacity = '0.6';
        } else {
            stat.style.opacity = '1';
        }
    });
}

function updateFolderStats() {
    const results = getTestResults();
    const folderElements = document.querySelectorAll('.folder-stats[data-folder-path]');
    
    folderElements.forEach(folderElement => {
        const folderPath = folderElement.getAttribute('data-folder-path');
        const folderDiv = document.querySelector(`[data-path="${folderPath}"]`);
        
        if (!folderDiv) return;
        
        const testElements = folderDiv.querySelectorAll('.test-item[data-test-path]');
        let passed = 0, failed = 0, pending = 0, broken = 0;
        
        testElements.forEach(testElement => {
            const testPath = testElement.getAttribute('data-test-path');
            const result = results[testPath];
            
            if (result) {
                if (result.status === 'passed') passed++;
                else if (result.status === 'failed') failed++;
                else if (result.status === 'broken') broken++;
                else pending++;
            } else {
                pending++;
            }
        });
        
        // Update counters
        const passedCounter = folderElement.querySelector('.stat-passed .count');
        const failedCounter = folderElement.querySelector('.stat-failed .count');
        const brokenCounter = folderElement.querySelector('.stat-broken .count');
        const pendingCounter = folderElement.querySelector('.stat-pending .count');
        
        if (passedCounter) passedCounter.textContent = passed;
        if (failedCounter) failedCounter.textContent = failed;
        if (brokenCounter) brokenCounter.textContent = broken;
        if (pendingCounter) pendingCounter.textContent = pending;
        
        // Hide zero counters
        const passedStat = folderElement.querySelector('.stat-passed');
        const failedStat = folderElement.querySelector('.stat-failed');
        const brokenStat = folderElement.querySelector('.stat-broken');
        const pendingStat = folderElement.querySelector('.stat-pending');
        
        if (passedStat) passedStat.style.display = passed > 0 ? 'inline-flex' : 'none';
        if (failedStat) failedStat.style.display = failed > 0 ? 'inline-flex' : 'none';
        if (brokenStat) brokenStat.style.display = broken > 0 ? 'inline-flex' : 'none';
        if (pendingStat) pendingStat.style.display = pending > 0 ? 'inline-flex' : 'none';
    });
}

function refreshTestStatuses() {
    loadAndDisplayTestResults();
}

function clearAllTestResults() {
    if (confirm('🗑️ Clear all test results?')) {
        localStorage.removeItem(TEST_RESULTS_KEY);
        console.log('🗑️ All test results cleared');
        
        // Reset all statuses to pending
        document.querySelectorAll('.test-status').forEach(statusEl => {
            statusEl.setAttribute('data-status', 'pending');
            statusEl.textContent = '⏳';
            statusEl.title = 'Pending';
        });
        
        updateStats();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load test results on page load
    loadAndDisplayTestResults();
    
    // Listen for test result updates from child windows
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'TEST_RESULT_UPDATED') {
            const { testPath, result } = event.data;
            
            // Clear timeout since we received a result
            clearTestTimeout(testPath);
            
            updateTestStatus(testPath, result.status, result.details);
            updateStats();
            console.log(`📝 Updated status for ${testPath}: ${result.status}`);
        }
    });
    
    // ESC key to stop test execution
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isRunningTests) {
            stopTestExecution();
        }
    });
    
    console.log('🎉 Main page initialized with test result tracking');
});

// Manual Status Management
function showStatusMenu(event, testPath) {
    event.preventDefault();
    event.stopPropagation();
    
    // Remove any existing status menu
    const existingMenu = document.querySelector('.status-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create status menu
    const menu = document.createElement('div');
    menu.className = 'status-menu';
    menu.innerHTML = `
        <div class="status-menu-item" onclick="setManualTestStatus('${testPath}', 'passed', event)">
            ✅ Passed
        </div>
        <div class="status-menu-item" onclick="setManualTestStatus('${testPath}', 'failed', event)">
            ❌ Failed
        </div>
        <div class="status-menu-item" onclick="setManualTestStatus('${testPath}', 'pending', event)">
            ⏳ Pending
        </div>
        <div class="status-menu-item broken" onclick="setManualTestStatus('${testPath}', 'broken', event)">
            💥 Broken (manual)
        </div>
        <div class="status-menu-divider"></div>
        <div class="status-menu-item cancel" onclick="closeStatusMenu(event)">
            ❌ Cancel
        </div>
    `;
    
    // Position menu
    menu.style.position = 'fixed';
    menu.style.zIndex = '1000';
    
    document.body.appendChild(menu);
    
    // Calculate positioning to keep menu within viewport bounds
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX;
    let top = event.clientY;
    
    // Check if menu would go off right edge, if so position to the left of cursor
    if (left + menuRect.width > viewportWidth) {
        left = Math.max(0, event.clientX - menuRect.width);
    }
    
    // Check if menu would go off bottom edge, if so position above cursor
    if (top + menuRect.height > viewportHeight) {
        top = Math.max(0, event.clientY - menuRect.height);
    }
    
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    
    // Close menu when clicking outside
    const closeOnOutsideClick = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeOnOutsideClick);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOnOutsideClick);
    }, 10);
}

function setManualTestStatus(testPath, status, event) {
    event.stopPropagation();
    
    // Save manual status to localStorage
    const results = getTestResults();
    results[testPath] = {
        status: status,
        timestamp: Date.now(),
        manual: true,
        details: status === 'broken' ? {
            total: 0,
            passed: 0,
            failed: 1,
            runtime: 0,
            reason: 'Manually marked as broken'
        } : {
            total: 1,
            passed: status === 'passed' ? 1 : 0,
            failed: status === 'failed' ? 1 : 0,
            runtime: 0
        }
    };
    
    localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(results));
    
    // Update UI
    updateTestStatus(testPath, status, results[testPath].details);
    updateStats();
    
    console.log(`🔧 Manually set status for ${testPath}: ${status}`);
    
    // Close menu
    closeStatusMenu(event);
}

function closeStatusMenu(event) {
    event.stopPropagation();
    const menu = document.querySelector('.status-menu');
    if (menu) {
        menu.remove();
    }
}

// Run tests by status
function runTestsByStatus(status) {
    const results = getTestResults();
    const testElements = document.querySelectorAll('.test-item[data-test-path]');
    
    let testsToRun = [];
    
    testElements.forEach(testElement => {
        const testPath = testElement.getAttribute('data-test-path');
        const result = results[testPath];
        
        // Determine if test matches the requested status
        let testStatus = 'pending'; // default status
        if (result && result.status) {
            testStatus = result.status;
        }
        
        if (testStatus === status) {
            testsToRun.push(testPath);
        }
    });
    
    if (testsToRun.length === 0) {
        alert(`No tests found with status: ${status}`);
        return;
    }
    
    
    console.log(`🚀 Running ${testsToRun.length} tests with status: ${status}`);
    console.log('Tests to run:', testsToRun);
    
    // Run tests sequentially with a small delay
    runTestsSequentially(testsToRun, 0, ` (${status} status)`);
}

function runTestsSequentially(testPaths, index = 0, context = '') {
    if (index >= testPaths.length) {
        console.log(`✅ Finished running all ${testPaths.length} tests${context}`);
        // Reset title
        document.title = 'DevExtreme Test Runner';
        return;
    }
    
    const testPath = testPaths[index];
    const progress = `${index + 1}/${testPaths.length}`;
    console.log(`🧪 Running test ${progress}: ${testPath}${context}`);
    
    // Update page title to show progress
    document.title = `[${progress}] Running tests - DevExtreme Test Runner`;
    
    // Open test
    openTest(testPath, true); // autoClose=true for batch execution
    
    // Continue with next test after a delay
    setTimeout(() => {
        runTestsSequentially(testPaths, index + 1, context);
    }, 1000); // 1 second delay between tests
}

// Run tests by status for a specific folder
function runFolderTestsByStatus(folderPath, status) {
    const results = getTestResults();
    const testElements = document.querySelectorAll('.test-item[data-test-path]');
    
    let testsToRun = [];
    
    testElements.forEach(testElement => {
        const testPath = testElement.getAttribute('data-test-path');
        
        // Check if test is in the specified folder
        if (!testPath.startsWith(folderPath)) {
            return;
        }
        
        const result = results[testPath];
        
        // Determine if test matches the requested status
        let testStatus = 'pending'; // default status
        if (result && result.status) {
            testStatus = result.status;
        }
        
        if (testStatus === status) {
            testsToRun.push(testPath);
        }
    });
    
    if (testsToRun.length === 0) {
        alert(`No ${status} tests found in folder: ${folderPath}`);
        return;
    }
    
    
    console.log(`🚀 Running ${testsToRun.length} ${status} tests from folder: ${folderPath}`);
    console.log('Tests to run:', testsToRun);
    
    // Run tests sequentially with a small delay
    runTestsSequentially(testsToRun, 0, ` (${status} from ${folderPath})`);
}


