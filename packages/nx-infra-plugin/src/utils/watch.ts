import * as path from 'path';
import { createRequire } from 'module';
import { logger } from '@nx/devkit';

export const DEFAULT_WATCH_DEBOUNCE_MS = 200;

export interface ChokidarWatcher {
  on: (event: string, handler: (...args: unknown[]) => void) => unknown;
  close: () => Promise<void> | void;
}

export interface Chokidar {
  watch: (paths: string | string[], options?: Record<string, unknown>) => ChokidarWatcher;
}

// chokidar is a root devDependency, not a dependency of this plugin (and not the same
// chokidar gulp-watch bundles internally) — resolve it from the project root at runtime.
export function loadChokidar(projectRoot: string): Chokidar {
  const projectRequire = createRequire(path.join(projectRoot, 'package.json'));
  try {
    return projectRequire('chokidar') as Chokidar;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `watch mode requires 'chokidar' to be installed in the project (${projectRoot}): ${message}`,
    );
  }
}

export interface WatchEvent {
  event: string;
  filePath: string;
}

export interface WatchWithChokidarOptions {
  projectRoot: string;
  /** Concrete files or directories to watch (chokidar v4 has no glob support). */
  watchTargets: string | string[];
  /** Label used in watch log messages. */
  label: string;
  /** Rebuild callback invoked with the batch of events; debounced while idle, queued to run again immediately once a running rebuild finishes. */
  onRebuild: (events: WatchEvent[]) => Promise<void> | void;
  /** Optional filter deciding whether a raw chokidar event is relevant. */
  eventFilter?: (event: string, filePath: string) => boolean;
  debounceMs?: number;
  chokidarOptions?: Record<string, unknown>;
}

// Resolves on SIGINT/SIGTERM. Doesn't run an initial build — that's on the caller.
export async function watchWithChokidar(options: WatchWithChokidarOptions): Promise<void> {
  const {
    projectRoot,
    watchTargets,
    label,
    onRebuild,
    eventFilter,
    debounceMs = DEFAULT_WATCH_DEBOUNCE_MS,
    chokidarOptions,
  } = options;

  await new Promise<void>((resolve) => {
    let timer: NodeJS.Timeout | undefined;
    let busy = false;
    let pending = false;
    let batch: WatchEvent[] = [];

    const runRebuild = async (): Promise<void> => {
      if (busy) {
        pending = true;
        return;
      }

      const events = batch;
      batch = [];
      busy = true;
      try {
        await onRebuild(events);
        logger.verbose(`${label}: rebuild complete`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`${label} rebuild failed: ${message}`);
      } finally {
        busy = false;
        if (pending) {
          pending = false;
          void runRebuild();
        }
      }
    };

    const scheduleRebuild = (): void => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        void runRebuild();
      }, debounceMs);
    };

    const chokidar = loadChokidar(projectRoot);
    const watcher = chokidar.watch(watchTargets, { ignoreInitial: true, ...chokidarOptions });

    watcher.on('all', (...args: unknown[]) => {
      const [event, filePath] = args as [string, string];
      if (eventFilter && !eventFilter(event, filePath)) {
        return;
      }
      batch.push({ event, filePath });
      scheduleRebuild();
    });

    logger.verbose(`${label} is watching for changes...`);

    const stopWatcher = (): void => {
      if (timer) {
        clearTimeout(timer);
      }
      void Promise.resolve(watcher.close()).finally(resolve);
    };

    process.once('SIGINT', stopWatcher);
    process.once('SIGTERM', stopWatcher);
  });
}
