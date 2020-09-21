call pub get || exit \b 1
call dart2native compiler.dart -o compiler.exe || exit \b 

%cd%\compiler.exe