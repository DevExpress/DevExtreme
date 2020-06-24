using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using Directory = System.IO.Directory;
using Path = System.IO.Path;

namespace Runner.Controllers
{
    [Route("themes-test")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class ThemesTestController : Controller {
        string _bundlesPath;
        public ThemesTestController(IHostingEnvironment env)
        {
            _bundlesPath = Path.Combine(env.ContentRootPath, "scss", "bundles");
        }

        [Route("get-css-files-list")]
        public IActionResult GetCssFilesList() {
            var fileNames = from bundleDirectory
                in Directory.EnumerateDirectories(_bundlesPath)
                from fullFilename
                in Directory.EnumerateFiles(bundleDirectory, "*.scss")
                select Path.GetFileNameWithoutExtension(fullFilename) + ".css";

            return Json(fileNames);
        }
    }
}
