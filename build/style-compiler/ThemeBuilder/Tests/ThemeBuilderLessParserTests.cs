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
                Name = "Slide out background"
            }, metadata1[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOOLBAR_BORDER_COLOR",
                Name = "Toolbar border color"
            }, metadata2[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_DIALOG_BUTTONS_BEFORE_COLOR",
                Name = "Button color"
            }, metadata2[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_BUTTON_SUCCESS_BACKGROUND",
                Name = "Button background"
            }, metadata2[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOOLBAR_LABEL_COLOR",
                Name = "Label color"
            }, metadata3[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@ANDROID_TOAST_TEXT_COLOR",
                Name = "Toast color"
            }, metadata3[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@UNKNOWN_COLOR",
                Name = "Some color"
            }, metadata3[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@FONT_SIZE",
                Name = "Font size"
            }, metadata4[0]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@RGBA_COLOR",
                Name = "rgba color"
            }, metadata4[1]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@INHERITED_COLOR",
                Name = "Inherited color"
            }, metadata5[2]);

            CheckMetadata(new ThemeBuilderMetadata
            {
                Key = "@COMPLEX_COLOR",
                Name = "Complex color"
            }, metadata5[3]);
        }

    }
}