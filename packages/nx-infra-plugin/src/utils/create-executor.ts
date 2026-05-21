import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { resolveProjectPath } from './path-resolver';
import { logError } from './error-handler';

const DEFAULT_ERROR_SUFFIX = 'executor failed';

export interface ExecutorRuntime {
  projectRoot: string;
  context: ExecutorContext;
}

export type ResolveFn<TOptions, TResolved> = (
  options: TOptions,
  runtime: ExecutorRuntime,
) => TResolved | Promise<TResolved>;

export type ImplementationFn<TOptions, TResolved> = (
  resolved: TResolved,
  options: TOptions,
  runtime: ExecutorRuntime,
) => Promise<void>;

export interface ExecutorDefinition<TOptions, TResolved = TOptions> {
  name: string;
  resolve: ResolveFn<TOptions, TResolved>;
  run: ImplementationFn<TOptions, TResolved>;
}

export function createExecutor<TOptions, TResolved>(
  definition: ExecutorDefinition<TOptions, TResolved>,
): PromiseExecutor<TOptions> {
  return async (options, context) => {
    try {
      const projectRoot = resolveProjectPath(context);
      const runtime: ExecutorRuntime = { projectRoot, context };
      const resolved = await definition.resolve(options, runtime);
      await definition.run(resolved, options, runtime);
      return { success: true };
    } catch (error) {
      logError(`${definition.name} ${DEFAULT_ERROR_SUFFIX}`, error);
      return { success: false };
    }
  };
}
