using System.Collections.Generic;
using Xunit;

namespace StyleCompiler.ThemeBuilder.Tests
{

    public class LessParserTests
    {
        void CheckMetadata(ThemeBuilderMetadata expected, ThemeBuilderMetadata metadata)
        {
            Assert.Equal(expected.Key, metadata.Key);
            Assert.Equal(expected.Name, metadata.Name);
            Assert.Equal(expected.Type, metadata.Type);
            Assert.Equal(expected.Group, metadata.Group);
            Assert.Equal(expected.PaletteColorOpacity, metadata.PaletteColorOpacity);
            Assert.Equal(expected.Inherit, metadata.Inherit);
            Assert.Equal(expected.IsLastSubGroupItem, metadata.IsLastSubGroupItem);
            Assert.Equal(expected.ColorFunctions, metadata.ColorFunctions);
        }

        [Fact]
        public void GenerateThemeBuilderMetadata()
        {
            List<ThemeBuilderMetadata> metadata1 = new ThemeBuilderLessParser(LessSamples.Get("theme-1")).GenerateThemeBuilderMetadata();
            List<ThemeBuilderMetadata> metadata2 = new ThemeBuilderLessParser(LessSamples.Get("theme-2")).GenerateThemeBuilderMetadata();
            List<ThemeBuilderMetadata> metadata3 = new ThemeBuilderLessParser(LessSamples.Get("theme-3")).GenerateThemeBuilderMetadata();
            List<ThemeBuilderMetadata> metadata4 = new ThemeBuilderLessParser(LessSamples.Get("theme-4")).GenerateThemeBuilderMetadata();
            List<ThemeBuilderMetadata> metadata5 = new ThemeBuilderLessParser(LessSamples.Get("theme-6")).GenerateThemeBuilderMetadata();

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_SLIDEOUT_BACKGROUND",
                Name = "Slide out background",
                Type = "color",
                Group = "slideout",
                PaletteColorOpacity = ".7"
            }, metadata1[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOOLBAR_BORDER_COLOR",
                Name = "Toolbar border color",
                Type = "color",
                Group = "toolbar"
            }, metadata2[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_DIALOG_BUTTONS_BEFORE_COLOR",
                Name = "Button color",
                Type = "color",
                Group = "button"
            }, metadata2[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_BUTTON_SUCCESS_BACKGROUND",
                Name = "Button background",
                Type = "color",
                Group = "button"
            }, metadata2[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOOLBAR_LABEL_COLOR",
                Name = "Label color",
                Type = "color",
                Group = "label"
            }, metadata3[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOAST_TEXT_COLOR",
                Name = "Toast color",
                Type = "color",
                Group = "toast"
            }, metadata3[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@UNKNOWN_COLOR",
                Name = "Some color",
                Type = "color",
                Group = "unknown"
            }, metadata3[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@FONT_SIZE",
                Name = "Font size",
                Type = "text",
                Group = "common"
            }, metadata4[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@RGBA_COLOR",
                Name = "rgba color",
                Type = "color",
                Group = "common",
                IsLastSubGroupItem = false
            }, metadata4[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@INHERITED_COLOR",
                Name = "Inherited color",
                Type = "color",
                Group = "calculated",
                IsLastSubGroupItem = true
            }, metadata5[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@COMPLEX_COLOR",
                Name = "Complex color",
                Type = "color",
                Group = "complex",
                ColorFunctions = "lighten 20, saturate 10"
            }, metadata5[3]);
        }

    }
}