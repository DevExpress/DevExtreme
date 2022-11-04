import { DxPager } from '@devexpress/react/pager';
import React, {useCallback, useMemo, useState} from 'react';

const PAGE_SIZES = [
  [15, 30, 45, 60],
  [30, 60, 90],
]

interface IClientPagerState {
  pageCount: number;
  pageSizes: number[];
}

const DEFAULT_CLIENT_PAGER_STATE: IClientPagerState = {
  pageCount: 20,
  pageSizes: PAGE_SIZES[0],
}

function UncontrolledPagerExample() {
  const [pagerState, setPagerState] = useState(DEFAULT_CLIENT_PAGER_STATE);

  const changePageSizesConf = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIdx = +event.target.value;
    setPagerState({
      ...pagerState,
      pageSizes: PAGE_SIZES[selectedIdx]
    });
  }, [pagerState]);

  const changePageCountConf = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const pageCount = +event.target.value;
    setPagerState({
      ...pagerState,
      pageCount,
    })
  }, [pagerState]);

  const handleSelectedPageChange = useCallback(
    (pageNumber: number) => console.log(`Selected page number: %c${pageNumber}`, 'color: green'),
    []);
  const handleSelectedPageSizeChange = useCallback(
    (pageSize: number) => console.log(`Selected page size: %c${pageSize}`, 'color: green'),
    []
  );

  return (
    <div className="example">
      <div className="example__title">
        Uncontrolled pager example
      </div>
      <div className="example__control">
        <DxPager defaultSelectedPage={1}
                 defaultSelectedPageSize={10}
                 pageCount={pagerState.pageCount}
                 pageSizes={pagerState.pageSizes}
                 selectedPageChange={handleSelectedPageChange}
                 selectedPageSizeChange={handleSelectedPageSizeChange}
        />
      </div>
      <div className="example__info">
        <div className="example__play-part">
          <span>Select page sizes:</span>
          <select className="example-input" defaultValue={0} onChange={changePageSizesConf}>
            {
              PAGE_SIZES.map((size, idx) =>
                <option key={idx} value={idx}>[{size.join(',')}]</option>
              )
            }
          </select>
        </div>
        <div className="example__play-part">
          <span>Set page count:</span>
          <input className="example-input" type="number" min="1" value={pagerState.pageCount} onChange={changePageCountConf} />
        </div>
        <div className="example__play-part">
          <div>
            <span>Page count:</span>
            <span>{pagerState.pageCount}</span>
          </div>
          <div>
            <span>Page sizes:</span>
            <span>{pagerState.pageSizes.join(',')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export {UncontrolledPagerExample};
