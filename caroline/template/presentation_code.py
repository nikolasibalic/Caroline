from caroline import Presentation

p = Presentation(
    logo="./presentation_files/institution_logo_placeholder.jpg",
    leftHanded=False,
    drawingHelp="dots",
    drawingHelpIntensity=0.06  # ,
    # roundTableServer = "https://roundtable.researchx3d.com",
    # presentationServer = "http://localhost:8000/presentation_audience.html",
    # authenticationToken = "osagASfew8t31qNqfHQ3Gq"
)

# drawingHelp = ""  OR "lines"  OR  "dots"
# drawingHelpIntenisty = flaot [0,1] ; 0=white   1 = black

p.newSlide()
p.spanCenterText(
    r"""
#intriguing title or Question
Author rohtuA
"""
)

p.newSlide()
p.title("Title")
p.leftText(
    r"""
[Caroline Herschel](https://en.wikipedia.org/wiki/Caroline_Herschel) (1750-1848)

Check wiki page for more information.
""",
    fontSize=0.8,
)
p.rightImage(
    "./presentation_files/Caroline_Herschel.jpeg",
    textBelow="Caroline Herschel ",
    fontSize=0.8,
    height=400,
)

p.save("./presentation.html")


# LIST OF POSSIBLE ELEMENTS:
#
### p.newSlide()   followed by some number of
#
# p.title(markdown_text, fontSize=1):
#
# p.leftText(markdown_text, fontSize=1)
# p.rightText(markdown_text, fontSize=1)
# p.spanText(markdown_text, fontSize=1)
# p.spanCenterText(markdown_text, fontSize=1)
#
# p.leftImage(fileName, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.rightImage(fileName, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.spanImage(fileName, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.spanCenterImage(fileName, textBelow=None, textAbove=None, height=None, fontSize=1)
#
# p.leftIFrame(url, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.rightIFrame(url, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.spanIFrame(url, textBelow=None, textAbove=None, height=None, fontSize=1):
# p.spanCenterIFrame(url, textBelow=None, textAbove=None, height=None, fontSize=1)
#
# p.leftMyCamera(height=None)
# p.rightMyCamera(height=None)
# p.spanMyCamera(height=None)
# p.spanCenterMyCamera(height=None)
#
# p.leftMP4(source, height=None):
# p.rightMP4(source, height=None)
# p.spanMP4(source, height=None):
# p.spanCenterMP4(source, height=None):
#
###    OR  grid layout
#
# p.newSlide()   followed by
# p.makeGrid(rows, columns, padding="0.3em")    followed by some number of
#
# p.gridText(row, column, markdown_text, fontSize=1)
# p.gridImage(row, column, fileName, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.gridIFrame(row, column, url, textBelow=None, textAbove=None, height=None, fontSize=1)
# p.gridMyCamera(row, column, height=None)
# p.gridMP4(row, column, source, height=None):
#
###    OR quiz
# p.newQuiz(questionText=None, questionImage=None, answersText = None, answersImage=None, fontSize=1 )
#
#   NOTE: quiz does not have p.newSlide before
#   NOTE: Quiz questoin can use both questionText and questionImage
#         but that Quiz answer can use EITHER answersText list or answersImage list
#         and maximum number of answers options supported currently is 6
#
###  NOTE: markdown text input
#          it's best to enclose it between    r""" ... """
#          (note r before the first tripple of ")
#          as in this way multiline input and LaTeX work fine
#
