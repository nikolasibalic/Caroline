import markdown
import numpy as np
from jinja2 import Template
import webbrowser
import re
import os

__all__ = ["Presentation"]


class Presentation:
    def __init__(
        self,
        logo=None,
        leftHanded=False,
        drawingHelp="dots",
        drawingHelpIntensity=0.06,
        roundTableServer="",
        authenticationToken="",
        presentationServer="",
    ):
        self.slides = []
        self.style = []
        self.logo = logo
        #: if left part of the slide is filled
        self.leftPartExists = False
        #: if presenter is left handed, move menu right
        self.leftHanded = leftHanded
        #: do we currently construct grid layout slide
        self.grid = False
        self.drawingHelp = drawingHelp
        self.drawingHelpIntensity = drawingHelpIntensity
        self.roundTableServer = roundTableServer
        self.presentationServer = presentationServer
        self.authenticationToken = authenticationToken
        self.quizNumber = 0

    def newSlide(self, style=""):
        if self.grid:
            self._seveGridSlide()
        self.slides.append("")
        self.style.append(style)

    def title(self, markdown_text, fontSize=1):
        self.slides[-1] += self._title(
            self._text("%s" % markdown_text), fontSize=fontSize
        )
        self.leftPartExists = False

    def leftText(self, markdown_text, fontSize=1):
        self.slides[-1] += self._left(self._text(markdown_text), fontSize=fontSize)
        self.leftPartExists = True

    def rightText(self, markdown_text, fontSize=1):
        if not self.leftPartExists:
            self.leftText("")
        self.slides[-1] += self._right(self._text(markdown_text), fontSize=fontSize)
        self.leftPartExists = False

    def spanText(self, markdown_text, fontSize=1):
        self.slides[-1] += self._span(self._text(markdown_text), fontSize=fontSize)
        self.leftPartExists = False

    def spanCenterText(self, markdown_text, fontSize=1):
        self.slides[-1] += self._spanCenter(
            self._text(markdown_text), fontSize=fontSize
        )
        self.leftPartExists = False

    def leftImage(
        self, fileName, textBelow=None, textAbove=None, height=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        self.slides[-1] += self._left(
            "%s<img src='%s' alt='image %s' class='simage' %s>%s"
            % (textAbove, fileName, fileName, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = True

    def rightImage(
        self, fileName, textBelow=None, textAbove=None, height=None, fontSize=1
    ):
        if not self.leftPartExists:
            self.leftText("")
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        self.slides[-1] += self._right(
            "%s<img src='%s' alt='image %s' class='simage' %s>%s"
            % (textAbove, fileName, fileName, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def spanImage(
        self, fileName, textBelow=None, textAbove=None, height=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        self.slides[-1] += self._span(
            "%s<img src='%s' alt='image %s' class='simage' %s>%s"
            % (textAbove, fileName, fileName, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def spanCenterImage(
        self, fileName, textBelow=None, textAbove=None, height=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        self.slides[-1] += self._spanCenter(
            "%s<img src='%s' alt='image %s' class='simage' %s>%s"
            % (textAbove, fileName, fileName, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def leftIFrame(
        self, url, textBelow=None, textAbove=None, height=None, width=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height, width
        )
        url, height = self._youtubeURLfix(url, height)
        self.slides[-1] += self._left(
            "%s<iframe src='%s' title='iframe %s' class='sframe' %s></iframe>%s"
            % (textAbove, url, url, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = True

    def rightIFrame(
        self, url, textBelow=None, textAbove=None, height=None, width=None, fontSize=1
    ):
        if not self.leftPartExists:
            self.leftText("")
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height, width
        )
        url, height = self._youtubeURLfix(url, height)
        self.slides[-1] += self._right(
            "%s<iframe src='%s' title='iframe %s' class='sframe' %s></iframe>%s"
            % (textAbove, url, url, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def spanIFrame(
        self, url, textBelow=None, textAbove=None, height=None, width=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height, width
        )
        url, height = self._youtubeURLfix(url, height)
        self.slides[-1] += self._span(
            "%s<iframe src='%s' title='iframe %s' class='sframe' %s></iframe>%s"
            % (textAbove, url, url, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def spanCenterIFrame(
        self, url, textBelow=None, textAbove=None, height=None, width=None, fontSize=1
    ):
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height, width=width
        )
        url, height = self._youtubeURLfix(url, height)
        self.slides[-1] += self._spanCenter(
            "%s<iframe src='%s' title='iframe %s' class='sframe' %s></iframe>%s"
            % (textAbove, url, url, height, textBelow),
            fontSize=fontSize,
        )
        self.leftPartExists = False

    def leftMyCamera(self, height=None):
        self.leftPartExists = True
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._left(
            "<div class='demoCameraStream' %s></div>" % height
        )

    def rightMyCamera(self, height=None):
        if not self.leftPartExists:
            self.leftText("")
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._right(
            "<div class='demoCameraStream' %s></div>" % height
        )
        self.leftPartExists = False

    def spanMyCamera(self, height=None):
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._spanCenter(
            "<div class='demoCameraStream' %s></div>" % height
        )
        self.leftPartExists = False

    def spanCenterMyCamera(self, height=None):
        self.spanMyCamera(height=height)

    def leftMP4(self, source, height=None):
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._left(
            "<div data-src='%s' class='demoCameraStream' %s></div>" % (source, height)
        )
        self.leftPartExists = True

    def rightMP4(self, source, height=None):
        if not self.leftPartExists:
            self.leftText("")
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._right(
            "<div data-src='%s' class='demoCameraStream' %s></div>" % (source, height)
        )
        self.leftPartExists = False

    def spanMP4(self, source, height=None):
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.slides[-1] += self._spanCenter(
            "<div data-src='%s' class='demoCameraStream' %s></div>" % (source, height)
        )
        self.leftPartExists = False

    def spanCenterMP4(self, source, height=None):
        self.spanMP4(source, height=height)

    def newQuiz(
        self,
        questionText=None,
        questionImage=None,
        answersText=None,
        answersImage=None,
        fontSize=1,
    ):
        if self.grid:
            self._seveGridSlide()
        self.slides.append("")
        self.style.append("")
        options = 0
        if answersText is not None:
            options = len(answersText)
        elif answersImage is not None:
            options = len(answersImage)
        if options == 2:
            self.makeGrid(2, 2)
            answersPerRow = 2
            if questionImage is not None:
                self.gridImage(0, 0, questionImage)
                self._gridQuestion(0, 1, questionText)
            else:
                self._gridQuestion(0, [0, 1], questionText)
        elif options <= 4:
            self.makeGrid(3, 2)
            answersPerRow = 2
            if questionImage is not None:
                self.gridImage(0, 0, questionImage)
                self._gridQuestion(0, 1, questionText)
            else:
                self._gridQuestion(0, [0, 1], questionText)
        elif options <= 6:
            self.makeGrid(3, 3)
            answersPerRow = 3
            if questionImage is not None:
                self.gridImage(0, 0, questionImage)
                self._gridQuestion(0, [1, 2], questionText)
            else:
                self._gridQuestion(0, [0, 2], questionText)

        index = 0
        if answersText is not None:
            while index < len(answersText):
                row, column = self._gridSpaceCheck(
                    1 + index // answersPerRow, index % answersPerRow
                )
                self.gridContent.append(
                    [
                        self._quizResponse(
                            self._text(answersText[index]),
                            self.quizNumber,
                            index,
                            fontSize=1,
                        ),
                        row,
                        column,
                        fontSize,
                    ]
                )
                index += 1
        elif answersImage is not None:
            while index < len(answersImage):
                row, column = self._gridSpaceCheck(
                    1 + index // answersPerRow, index % answersPerRow
                )
                self.gridContent.append(
                    [
                        self._quizResponse(
                            "<img src='%s' alt='image %s' class='simage'>"
                            % (answersImage[index], answersImage[index]),
                            self.quizNumber,
                            index,
                            fontSize=1,
                        ),
                        row,
                        column,
                        fontSize,
                    ]
                )
                index += 1

        self.quizNumber += 1
        # else:
        #    raise
        #    ValueError("Only up to 6 answers are supported for quiz").

    def makeGrid(self, rows, columns, padding="0.3em"):
        self.grid = True
        self.gridRows = rows
        self.gridColumns = columns
        self.gridPlaces = np.empty((self.gridRows, self.gridColumns), dtype=int)
        self.gridPlaces.fill(-1)
        self.gridContent = []
        self.gridPadding = padding

    def gridImage(
        self,
        row,
        column,
        fileName,
        textBelow=None,
        textAbove=None,
        height=None,
        fontSize=1,
    ):
        row, column = self._gridSpaceCheck(row, column)
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        self.gridContent.append(
            [
                "%s<img src='%s' alt='image %s' class='simage' %s>%s"
                % (textAbove, fileName, fileName, height, textBelow),
                row,
                column,
                fontSize,
            ]
        )

    def gridIFrame(
        self, row, column, url, textBelow=None, textAbove=None, height=None, fontSize=1
    ):
        row, column = self._gridSpaceCheck(row, column)
        textBelow, textAbove, height = self._textBelowAboveHeight(
            textBelow, textAbove, height
        )
        url, height = self._youtubeURLfix(url, height)
        self.gridContent.append(
            [
                "%s<iframe src='%s' title='iframe %s' class='sframe' %s></iframe>%s"
                % (textAbove, url, url, height, textBelow),
                row,
                column,
                fontSize,
            ]
        )

    def gridMyCamera(self, row, column, height=None):
        row, column = self._gridSpaceCheck(row, column)
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.gridContent.append(
            ["<div class='demoCameraStream' %s></div>" % height, row, column, 1]
        )

    def gridMP4(self, row, column, source, height=None):
        row, column = self._gridSpaceCheck(row, column)
        a, b, height = textBelow, textAbove, height = self._textBelowAboveHeight(
            "", "", height
        )
        self.gridContent.append(
            [
                "<div data-src='%s' class='demoCameraStream' %s></div>"
                % (source, height),
                row,
                column,
                1,
            ]
        )

    def _youtubeURLfix(self, url, height):
        if url.find("www.youtube.") != -1 or url.find("https://youtu.be/") != -1:
            height += ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen'
            url = url.replace("?t=", "?start=")
            url = url.replace("www.youtube.com/watch?v=", "www.youtube.com/embed/")
            url = url.replace("https://youtu.be/", "https://www.youtube.com/embed/")
        return url, height

    def gridText(self, row, column, markdown_text, fontSize=1):
        row, column = self._gridSpaceCheck(row, column)
        self.gridContent.append(
            [self._span(self._text(markdown_text), fontSize=1), row, column, fontSize]
        )

    def _gridQuestion(self, row, column, markdown_text, fontSize=1):
        row, column = self._gridSpaceCheck(row, column)
        self.gridContent.append(
            [
                self._quizQuestion(
                    self._text(markdown_text), self.quizNumber, fontSize=1
                ),
                row,
                column,
                fontSize,
            ]
        )

    def _gridSpaceCheck(self, row, column):
        if not isinstance(row, list):
            row = [row]
        if not isinstance(column, list):
            column = [column]
        for r in range(row[0], row[-1] + 1):
            for c in range(column[0], column[-1] + 1):
                if self.gridPlaces[r, c] != -1:
                    raise ValueError(
                        "Row %d column %d is already occupied with\n%s"
                        % (r, c, self.gridContent[self.gridPlaces[r, c]])
                    )
        for r in row:
            for c in column:
                self.gridPlaces[r, c] = len(self.gridContent)
        # shift from Python numbering from 0 to HTML numbering from 1
        for i in range(len(row)):
            row[i] += 1
        for i in range(len(column)):
            column[i] += 1
        return row, column

    def _seveGridSlide(self):
        if not self.grid:
            return
        s = (
            "<div class='gridslide' style='grid-template-columns: repeat(%d, 1fr); grid-template-rows: repeat(%d, %.2f%%)'>"
            % (self.gridColumns, self.gridRows, 100.0 / self.gridRows)
        )
        # for i in range(self.gridRows):
        #    for j in range(self.gridColumns):
        #        s += "<div>s</div>";
        for c in self.gridContent:
            s += (
                (
                    "<div style='padding:%s;grid-column: %d / %d; grid-row: %d / %d; font-size:%.2fem'>"
                    % (
                        self.gridPadding,
                        c[2][0],
                        c[2][-1] + 1,
                        c[1][0],
                        c[1][-1] + 1,
                        c[3],
                    )
                )
                + c[0]
                + "</div>"
            )
        s += "</div>"
        self.slides[-1] += s
        self.grid = False

    def save(self, fileName):
        if self.grid:
            self._seveGridSlide()

        presentationTemplate = os.path.join(
            os.path.dirname(os.path.realpath(__file__)), "html", "presentation.html"
        )
        with open(presentationTemplate, "r") as file:
            template = Template(file.read())

        d = {"slides": []}
        for i, slideHTML in enumerate(self.slides):
            d["slides"].append(
                {"html": slideHTML, "canvas": "", "style": self.style[i]}
            )

        if self.logo is not None:
            l = self.logo
        else:
            l = "null"

        with open(fileName, "w") as file:
            file.write(
                template.render(
                    pageTitle="Caroline presentation",
                    data=d,
                    logo=l,
                    username="Lecturer",
                    presenter="true",
                    leftHanded="true" if self.leftHanded else "false",
                    drawingHelp=self.drawingHelp,
                    drawingHelpIntensity=self.drawingHelpIntensity,
                    roundTableServer=self.roundTableServer,
                    presentationServer=self.presentationServer,
                    authenticationToken=self.authenticationToken,
                )
            )

        self.fileName = fileName
        print("Presentation is saved in %s" % fileName)

        if self.presentationServer != "" and self.authenticationToken != "":
            # make audience copy also
            fileNameAudience = fileName.replace(".html", "_audience.html")
            with open(fileNameAudience, "w") as file:
                file.write(
                    template.render(
                        pageTitle="Caroline presentation",
                        data=d,
                        logo=l,
                        username="Audience",
                        presenter="false",
                        leftHanded="true" if self.leftHanded else "false",
                        drawingHelp=self.drawingHelp,
                        drawingHelpIntensity=self.drawingHelpIntensity,
                        roundTableServer="",
                        presentationServer="",
                        authenticationToken="",
                    )
                )
                print(
                    "Presentation copy for distribution to Audience is saved in %s"
                    % fileNameAudience
                )

    def show(self, width=900, height=700):
        assert (
            self.fileName is not None
        ), "before calling show(), save timeline using saveStandaloneHTML"
        webbrowser.open(self.fileName, new=2)

    def _textBelowAboveHeight(self, textBelow, textAbove, height, width=None):
        if textBelow is not None:
            textBelow = self._text(textBelow)
        else:
            textBelow = ""
        if textAbove is not None:
            textAbove = self._text(textAbove)
        else:
            textAbove = ""
        style = ""
        if height is not None:
            style += "height:%spx;max-height:%spx;" % (height, height)
        if width is not None:
            style += "width:%spx;max-width:%spx;" % (width, width)
        if style != "":
            style = "style='" + style + "'"
        return textBelow, textAbove, style

    def _text(self, s):
        # Make sure that escapes in LaTeX work without the need for double escaping
        # convert \\ into  \\\\ within \begin   ... \end environment
        s = re.sub(r"([\\begin\s][^\\])(\\\\)([^\w\\][\s\\end])", r"\1\\\\\\\\\3", s)
        return markdown.markdown(
            s,
            extensions=[
                "codehilite",
                "fenced_code",
                "tables",
                "pymdownx.tasklist",
                "pymdownx.smartsymbols",
                "pymdownx.emoji",
                "pymdownx.magiclink",
                "pymdownx.details",
            ],
        )

    def _spanCenter(self, s, fontSize=1):
        return "<div class='spancenter' style='font-size:%.2fem'>%s</div>" % (
            fontSize,
            s,
        )

    def _quizResponse(self, s, quizNumber, quizResponseNo, fontSize=1):
        return (
            ("<div data-qid=%d" % quizNumber)
            + (" data-aid=%d" % quizResponseNo)
            + " class='spancenter quiza' style='font-size:%.2fem'>%s</div>"
            % (fontSize, s)
        )

    def _quizQuestion(self, s, quizNumber, fontSize=1):
        return (
            "<div class='spancenter quizq' style='font-size:%.2fem'>%s <span id='responseCount%d'></span></div>"
            % (fontSize, s, quizNumber)
        )

    def _span(self, s, fontSize=1):
        return "<div class='span' style='font-size:%.2fem'>%s</div>" % (fontSize, s)

    def _left(self, s, fontSize=1):
        return "<div class='left' style='font-size:%.2fem'>%s</div>" % (fontSize, s)

    def _right(self, s, fontSize=1):
        return "<div class='right' style='font-size:%.2fem'>%s</div>" % (fontSize, s)

    def _title(self, s, fontSize=1):
        return "<div class='title' style='font-size:%.2fem'>%s</div>" % (
            fontSize * 1.25,
            s,
        )

    def showSlide(self, index):
        print("<div class='slide'>%s</div>" % self.slides[index])
