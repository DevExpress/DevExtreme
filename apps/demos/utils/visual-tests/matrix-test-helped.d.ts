import 'testcafe';

type FrameworkType = 'jQuery' | 'React' | 'Angular' | 'Vue';

export function runManualTest(product: string, demo: string, framework: FrameworkType | ArrayLike<FrameworkType>, callback: (test: TestFn) => void): void;
