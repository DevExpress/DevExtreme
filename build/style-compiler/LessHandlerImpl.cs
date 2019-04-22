using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace StyleCompiler
{

    class LessHandlerImpl
    {
        string _sourcePath;

        public LessHandlerImpl(string sourcePath)
        {
            _sourcePath = sourcePath;
        }

        public void ProcessRequest(IQueryCollection queryString, Stream responseBody)
        {
            var allLessPaths = from segment in CreateAggregationItem(queryString).Segments
                               from fileName in segment.LessFiles
                               select Path.Combine(_sourcePath, fileName);

            var css = LessAggregation.CompileLessPaths(allLessPaths);
            css = NormalizeUrls(css);

            if (queryString.ContainsKey("disable_font_face"))
                css = css.Replace("@font-face", "@disabled-font-face");

            using (var writer = new StreamWriter(responseBody))
            {
                writer.Write(css);
            }
        }

        LessAggregation.Item CreateAggregationItem(IQueryCollection queryString)
        {
            var distributionName = queryString["d"];
            var isCommon = queryString.ContainsKey("common");

            if (isCommon)
                return LessAggregation.CreateCommonItem(distributionName);

            var themeName = queryString["t"];
            var colorSchemeName = queryString["cs"];
            var sizeSchemeName = queryString["ss"];
            var theme = LessRegistry.KnownThemeMap[themeName];

            return LessAggregation.CreateThemeItem(_sourcePath, distributionName, theme, colorSchemeName, sizeSchemeName);
        }

        string NormalizeUrls(string css)
        {
            return Regex.Replace(css, @"url\((.+?)\)", m =>
            {
                var url = m.Groups[1].Value;

                if (url.Contains("data:"))
                {
                    return m.Value;
                }

                if (url.StartsWith("images/"))
                {
                    return $"url(/test-server/images?path={Uri.EscapeDataString(url)})";
                }

                if (url.StartsWith("icons/"))
                {
                    return $"url(/test-server/icons?path={Uri.EscapeDataString(url)})";
                }

                throw new NotSupportedException("Unknown url prefix: " + url);
            });
        }

    }

}
