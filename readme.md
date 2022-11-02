# AEM Assetpicker Wordpress Plugin

- Contributors:      Abhishek Arora
- Tags:              block
- Tested up to:      6.0
- Stable tag:        0.1.0
- License:           GPL-2.0-or-later
- License URI:       https://www.gnu.org/licenses/gpl-2.0.html

## Description

Embed an image or video asset from AEM Digital Assets Manager in your wordpress instance

Version 1.0 supports - embedding image and video assets and selecting asset renditions

## Installation

1. Download the latest aemassetpicker.zip from releases section
2. Install the plugin through the WordPress plugins screen directly
3. Activate the plugin through the 'Plugins' screen in WordPress


## Build

1. Clone the git repo
2. Put the entire aemassetpicker folder in wordpress/wp-content/plugins
3. Make sure you have the latest version of npm installed and running in terminal (npm -v)
4. Open terminal(mac) or cmd(windows) and run - "npm start"
5. Now you can start your development
6. For production build run - "npm run build"


## Screenshots

<img width="767" alt="aemassetpicker screenshot" src="https://git.corp.adobe.com/storage/user/19793/files/1407ed7b-8968-48e6-b0c2-16d921ba1775">

<img width="1263" alt="aemassetpicker wordpress plugin screenshot" src="https://git.corp.adobe.com/storage/user/19793/files/e93c9dce-72e1-4037-a549-01ba212ace17">


## Troubleshooting

### Asset renditions are not getting loaded

**Solution -** If you are getting a cors issue while loading renditions from aem, please add an entry in "Adobe Granite Cross-Origin Resource Sharing Policy" for your wordpress server in Webconsole - /system/console/configMgr (see screenshot below)

- Add your aem instance path in Allowed Origins 

<img width="1749" alt="aemassetpicker aem cors solution" src="https://git.corp.adobe.com/storage/user/19793/files/c4253e26-862c-4e62-86b7-3b9a2e3a1c22">


## Changelog

* Release - 1.0
