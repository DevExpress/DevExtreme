using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace StyleCompiler
{
    [Route("test-server")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class TestServerController : Controller
    {

        [Route("known-css-files")]
        public void KnownCssFiles()
        {
            var paths = from distributionName in LessRegistry.CssDistributions.Keys
                        from item in LessAggregation.EnumerateAllItems(Utils.GetStylesPath(), distributionName)
                        select item.CssFile.GetFileName();

            Response.ContentType = "text/javascript";

            using (var writer = new StreamWriter(Response.Body))
            {
                writer.Write("window.knownCssFiles = ");
                writer.Write(JsonConvert.SerializeObject(paths));
            }
        }

        [Route("less-handler")]
        public void LessHandler()
        {
            Response.ContentType = "text/css";
            new LessHandlerImpl(Utils.GetStylesPath()).ProcessRequest(Request.Query, Response.Body);
        }

        [Route("images")]
        public void Images(string path)
        {
            Utils.SendFile(Path.Combine(Utils.GetRepoRootPath(), path), Response);
        }

        [Route("icons")]
        public void Icons(string path)
        {
            Utils.SendFile(Path.Combine(Utils.GetRepoRootPath(), path), Response);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            context.HttpContext.Response.Headers["Access-Control-Allow-Origin"] = "*";
        }

    }
}
