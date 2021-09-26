import os
from distutils.dir_util import copy_tree
import shutil

print("\n = = = = = = CAROLINE presentation = = = = =")
print("Writting simple presentation template in the given directory...")
print(
    "\n\nNOTE: Quiz template will use by default public demo web server for"
    "\nexchange with the audience. If you run in production/with large audience"
    "\nplease consider running your own Roundtable server, it's simple and "
    "\nyou can contact developers for help with setup.\n\n"
)


carolineHTML = os.path.join(
    os.path.dirname(os.path.dirname(os.path.realpath(__file__))), "html_dist"
)

carolineDestination = os.path.join(os.getcwd(), "caroline")
if not os.path.exists(carolineDestination):
    os.makedirs(carolineDestination)

copy_tree(carolineHTML, carolineDestination)

presentationFilesDestination = os.path.join(os.getcwd(), "presentation_files")
presentationFiles = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "presentation_files"
)
if not os.path.exists(presentationFilesDestination):
    copy_tree(presentationFiles, presentationFilesDestination)
else:
    print(
        "Folder presentation_files already exists, skipping generation of this folder..."
    )

dataFolder = os.path.dirname(os.path.realpath(__file__))
destinationFolder = os.getcwd()
if not os.path.exists(os.path.join(destinationFolder, "presentation_code.py")):
    shutil.copy(os.path.join(dataFolder, "presentation_code.py"), destinationFolder)
else:
    print(
        "presentation_code.py already exists in the folder, skipping generation of this file..."
    )
shutil.copy(os.path.join(dataFolder, "presentation.html"), destinationFolder)
shutil.copy(os.path.join(dataFolder, "presentation_audience.html"), destinationFolder)
print(
    "Presentation template created." "\nTo edit it change presentation_code.py and run"
)
print("\tpython presentation_code.py")
print(
    "To see it run"
    "\n\tpython -m caroline.preview"
    "\nor refresh browser if you are already running preview"
)
print("\n = = = = = = = = = = = = = = = = = = = = = =")
