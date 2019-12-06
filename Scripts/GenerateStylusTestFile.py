import os
import re
import shutil
baseDir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
# normalize baseDir between github action or dev environment
if baseDir.startswith("/home/runner/work/GithubDarkTheme"):
    baseDir = ""
else:
    baseDir = baseDir + "/"

themeName = open(baseDir + "Scripts/ThemeName.txt", "r").read().rstrip()
newVersion = open(baseDir + "Scripts/Version.txt", "r").read().rstrip()
headerFile = open(baseDir + "Scripts/Header.txt", "r")
header = headerFile.read()

preStyle = open(baseDir + "Scripts/PreStyle.txt", "r").read()
themeCss = open(baseDir + "Theme.css", "r",
                encoding="ASCII", errors="ignore").read()
endStyle = "}"

# update version in header 
newHeader = re.sub("<Version>", newVersion , header)
newHeader = re.sub("<ThemeName>", "Test-" + themeName, newHeader)

os.makedirs(baseDir + "Generated", exist_ok=True)

f = open(baseDir + "Generated/githubTest.user.styl", "w")
outString = newHeader + "\n" + preStyle + "\n" + themeCss + "\n" + endStyle
f.writelines(outString)
f.close
