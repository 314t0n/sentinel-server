tasklist /fi "imagename eq mongod.exe" |find "=" > nul
if errorlevel 1 mongod %1 %2
exit 0