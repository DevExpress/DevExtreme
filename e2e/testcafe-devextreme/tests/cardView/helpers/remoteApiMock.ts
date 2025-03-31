import { RequestMock } from 'testcafe';

export const remoteData = new Array(10)
  .fill(null)
  .map((_, idx) => ({
    id: idx, A: `A_${idx}`, B: `B_${idx}`, C: `C_${idx}`,
  }));

export const remoteDataGroupedByA = new Array(10)
  .fill(null)
  .map((_, idx) => ({
    key: `A_${idx}`,
    items: null,
  }));

export const remoteApiMock = RequestMock()
  .onRequestTo(/\/api\/data\?.*group=/)
  .respond(
    {
      data: remoteDataGroupedByA,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data/)
  .respond(
    {
      data: remoteData,
    },
    200,
    { 'access-control-allow-origin': '*' },
  );
