using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StyleCompiler
{

    class CompiledLessCache
    {
        ConcurrentDictionary<string, string> _SegmentCache = new ConcurrentDictionary<string, string>();
        string _sourcePath;

        public CompiledLessCache(string sourcePath)
        {
            _sourcePath = sourcePath;
        }

        public void Inflate(PersistentCache persistentCache)
        {
            var knownSegments = new HashSet<string>();
            var parallelTasks = new List<Task>();

            foreach (var distributionName in LessRegistry.CssDistributions.Keys)
            {
                foreach (var item in LessAggregation.EnumerateAllItems(_sourcePath, distributionName))
                {
                    LessAggregation.CheckLessDuplicates(item);

                    foreach (var segment in item.Segments)
                    {
                        if (knownSegments.Contains(segment.Key))
                            continue;

                        knownSegments.Add(segment.Key);
                        parallelTasks.Add(new Task(delegate ()
                        {
                            var paths = segment.LessFiles.Select(i => Path.Combine(_sourcePath, i));
                            var bag = persistentCache.Get(new[] { "css", segment.Key }, paths, delegate ()
                            {
                                if (distributionName == LessRegistry.CSS_DISTRIBUTION_DEFAULT)
                                    CheckUnusedLessConsts(paths);

                                var css = LessAggregation.CompileLessPaths(paths);
                                css = ImageInliner.InlineImages(css, _sourcePath);
                                css = CssHelper.StripCommentsOnly(css);
                                return new Dictionary<string, string> {
                                    { "_", css }
                                };
                            });
                            _SegmentCache[segment.Key] = bag["_"];
                        }));
                    }
                }
            }

            foreach (var t in parallelTasks)
            {
                t.Start();
                if (Utils.IsDocker())
                {
                    // limit CPU usage in Docker builds
                    t.Wait();
                }
            }

            Task.WaitAll(parallelTasks.ToArray());
        }

        public string GetCssForSegment(string segmentKey)
        {
            return _SegmentCache[segmentKey];
        }

        static void CheckUnusedLessConsts(IEnumerable<string> paths)
        {
            var lessContent = new StringBuilder();
            foreach (var path in paths)
            {
                lessContent.AppendLine(LessAggregation.InlineImports(path));
            }

            var lessContentWithoutComments = CssHelper.StripCommentsOnly(lessContent.ToString());
            var matches = Regex.Matches(lessContentWithoutComments, "@\\{?(\\w[-\\w\\d]*)\\}?", RegexOptions.Multiline);
            var counts = new Dictionary<string, int>();
            var cssConst = new[] { "charset", "font-face", "import", "media", "page" };

            foreach (Match match in matches)
            {
                var text = match.Groups[1].Value;
                if (cssConst.Contains(text))
                    continue;
                if (!counts.ContainsKey(text))
                    counts[text] = 1;
                else
                    counts[text]++;
            }

            var failures = counts.Where(entry => entry.Value == 1).ToArray();
            if (failures.Length > 0)
            {
                foreach (var entry in failures)
                {
                    Console.WriteLine("Warning: " + entry.Key + " is unused");
                }

                throw new Exception("Unused LESS consts were found");
            }

        }
    }
}
