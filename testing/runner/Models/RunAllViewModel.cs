using System.Collections.Generic;
using Runner.Models.UI;

namespace Runner.Models
{
    public class RunAllViewModel : BaseRunViewModel
    {
        public string Constellation { get; set; }
        public string CategoriesList { get; set; }
        public string Version { get; set; }
        public IEnumerable<Suite> Suites { get; set; }
    }
}
