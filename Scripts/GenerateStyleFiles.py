import os
import re
import shutil
import sys

newVersion = str(sys.argv[1])

baseDir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
# normalize baseDir between github action or dev environment
if baseDir.startswith("/home/runner/work"):
    baseDir = ""
else:
    baseDir = baseDir + "/"

# empty generated Folder
shutil.rmtree(baseDir + "Generated", ignore_errors=True)
os.makedirs(baseDir + "Generated", exist_ok=True)

themeName = open(baseDir + "Scripts/ThemeName.txt", "r").read().rstrip()
urlRegex = open(baseDir + "UrlRegex.txt", "r").read().rstrip()
themeCss = open(baseDir + "ScssOutput/Theme.css", "r",
                encoding="ASCII", errors="ignore").read()

stylusTemplate = open(baseDir + "Scripts/StylusTemplate.txt", "r")

stylusFile = stylusTemplate.read()
stylusFile = re.sub("<Version>", newVersion, stylusFile)
stylusFile = re.sub("<ThemeName>", themeName, stylusFile)
stylusFile = re.sub("<Url_Regex>", urlRegex, stylusFile)
stylusFile = re.sub("<Style>", themeCss, stylusFile)
f = open(baseDir + "Generated/github.user.styl", "w")

f.writelines(stylusFile)
f.close

userScriptTemplate = open(baseDir + "Scripts/UserScriptTemplate.txt", "r")

userScriptFile = userScriptTemplate.read()
userScriptStyle = ""
with open(baseDir + "ScssOutput/Theme.css", "r") as f:
    for line in f:
        userScriptStyle += "\t\t\"" + re.sub("\"", "\\\"",line.rstrip()) + "\"," + "\n"

userScriptFile = re.sub("<Version>", newVersion, userScriptFile)
userScriptFile = re.sub("<ThemeName>", themeName, userScriptFile)
userScriptFile = re.sub("<Url_Regex>", urlRegex, userScriptFile)
userScriptFile = re.sub("<Style>", userScriptStyle, userScriptFile)
f = open(baseDir + "Generated/github.user.js", "w")

f.writelines(userScriptFile)
f.close

versionFile = open(baseDir + "Scripts/Version.txt", "w")
versionFile.writelines(newVersion)
versionFile.close
