import { ClientFunction } from 'testcafe';

export default async function updateComponentOptions(options: unknown): Promise<void> {
  await ClientFunction(() => {
    const { onOptionsUpdated } = window as any;
    onOptionsUpdated?.(options);
  }, {
    dependencies: {
      options,
    },
  })();
}
