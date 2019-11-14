import os
baseDir = os.path.dirname(os.path.dirname(__file__))

header = open(baseDir + "\Scripts\header.txt", "r").read()
preStyle = open(baseDir + "\Scripts\prestyle.txt", "r").read()
themeCss = open(baseDir + "\\theme.css", "r",
                encoding="ASCII", errors="ignore").read()
endStyle = "}"

if os.path.exists("githyb.user.styl"):
    os.remove("github.user.style")

f = open(baseDir + "\Generated\github.user.styl", "w+")
outString = header + "\n" + preStyle + "\n" + \
    themeCss + "\n" + endStyle
f.writelines(outString)

f.close
