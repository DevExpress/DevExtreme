using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.PlatformAbstractions;

namespace StyleCompiler
{
    static class Utils
    {
        public static string GetRepoRootPath()
        {
            return Path.GetFullPath(
                Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "../../..")
            );
        }

        public static string GetStylesPath()
        {
            return Path.Combine(GetRepoRootPath(), "styles");
        }

        public static void SendFile(string path, HttpResponse res)
        {
            res.ContentType = GetMime(path);
            using (var stream = File.OpenRead(path))
            {
                stream.CopyTo(res.Body);
            }
        }

        public static string GetMime(string path)
        {
            switch (Path.GetExtension(path))
            {
                case ".eot": return "application/vnd.ms-fontobject";
                case ".ttf": return "application/font-sfnt";
                case ".woff": return "application/font-woff";
                case ".woff2": return "application/font-woff2";
                case ".png": return "image/png";
                case ".gif": return "image/gif";
                case ".svg": return "image/svg+xml";
            }

            return "application/octet-stream";
        }

        public static bool IsContinuousIntegration()
        {
            return !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("CCNetWorkingDirectory"))
                || IsDocker();
        }

        public static bool IsDocker()
        {
            return !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("DEVEXTREME_DOCKER_CI"));
        }

        public static bool IsQUnitCI() {
            return !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("DEVEXTREME_QUNIT_CI"));
        }
    }
}
