using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Microsoft.Extensions.PlatformAbstractions;

namespace StyleCompiler
{

    class PersistentCache
    {
        public static readonly PersistentCache Instance;

        static PersistentCache()
        {
            Instance = new PersistentCache(
                Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "style_compiler_persistent_cache"),
                new[] { typeof(PersistentCache).GetTypeInfo().Assembly }
            );
            Instance.Debug = true;
            Instance.Enabled = !Utils.IsContinuousIntegration();
        }

        string _storageDir;
        DateTime _binariesDate;

        public bool Enabled = true;
        public bool Debug;

        public PersistentCache(string storageDir, Assembly[] binaryDependencies)
        {
            _storageDir = storageDir;
            if (!Directory.Exists(_storageDir))
                Directory.CreateDirectory(_storageDir);

            _binariesDate = binaryDependencies.Select(i => i.Location).Select(File.GetLastWriteTime).Max();
        }

        public IDictionary<string, string> Get(string[] key, IEnumerable<string> dependentPaths, Func<Dictionary<string, string>> generator)
        {
            if (!Enabled)
                return generator();

            var cacheFile = Path.Combine(_storageDir, String.Join("&", key.Select(Uri.EscapeDataString)));
            if (CanUseCacheFile(cacheFile, key, dependentPaths))
                return Load(cacheFile);

            var data = generator();
            Save(cacheFile, data);
            return data;
        }

        bool CanUseCacheFile(string cacheFile, string[] key, IEnumerable<string> dependentPaths)
        {
            if (!File.Exists(cacheFile))
            {
                if (Debug)
                    PrintDebug(key, "missing entry");
                return false;
            }

            var cacheDate = File.GetLastWriteTime(cacheFile);
            if (_binariesDate >= cacheDate)
            {
                if (Debug)
                    PrintDebug(key, "binaries changed");
                return false;
            }

            var changedFiles = dependentPaths.Where(i => File.GetLastWriteTime(i) >= cacheDate).ToArray();
            if (changedFiles.Any())
            {
                if (Debug)
                    PrintDebug(key, "changed files: " + String.Join(", ", changedFiles.Select(Path.GetFileName)));
                return false;
            }

            return true;
        }

        void Save(string cacheFile, IDictionary<string, string> data)
        {
            using (var stream = File.OpenWrite(cacheFile))
            using (var writer = new BinaryWriter(stream, Encoding.Unicode))
            {
                stream.SetLength(0);
                writer.Write(data.Count);
                foreach (var entry in data)
                {
                    writer.Write(entry.Key);
                    writer.Write(entry.Value);
                }
            }
        }

        IDictionary<string, string> Load(string cacheFile)
        {
            var result = new Dictionary<string, string>();
            using (var stream = File.OpenRead(cacheFile))
            using (var reader = new BinaryReader(stream, Encoding.Unicode))
            {
                var count = reader.ReadInt32();
                while (count > 0)
                {
                    var key = reader.ReadString();
                    var value = reader.ReadString();
                    result[key] = value;
                    count--;
                }
            }
            return result;
        }

        void PrintDebug(string[] key, string message)
        {
            Console.WriteLine("  PersistentCache(" + String.Join(", ", key) + "): " + message);
        }

    }
}
