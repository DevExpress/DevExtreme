async function forceServiceWorkerReload() {
  if (!('serviceWorker' in navigator)) {
    console.warn('❌ Service Worker not supported');
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('🗑️ Unregistered:', registration.scope);
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service Worker activation timeout'));
      }, 10000); 

      if (registration.active) {
        clearTimeout(timeout);
        resolve();
      } else if (registration.installing) {
        registration.installing.addEventListener('statechange', function () {
          console.log('SW state:', this.state);
          if (this.state === 'activated') {
            clearTimeout(timeout);
            resolve();
          } else if (this.state === 'redundant') {
            clearTimeout(timeout);
            reject(new Error('Service Worker became redundant'));
          }
        });
      } else {
        clearTimeout(timeout);
        reject(new Error('No installing Service Worker'));
      }
    });

    let attempts = 0;
    let intercepted = false;

    while (attempts < 5 && !intercepted) {
      attempts++;
      console.log(`🔍 Interception test attempt ${attempts}/5...`);

      try {
        const testUrl = `/js/common/core/events/visibility_change?test=${Date.now()}`;
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          cache: 'no-cache'
        });

        intercepted = testResponse.headers.get('X-Mocked') === 'true';
        console.log(`Test ${attempts}: Intercepted =`, intercepted);

        if (!intercepted && attempts < 5) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.log(`Test ${attempts} failed:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (intercepted) {
      console.log('🎉 Service Worker is intercepting requests!');
      return true;
    } else {
      console.warn('⚠️ Service Worker registered but not intercepting');
      return false;
    }

  } catch (error) {
    console.error('❌ Force SW reload failed:', error);
    return false;
  }
}

async function loadTestsWithForcedSW() {
  console.log('🔄 Force reloading Service Worker...');

  const swReady = await forceServiceWorkerReload();

  if (swReady) {
    console.log('✅ Service Worker force reload successful');
  } else {
    console.warn('⚠️ Service Worker force reload failed, proceeding anyway');
  }

  const pathMatch = window.location.pathname.match(/\/run\/(.+)/);
  const testPath = pathMatch ? pathMatch[1] : '';

  await import('/js/integration/jquery.js');
  await new Promise(resolve => setTimeout(resolve, 200));

  await Promise.all([
    import('/testing/helpers/esm/jQueryEventsPatch.js'),
    import('/testing/helpers/argumentsValidator.js'),
    import('/testing/helpers/dataPatch.js'),
    import('/js/integration/jquery/component_registrator.js'),
  ]);
  await new Promise(resolve => setTimeout(resolve, 200));

  await import(/* @vite-ignore */`/testing/tests/${testPath}`);

  QUnit.start();
}

loadTestsWithForcedSW();