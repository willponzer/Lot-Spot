# Lot-Spot
Fall 2024 Capping Project

Welcome to LotSpot, thank you for checking out our project.

If you would like to set up object detection for your parking lot to tell you how many available spots there are, please follow the instructions below. 

SOFTWARE REQUIREMENTS:
PYTHON VERSION 3.11.1 required or packages cannot be imported and it will not run 
NODE VERSION 22.11.0
RASPIAN (for camera)

HARDWARE REQUIREMENTS:
WIFI CAMERA - This project was made to work with the Raspberry Pi Zero 2 W connected to a PiCam 3 module, however, this will work with any Pi and PiCam as long as they are running the latest version. 


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

HOW TO BUILD THE CAMERA:
As stated above this project uses a PiCam 3 connected to a Pi Zero 2 W with a 3D printed case. To build replicate our camera you will need these parts
Raspberry Pi Zero 2 W - https://www.pishop.us/product/raspberry-pi-zero-2-w/ - Any Pi will work but this is a very cheap and quality option and it fits the case
PiCam3 - https://www.canakit.com/raspberry-pi-camera-module-3.html - Can use PiCam2 as well but PiCam 3 works better as it has a wider FOV and built-in commands to help see in the dark.
RIBBON CABLE - https://vilros.com/products/camera-module-adapter-cable-pi-zero-w-1-5-inch- The cable that comes with the PiCam will not fit the camera as the Pi Zero 2 W takes in a 22 pin for camera but the Camera takes in 15, this specific cable is what we used
MicroSD - Will need a MicroSD card to load the OS onto. 

OPTIONAL:
You may need some periferals to help setup and power the camera like a micro USB to power and a Mini HDMI to see the IP address at first, after that use SSH to setup. 

CASE: 
There are no Official Pi Zero 2 W camera cases so your best bet is to 3D print one, this is what we used. 
https://www.printables.com/model/753906-raspberry-pi-zero-2-w-with-camera-module-v-3-case
Please use the instructions on their README to print.

ASSEMBLY.
Assembly is very simple once you have all your parts, screw the camera into the bottom hole, connect cable, then mount the Pi over it, make sure the cable is correctly installed as that can cause issues. 

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

SETTING UP THE CAMERA:

I recommend using the Lite version of Raspberry Pi OS as this project can all be setup using SSH anyway. 
First, after connecting the Pi to WIFI, SSH in.
Once SSH in, you will need to update your PiCam Library using these two commands

sudo apt-get update
sudo apt-get install libcamera-apps

Once that is setup you will need to get the python script working
First run this command to make the file

nano capture_photo.py

After that paste in this Python script



##### how to run the project ########

To create a virtual environment, decide upon a directory where you want to place it, and run the venv module as a script with the directory path:


python3 -m venv lotSpot-env


This will create the tutorial-env directory if it doesn’t exist, and also create directories inside it containing a copy of the Python interpreter and various supporting files.

A common directory location for a virtual environment is .venv. This name keeps the directory typically hidden in your shell and thus out of the way while giving it a name that explains why the directory exists. It also prevents clashing with .env environment variable definition files that some tooling supports.

Once you’ve created a virtual environment, you may activate it.

On Windows, run:

lotSpot-env\Scripts\activate

On Unix or MacOS, run:

source lotSpot-env/bin/activate


to deactivate the virtual environment

deactivate


Dependencies all in the lotSpot-env folder should not need to install anything else

 pip install disutils
 pip install supervision
 pip install opencv-python
 pip install inference



 https://universe.roboflow.com/ai-training-mevw9/parking-detection-mitok/model/2?image=https%3A%2F%2Fsource.roboflow.com%2FVBemh0IU2sO31snqHxOklbNyr7X2%2FdzANtLFs6vdO1crtc4lQ%2Foriginal.jpg
