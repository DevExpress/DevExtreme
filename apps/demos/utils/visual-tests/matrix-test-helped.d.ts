import 'testcafe';

type FrameworkType = 'jQuery' | 'React' | 'Angular' | 'Vue';

export function runManualTest(product: string, demo: string, callback: (test: TestFn) => void): void;
