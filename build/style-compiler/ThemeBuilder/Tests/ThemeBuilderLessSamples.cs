using System;


namespace StyleCompiler.ThemeBuilder.Tests
{
    static class LessSamples
    {

        static readonly string[] lessContent = new string[] {
#region
"@SOME_CONST_1: 12px;\n",

@"/**
* @name Slide out background
* @type color
* @group slideout
* @paletteColorOpacity .7
*/


@ANDROID_SLIDEOUT_BACKGROUND: #000;" + "\n",

"@SOME_CONST_2: 12px;\n",

@"/**
* @name Toolbar border color
* @type color
* @group toolbar
*/

@ANDROID_TOOLBAR_BORDER_COLOR: #33B5E5;" + "\n",

@"/**
* @name Button color
* @type color
* @group button
*/
@ANDROID_DIALOG_BUTTONS_BEFORE_COLOR: rgba(255,255,255,.3);" + "\n",

@"/**
* @name Button background
* @type color
* @group button
*/

@ANDROID_BUTTON_SUCCESS_BACKGROUND: rgb(0,170,0);" + "\n",

@"
@BASE_COLOR: rgb(0,170,0);
/**
* @name Label color
* @type color
* @group label
*/
@ANDROID_TOOLBAR_LABEL_COLOR:  @BASE_COLOR;" + "\n",

@"/**
* @name Toast color   
* @type color   
* @group toast   
*/
@ANDROID_TOAST_TEXT_COLOR: white;" + "\n",

@"/**
* @name Some color
* @type color
* @group unknown
*/
@UNKNOWN_COLOR: unknowncolor;" + "\n",

"@SOME_CONST: 12px;",

"@LIGHTEN_COLOR: lighten(#ff0000, 20%);",

@"/**
* @name Font size
* @type text
* @group common
*/
@FONT_SIZE: Arial;" + "\n",

@"
@COLOR_R: 241;
@COLOR_G: 250;
@COLOR_B: 100;
/**
* @name rgba color
* @type color
* @group common
*/
@RGBA_COLOR: rgba(@COLOR_R, @COLOR_G, @COLOR_B, .5);" + "\n",

"@ANDROID_TOOLBAR_BORDER_COLOR: #33B5E5;" + "\n",

@"
/**
* @name Fade color
* @type color
* @group calculated
*/
@FADE_COLOR: fade(@ANDROID_TOOLBAR_BORDER_COLOR, 50%);" + "\n",

@"
/**
* @name Saturate color
* @type color
* @group calculated
*/
@SATURATE_COLOR: saturate(@ANDROID_TOOLBAR_BORDER_COLOR, 20%);" + "\n",

@"
/**
* @name Desaturate color
* @type color
* @group calculated
*/
@DESATURATE_COLOR: desaturate(@ANDROID_TOOLBAR_BORDER_COLOR, 30%);" + "\n",

@"
/**
* @name Lighten color
* @type color
* @group calculated
*/
@LIGHTEN_COLOR: lighten(@ANDROID_TOOLBAR_BORDER_COLOR, 40%);" + "\n",

@"
/**
* @name Darken color
* @type color
* @group calculated
*/
@DARKEN_COLOR: darken(@ANDROID_TOOLBAR_BORDER_COLOR, 10%);" + "\n",

@"
/**
* @name Fadeout
* @type color
* @group calculated
*/
@FADEOUT_COLOR: fadeout(@ANDROID_TOOLBAR_BORDER_COLOR, 10%);" + "\n",

@"
/**
* @name Fadein
* @type color
* @group calculated
*/
@FADEIN_COLOR: fadein(@ANDROID_TOOLBAR_BORDER_COLOR, 10%);" + "\n",

@"
/**
* @name Inherited color
* @type color
* @group calculated
* @inherit @FADEIN_COLOR
* @isLastSubGroupItem true
*/
@INHERITED_COLOR: #fff;" + "\n",

@"
@ROOT_COLOR: #4BA0E3;
/**
* @name Complex color
* @type color
* @group complex
* @colorFunctions lighten 20, saturate 10
*/
@COMPLEX_COLOR: saturate(lighten(@ROOT_COLOR, 20%), 10%);"

#endregion
        };

        public static string Get(string name)
        {
            switch (name)
            {
                case "theme-1":
                    return String.Join("", lessContent[0], lessContent[1], lessContent[2]);
                case "theme-2":
                    return String.Join("", lessContent[3], lessContent[4], lessContent[5]);
                case "theme-3":
                    return String.Join("", lessContent[6], lessContent[7], lessContent[8], lessContent[9]);
                case "theme-4":
                    return String.Join("", lessContent[10], lessContent[11], lessContent[12]);
                case "theme-5":
                    return String.Join("", lessContent[13], lessContent[14], lessContent[15], lessContent[16], lessContent[17], lessContent[18]);
                case "theme-6":
                    return String.Join("", lessContent[19], lessContent[20], lessContent[21], lessContent[22]);
            }

            throw new NotSupportedException();
        }
    }
}