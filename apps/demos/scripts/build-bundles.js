const { copyBundlesFolder, build } = require('../utils/bundle');

async function main() {
  copyBundlesFolder();
  console.log('copy-bundles: done');

  const frameworks = ['vue', 'angular', 'react'];
  await Promise.all(
    frameworks.map(async (framework) => {
      console.log(`bundle-${framework}: starting...`);
      await build(framework);
      console.log(`bundle-${framework}: done`);
    })
  );

  console.log('build-bundles: done');
}

main().catch((err) => {
  console.error('build-bundles failed:', err);
  process.exit(1);
});
