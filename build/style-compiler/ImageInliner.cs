using System;
using System.IO;
using System.Text.RegularExpressions;

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
                            return "url(icons/" + Path.GetFileName(imagePath) + ")";
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
            return Regex.Match(path, "(\\.(eot|woff|ttf)(\\?#\\w*)?['\"]?)$").Success;
        }

        static string GenerateDataUrl(string path)
        {
            return "data:"
                + Utils.GetMime(path)
                + ";base64,"
                + Convert.ToBase64String(File.ReadAllBytes(path));
        }

    }
}
