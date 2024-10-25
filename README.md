# Lot-Spot
Fall 2024 Capping Project

PYTHON VERSION 3.11.1 required or it will not run 


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