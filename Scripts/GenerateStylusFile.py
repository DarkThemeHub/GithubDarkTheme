import os
import re
import shutil
baseDir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
# normalize baseDir between github action or dev environment
if baseDir.startswith("/home/runner/work"):
    baseDir = ""
else:
    baseDir = baseDir + "/"

themeName = open(baseDir + "Scripts/ThemeName.txt", "r").read().rstrip()
newVersion = open(baseDir + "Scripts/Version.txt", "r").read().rstrip()
headerFile = open(baseDir + "Scripts/Header.txt", "r")
header = headerFile.read()
urlRegex = open(baseDir + "UrlRegex.txt", "r").read().rstrip()
preStyle = "@-moz-document regexp(\"<URL_REGEX>\") {"

themeCss = open(baseDir + "ScssOutput/Theme.css", "r",
                encoding="ASCII", errors="ignore").read()
endStyle = "}"

# update version in header
newHeader = re.sub("<Version>", newVersion, header)
newHeader = re.sub("<ThemeName>", themeName, newHeader)
newPreStyle = re.sub("<URL_REGEX>", urlRegex, preStyle)
# empty generated Folder
shutil.rmtree(baseDir + "Generated", ignore_errors=True)
os.makedirs(baseDir + "Generated", exist_ok=True)


f = open(baseDir + "Generated/github.user.styl", "w")
outString = newHeader + "\n" + newPreStyle + "\n" + themeCss + "\n" + endStyle
f.writelines(outString)
f.close
