@echo off
call pkg nolog.js
move nolog-linux release\linux\nolog
move nolog-macos release\macos\nolog
move nolog-win.exe release\win\nolog

