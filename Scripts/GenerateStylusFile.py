import os
baseDir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

if baseDir.startswith("/home/runner/work/GithubDarkTheme"):
    baseDir = ""
else:
    baseDir = baseDir + "/"

header = open(baseDir + "Scripts/Header.txt", "r").read()
preStyle = open(baseDir + "Scripts/PreStyle.txt", "r").read()
themeCss = open(baseDir + "Theme.css", "r",
                encoding="ASCII", errors="ignore").read()

endStyle = "}"

if os.path.exists(baseDir):
    if os.path.exists(baseDir + "githyb.user.styl"):
        os.remove(baseDir + "github.user.style")
else:
    os.makedirs(baseDir + "Generated")

f = open(baseDir + "Generated/github.user.styl", "w+")
outString = header + "\n" + preStyle + "\n" + \
    themeCss + "\n" + endStyle
f.writelines(outString)

f.close
