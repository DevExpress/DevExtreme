export function getAccentColorScheme(accentColor: string): Record<string, string | object> {
  return {
    rangeSelector: {
      selectedRangeColor: accentColor,
      sliderMarker: {
        color: accentColor,
      },
      sliderHandle: {
        color: accentColor,
      },
    },

    map: {
      'layer:marker:dot': {
        color: accentColor,
      },
      'layer:marker:bubble': {
        color: accentColor,
      },
      legend: {
        markerColor: accentColor,
      },
    },

    bullet: {
      color: accentColor,
    },

    gauge: {
      valueIndicators: {
        rangebar: {
          color: accentColor,
        },
        // eslint-disable-next-line spellcheck/spell-checker
        textcloud: {
          color: accentColor,
        },
      },
    },
  };
}
