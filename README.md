<a name="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/MatthewBlam/Lotion">
    <img src="logo/Lotion.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Lotion</h3>

  <p align="center">
    Organize your tasks and calendar events in a streamlined, centralized, and customizable fashion to meet productivity needs and goals. You should be using Lotion every day.
    <br />
    <br />
    <a href="https://www.youtube.com/watch?v=TLPhCnJD4KI">Download</a>
    ·
    <a href="https://github.com/MatthewBlam/Lotion/issues">Report Bug</a>
    ·
    <a href="https://github.com/MatthewBlam/Lotion/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#run-lotion">Run Lotion</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup">Setup</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#suggestions-and-contributions">Suggestions and Contributions</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![D4D Screen Shot][product-screenshot]](https://github.com/MatthewBlam/Lotion)

### Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

<p align="right"><a href="#readme-top">back to top</a></p>



<!-- GETTING STARTED -->
## Run Lotion

You can download Lotion here for Mac, Windows, and Linux. Alternatively, if you are familiar with Electron and wish to compile Lotion yourself, clone this repo and run Lotion as a project or use electron-builder to compile the binaries.

<p align="right"><a href="#readme-top">back to top</a></p>



<!-- USAGE EXAMPLES -->
## Usage

For a walk-through of how to use the program and it's features, please watch <a href="https://www.youtube.com/watch?v=TLPhCnJD4KI">this video</a>.

### Features
* Main Dexcom widget
  * Glucose reading based on Dexcom G6 sensors (from Dexcom Share)
  * Reading unit (mg/dL or mmol/L)
  * Trend indicated by arrow
* Movable menu
   * Settings
     * Opens a form where you can edit and save settings
       * Name (input)
       * Username (input)
       * Password (input)
       * Outside United States (y/n)
       * Military Time (y/n)
       * Unit (mg/dL or mmol/L)
       * Display Info (y/n)
         * If selected yes, a movable info box will become visible displaying the user's name, time that the current reading was recorded, and the delta difference between the current and previous reading.
       * Low (threshold range 60-100)
       * High (threshold range 120-400)
       * Hit the 'Save' button to confirm changes
         * Click outside the settings page or hit the 'esc' key to cancel changes
   * Zoom In & Zoom Out
     * Customize the size of the Dexcom widget
   * Move
     * Move the entire program window around the screen
* Log file `d4d_logs` saved in project directory containing debugging information, print statements, and errors

### Pinning D4D to taskbar on Windows
Pinning D4D to the taskbar makes launching the program incredibly easy. There are some steps you must take as you can't pin the shortcut launcher, unfortunately.
   1. Go into the `windows_run` folder in your project directory and locate `d4d.vbs`
   2. Rename `d4d.vbs` to `d4d.exe` and confirm when you are prompted
   3. Right-click `d4d.exe` and select 'Pin to taskbar'
   4. Rename `d4d.exe` back to `d4d.vbs` and confirm again
   5. Right-click the newly created alias in the taskbar, right-click again on 'd4d', and select 'Properties'
   6. Change the last part of the target path from `\d4d.exe` to `\d4d.vbs`
   7. Click the 'Change Icon' button, then locate and select `dexcom.ico` from the `web` folder in your project directory
   8. Apply the changes, logout, and log back to see the changes
   9. Now you should see the Dexcom icon in your taskbar, and clicking it should run D4D!

### Adding D4D to Dock on Mac
Adding D4D to Dock makes launching the program incredibly easy.
   1. Locate the `Dexcom 4 Desktop` file and select it
   2. In Finder, go to the top and open the `File` tab
   3. With the file tab open, hold the 'shift' key on your keyboard
   4. This will open up a selection in the dropdown called `Add to Dock`
   5. Click `Add to Dock`
   6. Now you should see the Dexcom icon in the bottom right in your Dock, and clicking it should run D4D!

### Automatically start D4D on login for Windows
You can set D4D to automatically open every time you log in to your computer. Simply navigate to `C:\Users\[User Name]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` and copy the D4D shortcut launcher over. That's it! Now D4D will run automatically whenever you login to your computer.

### Automatically start D4D on login for Mac
You can set D4D to automatically open every time you log in to your computer. Open System Preferences and search 'Login Items' in the searchbar. Once on this page, click the lock in the bottem left to make changes. Then locate the file `d4d_startup.command` in the `mac_run` folder of this project, and drag it into the Login Items window. You should see the file get added to the list. That's it! Now D4D will run automatically whenever you login to your computer.

<p align="right"><a href="#readme-top">back to top</a></p>



<!-- ROADMAP -->
## Roadmap

- [ ] Integrate services such as Google Calendar, Google Classroom, etc.
- [ ] Implement suggestions & fix any bugs

See the [open issues](https://github.com/MatthewBlam/Lotion/issues) for a full list of proposed features (and known issues).

<p align="right"><a href="#readme-top">back to top</a></p>



<!-- CONTRIBUTING -->
## Suggestions and Contributions

If you have any suggestions or ideas, please open an issue with the tag "enhancement". All feedback is **greatly appreciated**. You can also fork the repo and create a pull request. Thank you!



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.



<!-- CONTACT -->
## Contact

Matthew Blam - blammatthew@gmail.com

Project Link: [https://github.com/MatthewBlam/Dexcom-4-Desktop](https://github.com/MatthewBlam/Lotion)

<p align="right"><a href="#readme-top">back to top</a></p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/D4D%20Project%20Screenshot.png
[logo]: logo/Lotion.png
