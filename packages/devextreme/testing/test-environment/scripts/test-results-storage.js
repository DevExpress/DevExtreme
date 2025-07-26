/**
 * Test Results Storage - saving and loading test results in localStorage
 */

// Key for storing results in localStorage
const TEST_RESULTS_KEY = 'devextreme_test_results';

/**
 * Save test result to localStorage
 */
function saveTestResult(testPath, result) {
  try {
    const existingResults = getTestResults();
    existingResults[testPath] = {
      status: result.status, // 'passed', 'failed', 'pending'
      timestamp: Date.now(),
      details: {
        total: result.total || 0,
        passed: result.passed || 0,
        failed: result.failed || 0,
        runtime: result.runtime || 0
      }
    };
    
    localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(existingResults));
    console.log(`💾 Test result saved for ${testPath}: ${result.status}`);
    
    // Notify parent window about results change
    if (window.opener && window.opener.postMessage) {
      window.opener.postMessage({
        type: 'TEST_RESULT_UPDATED',
        testPath: testPath,
        result: existingResults[testPath]
      }, '*');
    }
  } catch (error) {
    console.error('❌ Failed to save test result:', error);
  }
}

/**
 * Get all test results from localStorage
 */
function getTestResults() {
  try {
    const stored = localStorage.getItem(TEST_RESULTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('❌ Failed to load test results:', error);
    return {};
  }
}

/**
 * Get specific test result
 */
function getTestResult(testPath) {
  const results = getTestResults();
  return results[testPath] || { status: 'pending' };
}

/**
 * Clear test results
 */
function clearTestResults() {
  try {
    localStorage.removeItem(TEST_RESULTS_KEY);
    console.log('🗑️ Test results cleared');
  } catch (error) {
    console.error('❌ Failed to clear test results:', error);
  }
}

// Initialize QUnit hooks for automatic result saving
if (typeof QUnit !== 'undefined') {
  // Get current test path from URL
  const getCurrentTestPath = () => {
    const pathMatch = window.location.pathname.match(/\/run\/(.+)/);
    return pathMatch ? pathMatch[1] : '';
  };

  // Hook for test completion
  QUnit.done(function(details) {
    const testPath = getCurrentTestPath();
    if (testPath) {
      const status = details.failed > 0 ? 'failed' : 'passed';
      saveTestResult(testPath, {
        status: status,
        total: details.total,
        passed: details.passed,
        failed: details.failed,
        runtime: details.runtime
      });
      
      // Check if we should auto-close the window after saving results
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autoClose') === 'true') {
        console.log(`🚪 Auto-closing test window: ${testPath} (${status})`);
        // Small delay to ensure the result is saved and transmitted to parent
        setTimeout(() => {
          window.close();
        }, 500);
      }
    }
  });

  // Hook for test start - set status to pending
  QUnit.begin(function() {
    const testPath = getCurrentTestPath();
    if (testPath) {
      saveTestResult(testPath, {
        status: 'pending',
        total: 0,
        passed: 0,
        failed: 0,
        runtime: 0
      });
    }
  });
  
  // Handle window errors and unhandled exceptions for auto-close
  window.addEventListener('error', function(event) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoClose') === 'true') {
      console.log('🚪 Auto-closing due to window error in batch mode');
      setTimeout(() => {
        window.close();
      }, 1000); // Longer delay for error cases
    }
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoClose') === 'true') {
      console.log('🚪 Auto-closing due to unhandled rejection in batch mode');
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  });
}

// Export functions for use in other scripts
window.TestResultsStorage = {
  saveTestResult,
  getTestResults,
  getTestResult,
  clearTestResults
};