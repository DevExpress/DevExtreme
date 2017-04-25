using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;

namespace Runner
{
    static class Ports
    {
        static IDictionary<string, int> _dict;

        public static void Load(string path)
        {
            var json = File.ReadAllText(path);
            _dict = JsonConvert.DeserializeObject<IDictionary<string, int>>(json);
        }

        public static int Get(string key)
        {
            return _dict[key];
        }

    }
}
