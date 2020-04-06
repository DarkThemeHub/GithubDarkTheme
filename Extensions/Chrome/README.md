# Chrome Extension (built with TypeScript + React)

![image](https://camo.githubusercontent.com/6eb5eb47abc1c6d81946b18633b2edbf4cc50e44/68747470733a2f2f692e6779617a6f2e636f6d2f33306361623663636638386334386234613830656630383965393266373763302e706e67)
<hr>

## Why did you create a dedicated extension?
* <s>Stylus does not have auto update on styles, so you have to manually hit that update button.</s>
* Performance
* There are future plans on supporting different "flavours" of the theme, which having a dedicated extension makes it easy to switch.
* This is the first stage to the more generic `DarkThemeHub` extension which will allow users to apply all the themes provided by `DarkThemeHub`

<hr>

## Why isnt it in the chrome extension store?
Apparently the chrome extension team thinks my extension has no icons, description and its suspicious. They would not further expand on it, instead just copy-paste me the same generic crap when i informed them its there and asking for a further explanation on whats suspicious.

So the google extensions team can go suck one with their copy paste crap. 🤷‍♂ 

``` 
Your item did not comply with the following section of our Program Policies:

"Spam and Placement in the Store"
•	Item has a blank description field, or missing icons or screenshots, and appears to be suspicious.
```


<hr>

## Install already unpacked extension
1. Get the zip from releases. Simply unzip the content in a folder somewhere. 
2. In Url of Chrome, enter `Chrome://Extensions`
3. Turn on developer mode on top right
4. Top left, click `load unpacked` and choose the directory you unzipped the contents in.
5. Turn off developer mode
5. Enjoy

<hr>

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1.  Complete the steps to build the project above
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo



