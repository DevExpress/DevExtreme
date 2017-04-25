using System.Text.RegularExpressions;

namespace StyleCompiler
{
    static class CssHelper
    {
        public static string StripCommentsOnly(string code)
        {
            code = Regex.Replace(code, @"\s*\/\*.*?\*\/", "", RegexOptions.Singleline);
            code = Regex.Replace(code, @"[\r\n]+", "\n");
            code = code.Trim();

            return code;
        }
    }
}
