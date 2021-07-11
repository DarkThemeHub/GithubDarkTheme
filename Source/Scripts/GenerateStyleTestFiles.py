import os
import re
import shutil
import sys

newVersion = str(sys.argv[1])

baseDir = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), os.pardir))

# normalize baseDir between github action or dev environment
if baseDir.startswith("/home/runner/work"):
    baseDir = ""
else:
    baseDir = baseDir + "/"

sourceDir = baseDir + "Source/"

# empty generated Folder
os.makedirs(baseDir + "Generated", exist_ok=True)


themeName = open(sourceDir + "Scripts/ThemeName.txt", "r").read().rstrip()
urlRegex = open(sourceDir + "UrlRegex.txt", "r").read().rstrip()
themeCss = open(sourceDir + "ScssOutput/Theme.css", "r",
                encoding="ASCII", errors="ignore").read()

stylusTemplate = open(sourceDir + "Scripts/StylusTemplate.txt", "r")

stylusFile = stylusTemplate.read()
stylusFile = re.sub("<Version>", newVersion, stylusFile)
stylusFile = re.sub("<ThemeName>", themeName, stylusFile)
stylusFile = re.sub("<Url_Regex>", urlRegex, stylusFile)
stylusFile = re.sub("<Style>", themeCss, stylusFile)
f = open(baseDir + "Generated/Test-github.user.styl", "w")

f.writelines(stylusFile)
f.close

userScriptTemplate = open(sourceDir + "Scripts/UserScriptTemplate.txt", "r")

userScriptFile = userScriptTemplate.read()
userScriptStyle = ""
with open(sourceDir + "ScssOutput/Theme.css", "r") as f:
    for line in f:
        userScriptStyle += "\t\t\"" + re.sub("\"", "\\\"",line.rstrip()) + "\"," + "\n"

userScriptFile = re.sub("<Version>", newVersion, userScriptFile)
userScriptFile = re.sub("<ThemeName>", "Test-" + themeName, userScriptFile)
userScriptFile = re.sub("<Url_Regex>", urlRegex, userScriptFile)
userScriptFile = re.sub("<Style>", userScriptStyle, userScriptFile)
f = open(baseDir + "Generated/Test-github.user.js", "w")

f.writelines(userScriptFile)
f.close

versionFile = open(sourceDir + "Scripts/Version.txt", "w")
versionFile.writelines(newVersion)
versionFile.close
