using System;
using System.Collections.Generic;
using System.Linq;
using Runner.Models.UI;
using System.IO;
using System.Collections;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace Runner.Tools
{
    public class UIModelHelper
    {
        // constellation is a set of categories, they are defined in __meta.json files inside category directories
        static readonly ICollection<string> KnownConstellations = new HashSet<string> { "export", "misc", "ui", "ui.editors", "ui.grid", "ui.scheduler", "viz", "perf" };

        UrlHelper UrlHelper;
        string TestsRootPath;

        public UIModelHelper(ActionContext actionContext, IHostingEnvironment env)
        {
            UrlHelper = new UrlHelper(actionContext);
            TestsRootPath = Path.Combine(env.ContentRootPath, "testing/tests");
        }

        public IEnumerable<Category> ReadCategories()
        {
            return Directory.GetDirectories(TestsRootPath)
                .Where(IsNotEmptyDir)
                .Select(p => CategoryFromPath(p))
                .OrderBy(c => c.Name);
        }

        public IEnumerable<Suite> ReadSuites(string catName)
        {
            var catPath = Path.Combine(TestsRootPath, catName);

            foreach (var path in Directory.GetDirectories(catPath))
            {
                if (!path.EndsWith("Parts"))
                    throw new Exception("Unexpected sub-directory in the test category: " + path);
            }

            return Directory.GetFiles(catPath, "*.js")
                .Select(p => SuiteFromPath(catName, p))
                .OrderBy(s => s.ShortName);
        }

        public string GetSuiteVirtualPath(string catName, string suiteName)
        {
            return String.Format("~/testing/tests/{0}/{1}", catName, suiteName);
        }

        public IEnumerable<Suite> GetAllSuites(bool deviceMode, string constellation, ISet<string> includeCategories, ISet<string> excludeCategories)
        {
            var includesSpecified = includeCategories != null && includeCategories.Any();
            var excludesSpecified = excludeCategories != null && excludeCategories.Any();

            foreach (var cat in ReadCategories())
            {
                if (deviceMode && !cat.RunOnDevices)
                    continue;

                if (!String.IsNullOrEmpty(constellation) && cat.Constellation != constellation)
                    continue;

                if (includesSpecified && !includeCategories.Contains(cat.Name))
                    continue;

                if (cat.Explicit)
                {
                    if (!includesSpecified || !includeCategories.Contains(cat.Name))
                        continue;
                }

                if (excludesSpecified && excludeCategories.Contains(cat.Name))
                    continue;

                foreach (var suite in ReadSuites(cat.Name))
                    yield return suite;
            }
        }


        Category CategoryFromPath(string path)
        {
            var name = Path.GetFileName(path);
            var meta = JsonConvert.DeserializeObject<IDictionary>(File.ReadAllText(Path.Combine(path, "__meta.json")));
            var constellation = (String)meta["constellation"];

            if (!KnownConstellations.Contains(constellation))
                throw new ArgumentException("Unknown constellation (group of categories):" + constellation);

            return new Category
            {
                Name = name,
                Constellation = constellation,
                Explicit = (bool)meta["explicit"],
                RunOnDevices = (bool)meta["runOnDevices"]
            };
        }

        Suite SuiteFromPath(string catName, string path)
        {
            return new Suite
            {
                ShortName = Path.GetFileNameWithoutExtension(path),
                FullName = catName + "/" + Path.GetFileName(path),
                Url = UrlHelper.Action("RunSuite", "Main", new { catName = catName, suiteName = Path.GetFileName(path) })
            };
        }

        static bool IsNotEmptyDir(string path)
        {
            return Directory.EnumerateFileSystemEntries(path).Any();
        }

    }

}
