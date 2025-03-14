const vueLoader = System.import("vue-loader");

export const translate = function (data) {
  const vueSrc = data.source.replace(/\bimport[^;]+;$/gm, function (match) {
    return match.replace(/\s+type\s+/g,' ');
  })

  return vueLoader.then((vueLoader) => {
    return vueLoader.translate({ source: vueSrc });
})
};
