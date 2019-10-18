@echo off
call pkg nolog.js
move nolog-linux release\linux\nolog
move nolog-macos release\macos\nolog-mac
move nolog-win.exe release\win\nolog.exe
