import os
baseDir = os.path.dirname(os.path.realpath(__file__))
header = open(baseDir + "/header.txt", "r").read()
preStyle = open(baseDir + "/prestyle.txt", "r").read()
themeCss = open(os.path.dirname(baseDir) + "/theme.css", "r",
                encoding="ASCII", errors="ignore").read()
endStyle = "}"

if os.path.exists("githyb.user.styl"):
    os.remove("github.user.style")

f = open(os.path.dirname(baseDir) + "\Generated\github.user.styl", "w+")
outString = header + "\n" + preStyle + "\n" + \
    themeCss + "\n" + endStyle
f.writelines(outString)

f.close
