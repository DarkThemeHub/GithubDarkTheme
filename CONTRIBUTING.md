## Contributing
### Submitting an Issue
* No matter how tiny the issue or nice to have is, SUBMIT IT! Lets make this theme shiney and bug free!
* Please follow the issue template when submitting.

### Submitting a Pull Request
#### Editing style: 
* Only file you need to modify is the Theme.scss file.
* Run `npm Start` to automatically generate Theme.css on Theme.scss changed.
* Execute `GenerateStylusTestFile.py` with a version number like `GenerateStylusTestFile.py 0.0.0` to generate all style files locally. You can copy the contents of files into appropriate extensions to test your changes.
* Please only commit `.scss` files for theme changes.
* Use Prettier as a css formatter with vscode.
   * Tab Width set to 4.

#### Keep it simple and minimal: 
* Changing a class style can cause unwanted changes in other places due to github's terrible css practices. Doing simple and minimal changes ensures changes can be easily tracked and identified when reviewing.
* Prioritise overriding root variables if possible.
* Keep format fixes seperate from style changes when commiting so the reviewer can easily identify what has been changed to the theme.
* Provide screenshots to capture whats changed so the reviewer can get an idea of what has been changed before looking through the commit.
* Don't commit with more than a single element change. This means if your PR consist of changes to 10 different elements, each of them should have their own commit, totaling to 10 commits.
* Each commit should have a precise title explaining what was changed, with a description of why it was changed if the title isn't informative enough.
* Your contribution may not be accepted if the reviewer deems so. Keeping it minimal ensures you dont waste a lot of time! If you think your change could have a chance of being declined, submit an issue instead!
* Most important of all, please follow the guidelines and feedback from reviewers to ensure we dont waste eachothers time! :)

[What a good PR looks like](https://github.com/DarkThemeHub/GithubDarkTheme/pull/126)
