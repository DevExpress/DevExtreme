using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Runner.Models.Results;

namespace Runner.Tools
{
    public static class ExtensionMethods
    {
        public static IHtmlContent ContentWithCacheBuster(this IUrlHelper url, string contentPath)
        {
            var cacheBuster = CacheBuster(url).ToString();
            var result = url.Content(contentPath).ToString();

            if (!String.IsNullOrEmpty(cacheBuster))
                result += (result.Contains("?") ? "&" : "?") + cacheBuster;

            return new HtmlString(result);
        }

        public static IHtmlContent CacheBuster(this IUrlHelper url)
        {
            var key = "DX_HTTP_CACHE";
            var value = url.ActionContext.HttpContext.Request.Query[key];
            var result = "";

            if (!String.IsNullOrEmpty(value))
                result += key + "=" + value;

            return new HtmlString(result);
        }

        public static IEnumerable<TestCase> EnumerateAllCases(this TestSuite suite)
        {
            foreach (var item in suite.results)
            {
                var innerSuite = item as TestSuite;

                if (innerSuite != null)
                {
                    foreach (var innerTest in innerSuite.EnumerateAllCases())
                        yield return innerTest;
                }
                else
                {
                    yield return item as TestCase;
                }
            }
        }

        public static void PrintTextReport(this TestResults results)
        {
            const int maxWrittenFailures = 50;

            var notRunCases = (from s in results.suites
                               from test in s.EnumerateAllCases().Where(c => c.reason != null)
                               select test).ToArray();

            var writtenFailures = 0;
            var separator = "".PadLeft(80, '-');

            ConsoleHelper.WriteLine($"Tests run: {results.total}, Failures: {results.failures}, Not run: {notRunCases.Length}",
                    results.failures > 0 ? ConsoleColor.Red : notRunCases.Length > 0 ? ConsoleColor.Yellow : ConsoleColor.Green);

            if (notRunCases.Length > 0 && results.failures == 0)
            {
                foreach (var @case in notRunCases)
                {
                    ConsoleHelper.WriteLine(separator);
                    ConsoleHelper.WriteLine("Skipped: " + @case.name);
                    ConsoleHelper.WriteLine("Reason: " + @case.reason.message);
                }
            }

            if (results.failures > 0)
            {
                var failedCases = from s in results.suites
                                  from test in s.EnumerateAllCases().Where(c => c.failure != null)
                                  select test;

                foreach (var @case in failedCases)
                {
                    ConsoleHelper.WriteLine(separator);

                    ConsoleHelper.WriteLine(@case.name, ConsoleColor.White);

                    ConsoleHelper.WriteLine();
                    ConsoleHelper.WriteLine(@case.failure.message);

                    writtenFailures++;

                    if (writtenFailures >= maxWrittenFailures)
                    {
                        ConsoleHelper.WriteLine($"WARNING: only first {maxWrittenFailures} failures are shown.");
                        break;
                    }
                }
            }
        }

    }

}
