using System;
using System.Collections.Generic;

namespace StyleCompiler
{
    static class LicenseHeaderHelper
    {
        static readonly string Template = String.Join("\n",
            "/*!",
            "* $ProductName$",
            "* Version: $Version$",
            "* Build date: $BuildDate$",
            "*",
            "* Copyright (c) $CopyrightYears$ Developer Express Inc. ALL RIGHTS RESERVED",
            "* Read about DevExtreme licensing here: $LicenseUrl$",
            "*/"
        );

        public static string FormatForCssDistribution(string distributionName, string version)
        {
            var data = new Dictionary<string, string> {
                { "ProductName", LessRegistry.CssDistributions[distributionName].PublicName },
                { "LicenseUrl", LessRegistry.CssDistributions[distributionName].LicenseInfo }
            };

            data["Version"] = version;
            data["BuildDate"] = DateTime.Now.ToString("MMM d, yyyy");
            data["CopyrightYears"] = "2012 - " + DateTime.Now.Year;

            var result = Template;

            foreach (var key in data.Keys)
            {
                result = result.Replace("$" + key + "$", data[key]);
            }

            return result;

        }

    }
}
