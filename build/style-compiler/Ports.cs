using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace StyleCompiler
{
    static class Ports
    {
        static readonly IDictionary<string, int> _dict;

        static Ports()
        {
            var json = File.ReadAllText(Path.Combine(Utils.GetRepoRootPath(), "ports.json"));
            _dict = JsonConvert.DeserializeObject<IDictionary<string, int>>(json);

        }

        public static int Get(string key)
        {
            return _dict[key];
        }
    }
}
