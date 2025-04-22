import CustomStore from 'devextreme/data/custom_store';

export const items = new Array(1000).fill(null).map(() => (
  {column1: 1, column2: 2}
));

function isNotEmpty(value: string | undefined | null) {
  return value !== undefined && value !== null && value !== '';
}

const imageCount = 51;
const getImageUrl = (n: number) => {
  if (n === 0) {
    return undefined;
  }
  const name = n < 10 ? `0${n}` : n;
  return `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/images/employees/${name}.png`
}

function addImageToData(data: Record<string, unknown>[]): Record<string, unknown>[] {
  return data.map((item) => ({
    ...item,
    picture: getImageUrl(item.OrderNumber as number % (imageCount + 1))
  }))
}

export const store = new CustomStore({
  key: 'OrderNumber',
  async load(loadOptions) {
    const paramNames = [
      'skip', 'take', 'requireTotalCount', 'requireGroupCount',
      'sort', 'filter', 'totalSummary', 'group', 'groupSummary',
    ];

    const queryString = paramNames
      .filter((paramName) => isNotEmpty(loadOptions[paramName]))
      .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
      .join('&');

    try {
      const response = await fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders?${queryString}`);

      const result = await response.json();

      return {
        data: addImageToData(result.data),
        totalCount: result.totalCount,
        summary: result.summary,
        groupCount: result.groupCount,
      };
    } catch (err) {
      throw new Error('Data Loading Error');
    }
  },
});