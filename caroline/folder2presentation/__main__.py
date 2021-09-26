import os
from os.path import isfile, join
import sys
import pathlib

# Creates template presentation from folder content.
# If the structure of directory is
#
# - presentation_folder
#   | - presentation_files
#   | - folder2presentation.py
#
# calling
#   python folder2presentation.py ./presentation_files
# will generate presentation_f2p.py that can in turn generate Caroline presentation
# with all elements added as individual slides, according to alphabetical order of filenames.

presentationStart = """
from caroline import Presentation

p = Presentation(logo="./presentation_files/institution_logo_placeholder.jpg",
leftHanded=False,
drawingHelp="dots",
drawingHelpIntensity=0.06 #,
#roundTableServer = "https://roundtable.researchx3d.com",
#presentationServer = "http://localhost:8000/presentation_audience.html",
#authenticationToken = "osagASfew8t31qNqfHQ3Gq"
)\n
"""
presentationEnd = """
p.save("./presentation_f2p.html")
"""

if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("\nPlease specify target folder in the format")
        print("\tpython folder2presentation.py folderPath")
        print("For example:")
        print("python folder2presentation.py ./presentation_files\n")
        exit()

    print("\n = = = = = = CAROLINE presentation = = = = =")
    print("Generating template presentation based on files given in directory...")
    print(
        "\n\nNOTE: by default presentation will have commented out "
        "\nroundTableServer and authenticationToken paramerets. If you want"
        "\nto use interactivity with the audience, please uncomment these parameters."
        "\nDefault values provide access to demo Roundtable server.\n\n"
    )

    files = [
        f
        for f in os.listdir(sys.argv[1])
        if os.path.isfile(os.path.join(sys.argv[1], f))
    ]
    files.sort()

    if os.path.isfile(os.path.join(os.getcwd(), "presentation_f2p.py")):
        print(
            "file presentation_f2p.py already exists. Please rename it so that we don't overwrite the content"
        )
        exit()

    with open(
        os.path.join(os.getcwd(), "presentation_f2p.py"), encoding="utf-8", mode="w"
    ) as f:
        f.write(presentationStart)

        for presentationElement in files:
            file_extension = pathlib.Path(presentationElement).suffix.lower()
            if file_extension in [".jpg", ".jpeg", ".png", ".gif"]:
                f.write("p.newSlide()\n")
                f.write('p.leftText(r"""%s""")\n' % presentationElement)
                f.write(
                    'p.rightImage("%s")\n\n'
                    % os.path.join(sys.argv[1], presentationElement)
                )
            elif file_extension in [".html"]:
                f.write("p.newSlide()\n")
                f.write('p.leftText(r"""%s""")\n' % presentationElement)
                f.write(
                    'p.rightIFrame("%s", height=900)\n\n'
                    % os.path.join(sys.argv[1], presentationElement)
                )
            elif file_extension in [".mp4"]:
                f.write("p.newSlide()\n")
                f.write('p.leftText(r"""%s""")\n' % presentationElement)
                f.write(
                    'p.rightMP4("%s", height=900)\n\n'
                    % os.path.join(sys.argv[1], presentationElement)
                )

        f.write(presentationEnd)

    print("Found files: ")
    print(files)
    print("Presentation Python file written in presentation_f2p.py\n")
    print("Call" "\n\tpython presentation_f2p" "\nto generate HTML presentation.\n")
    print("\n\nTo see it just click and open in web browser presentation.html")
    print("\n = = = = = = = = = = = = = = = = = = = = = =")
    exit()
