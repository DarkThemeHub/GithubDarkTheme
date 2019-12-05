import os
import re
import shutil
baseDir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
# normalize baseDir between github action or dev environment
if baseDir.startswith("/home/runner/work/GithubDarkTheme"):
    baseDir = ""
else:
    baseDir = baseDir + "/"


newVersion = open(baseDir + "Scripts/Version.txt", "r").read().rstrip()
headerFile = open(baseDir + "Scripts/Header.txt", "r")
header = headerFile.read()

preStyle = open(baseDir + "Scripts/PreStyle.txt", "r").read()
themeCss = open(baseDir + "Theme.css", "r",
                encoding="ASCII", errors="ignore").read()
endStyle = "}"

# update version in header 
newHeader = re.sub("[0-9]+.[0-9]+.[0-9]+", newVersion , header)
newHeader = re.sub("GithubDarkTheme();", "Test-GithubDarkTheme();", newHeader)
headerFile = open(baseDir + "Scripts/Header.txt","w")
headerFile.write(newHeader)
headerFile.close()

os.makedirs(baseDir + "Generated", exist_ok=True)

f = open(baseDir + "Generated/githubTest.user.styl", "w")
outString = header + "\n" + preStyle + "\n" + themeCss + "\n" + endStyle
f.writelines(outString)
f.close

