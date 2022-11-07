# AEM Assetpicker Wordpress Plugin

- Contributors:      Abhishek Arora
- Tags:              block
- Tested up to:      6.0
- Stable tag:        2.0.0
- License:           GPL-2.0-or-later
- License URI:       https://www.gnu.org/licenses/gpl-2.0.html

## Description

Embed an image or video asset from AEM Digital Assets Manager in your wordpress instance

## Installation

1. Download the latest aemassetpicker.zip from releases section
2. Install the plugin through the WordPress plugins screen directly
3. Activate the plugin through the 'Plugins' screen in WordPress


## Build

1. Clone the git repo
2. Put the entire aemassetpicker folder in wordpress/wp-content/plugins
3. Make sure you have the latest version of npm installed and running in terminal (npm -v)
4. Open terminal(mac) or cmd(windows)
5. For development (incremental builds) run - "npm run start:all" 
6. Now you can start your development
7. For producing a single build run - "npm run build:all"


## Screenshots

<img width="767" alt="aemassetpicker_screenshot1" src="https://user-images.githubusercontent.com/12087783/199488360-6ff9c4f0-cb2c-4f81-8b3f-ac27ab846981.png">
<img width="863" alt="aemassetpicker_screenshot2" src="https://user-images.githubusercontent.com/12087783/199488368-af3dd44a-70ac-4408-ab84-50413434bf44.png">


## Troubleshooting

### Asset renditions are not getting loaded

**Solution -** If you are getting a cors issue while loading renditions from aem, please add an entry in "Adobe Granite Cross-Origin Resource Sharing Policy" for your wordpress server in Webconsole - /system/console/configMgr (see screenshot below)

- Add your aem instance path in Allowed Origins 

<img width="1749" alt="aemassetpicker_aem_cors_solution" src="https://user-images.githubusercontent.com/12087783/199488502-7b77a645-5291-4e5b-b875-a4af3440cff1.png">


## Changelog

### Release - 2.0.0
#### Added
Dynamic Media Renditions

### Release - 1.2.0
#### Added
Asset resizing

### Release - 1.1.0
#### Added
Global settings page

### Release - 1.0.0
#### Added
Embed image and video assets
Select asset renditions
