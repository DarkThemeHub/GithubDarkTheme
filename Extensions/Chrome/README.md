# Chrome Extension (built with TypeScript + React)

#### Why did you create a dedicated extension?
* Stylus does not have auto update on styles, so you have to manually hit that update button.
* There are future plans on supporting different "flavours" of the theme, which having a dedicated extension makes it easy to switch.
* This is the first stage to the more generic `DarkThemeHub` extension which will allow users to apply all the themes provided by `DarkThemeHub`

<hr>

## Why isnt it in the chrome extension store?
Seems like chrome team thinks my extension has no icons, description and its suspicious. They would not further expand on it, instead just copy-paste me the same generic crap when i informed them its there and asking for a further explanation on whats suspicious.

So the google extensions team can go suck one with their copy paste crap. 🤷‍♂ 

``` 
Your item did not comply with the following section of our Program Policies:

"Spam and Placement in the Store"
•	Item has a blank description field, or missing icons or screenshots, and appears to be suspicious.
```


<hr>

## Install already unpacked extension
1. Simply unzip the content in a folder somewhere. Get the zip from releases.
2. In Url of Chrome, enter `Chrome://Extensions`
3. Turn on developer mode on top right
4. Top left, click `load unpacked` and choose the directory you unzipped the contents in.
5. Turn off developer mode
5. Enjoy


![image](https://user-images.githubusercontent.com/19627023/72227190-7bb1c780-3591-11ea-87db-e62050937744.png)

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1.  Complete the steps to build the project above
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo



