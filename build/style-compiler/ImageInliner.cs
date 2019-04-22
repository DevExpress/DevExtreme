using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;

namespace StyleCompiler
{
    static class ImageInliner
    {
        public static string InlineImages(string css, string sourcePath)
        {
            var pattern = @"(url|data-uri)\(([^)]+)\)";

            return Regex.Replace(
                css,
                pattern,
                m =>
                {
                    var imagePath = StripDataUriMime(m.Groups[2].Value).Split('?')[0];
                    imagePath = imagePath.Trim('"', '\'');
                    if (imagePath.StartsWith("data:"))
                        return m.Value;

                    if (IsFontPath(imagePath))
                    {
                        if (imagePath.Contains("~"))
                        {
                            return m.Value.Replace('"', '\'');
                        }
                        else
                        {
                            return "url(" + imagePath + ")";
                        }
                    }
                    else
                    {
                        imagePath = Path.Combine(sourcePath, "..", imagePath);
                        if (File.Exists(imagePath))
                            return "url(" + GenerateDataUrl(imagePath) + ")";

                        Console.WriteLine("Image not found, " + imagePath);
                        return "";
                    }
                },
                RegexOptions.Singleline
            );
        }

        static string StripDataUriMime(string text)
        {
            return Regex.Replace(text, @"['""]image/.*?(;charset=.*?)?['""]\s*,\s*", "", RegexOptions.IgnoreCase);
        }

        static bool IsFontPath(string path)
        {
            return Regex.Match(path, "(\\.(eot|woff|woff2|ttf)(\\?#\\w*)?['\"]?)$").Success;
        }

        static string GetEncodedUrl(byte[] fileContent, string mime)
        {
             if (mime == "image/svg+xml") {
                var content = HttpUtility.UrlEncode(fileContent).Replace("+", "%20");
                return $@"""data:{mime};charset=UTF-8,{content}""";
            } else {
                var content = Convert.ToBase64String(fileContent);
                return $"data:{mime};base64,{content}";
            }
        }

        static string GenerateDataUrl(string path)
        {
            return GetEncodedUrl(File.ReadAllBytes(path), Utils.GetMime(path));
        }

    }
}
