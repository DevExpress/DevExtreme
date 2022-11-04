import {PagerContractModels, PagerStore} from '@devexpress/core/src/components/pager';
import {ComponentContextContainer, ContextCallbacks, createInjectionToken} from '../../internal/index';

type PagerCallbacks = ContextCallbacks<PagerContractModels>;
type PagerContext = ComponentContextContainer<PagerStore, PagerContractModels>;

const pagerContextFactory = (): PagerContext => ({ context: undefined });
const PAGER_CONTEXT_TOKEN = createInjectionToken('PAGER_TOKEN');


export type {PagerContext, PagerCallbacks};
export {
  pagerContextFactory,
  PAGER_CONTEXT_TOKEN,
}
