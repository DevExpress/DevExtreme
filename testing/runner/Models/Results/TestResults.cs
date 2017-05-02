using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using System.Text;
using System.Xml;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace Runner.Models.Results
{
    [XmlRoot("test-results")]
    public class TestResults
    {
        [XmlAttribute]
        public string name;

        [XmlAttribute]
        public int total;

        [XmlAttribute]
        public int failures;

        [XmlElement("test-suite", typeof(TestSuite))]
        public List<TestSuite> suites;

        public string ToXmlText()
        {
            var ns = new XmlSerializerNamespaces();
            ns.Add("", "");

            var builder = new StringBuilder();
            using (var wr = XmlWriter.Create(builder, new XmlWriterSettings { OmitXmlDeclaration = true, Indent = true }))
            {
                new XmlSerializer(typeof(TestResults)).Serialize(wr, this, ns);
            }
            return builder.ToString();
        }

        class ResultItemConverter : JsonConverter
        {
            public override bool CanConvert(Type objectType)
            {
                return typeof(ResultItem).IsAssignableFrom(objectType);
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var raw = JObject.Load(reader);
                var result = InstantiateItem((string)raw["__type"]);
                serializer.Populate(raw.CreateReader(), result);
                return result;
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                throw new NotImplementedException();
            }

            static object InstantiateItem(string id)
            {
                if (id == "case")
                    return new TestCase();
                if (id == "suite")
                    return new TestSuite();

                throw new NotImplementedException();
            }
        }

        public static TestResults LoadFromJson(string json)
        {
            return JsonConvert.DeserializeObject<TestResults>(json, new ResultItemConverter());
        }
    }

}
