from caroline import Presentation

p = Presentation(
    logo="./presentation_files/institution_logo_placeholder.jpg",
    leftHanded=False,
    drawingHelp="dots",
    drawingHelpIntensity=0.06,
    roundTableServer="https://roundtable.researchx3d.com",
    presentationServer="http://localhost:8000/presentation_audience.html",
    authenticationToken="osagASfew8t31qNqfHQ3Gq",
)

# drawingHelp = ""  OR "lines"  OR  "dots"
# drawingHelpIntenisty = flaot [0,1] ; 0=white   1 = black

p.newSlide()
p.spanCenterText(
    r"""
#[![Caroline](./caroline/images/caroline2.png)]()
###Caroline: Open-source Python framework for generating interactive web/HTML-based science presentations

Nikola Šibalić, September 2021
"""
)

p.newSlide()
p.title("Show (interactively) and annotate everything!")
p.spanText(
    r"""
* **Simple for input:** full markdown support, $LaTeX$, code highlighting, zoomable figures, blinking pointer when mouse/pen pressed...

* **Annotations** textual or by drawing during lecture **over anything** (text, video, figure...)

* **Camera support:** for lecturer view; multiple camera for experimental demonstrations

* **Interactive elements:** interactive figures, 3D objects, movies, and other IFrames

* **Engaging audience:** quizzes, Roundtable discussions and feedback, audience members exploring and annotating their own copy

* **Simply portable, with declutered interface focused on really necessary**: Works in any web browser, even offline (assuming that no online materials are added in IFrames).
""",
    fontSize=0.9,
)

p.newSlide()
p.title("Navigation, pointing and zooming on figures")
p.leftText(
    r"""
Navigation can be done with **keyboard arrows** or by clicking on arrows in the **side menu**.

If mouse is kept pressed down **pointer** (red dot) will blink to higlight point.

On the menu left one can select also **pen** and draw anyywhere on the slide.

**Double clicking** on figure shows figure on fullscreen (doubleclick again to exit; drawing works in zoomed mode too).
"""
)
p.rightImage(
    "./presentation_files/4.png", textBelow="**Figure**: Icelandic Spar Crystal. "
)

p.newSlide()
p.title("Markdown, LaTeX equations and slide organisation")
p.leftText(
    r"""
* All markdown features are supported

* Also LaTeX equations written between dollar signs or with standard environment (\\begin ...)

* One can also use **bbox** to highlight part of the equation

"""
)
p.rightText(
    r"""
They *can* be used $|\psi\rangle$ inline, as well as

\begin{equation}
 \mathcal{H} =
 \begin{pmatrix}
 a & b\\
 c & d
 \end{pmatrix}
\end{equation}

Useful for **important** terms $|\psi\rangle = \bbox[5px, border: 2px solid red]{a |1\rangle} + b|2\rangle + c |3\rangle$
"""
)
p.spanCenterText(
    r"""
Markdown is good for text editing, but for positioning and insertions of other elements we use Python. For example
**spanCenterText** gives field spanning whole width of the slide, with text justified in center.
"""
)

p.newSlide()
p.makeGrid(3, 3)
p.gridImage(0, 0, "./presentation_files/4.png")
p.gridImage([1, 2], [1, 2], "./presentation_files/4.png")
p.gridText(
    0,
    [1, 2],
    r"""## Slide organisation II: grid layouts

in addition to building slides from **span..**, **spanCenter...**, **left..** and **right..** elements, one can also use grid layouts.
""",
)
p.gridText(
    [1, 2],
    [0],
    """This cells spans two columns in overall 3x3 grid. Supported elements are

* Text
* Image
* MP4
* IFrame
* MyCamera

""",
)

p.newSlide()
p.title("Code highlighting and leaving white space for manual notes")
p.leftText(
    r"""
Output some text from Python in **Markdown**:
```python
from sklearn.datasets import load_iris
from sklearn import tree
iris = load_iris()
clf = tree.DecisionTreeClassifier()
clf = clf.fit(iris.data, iris.target)
print(clf.predict_proba(iris.data[:1, :]))
```
""",
    fontSize=0.6,
)
p.rightText(
    """
You can use ![controlicon](./caroline/images/draw.png "drawing annotations") to draw annotations, or
click on ![controlicon](./caroline/images/text.png "text annotations") and on slide where you want to add (la)text.
"""
)
p.rightText(
    "Undo works per slide per annotation, while if you want to edit textual annotation, double click on it while in pointer mode."
)


p.newSlide()
p.title("Demonstration (e.g. experiment demo) with two different cameras")
# p.spanMyCamera(height=900)
p.leftMyCamera(height=500)
p.rightMyCamera(height=500)
p.spanCenterText(
    "Note: Chrome web browser supports multiple streams from different cameras (tested on Linux). Some other web browsers allow only single camera or only single stream.",
    fontSize=0.65,
)

p.newQuiz(
    questionText="##Which equation contains a new term introduced by Maxwell?",
    answersText=[
        r"$\nabla \cdot \mathbf{E}=\frac{\rho}{\varepsilon_0}$",
        r"$\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}$",
        r"$\nabla \cdot \mathbf{B} = 0$",
        r"$\nabla \times \mathbf{B} = \mu_0 ~\mathbf{j} + \varepsilon_0 \mu_0 \frac{\partial \mathbf{E}}{\partial t}$",
    ],
)

p.newQuiz(
    questionImage="./presentation_files/faraday.jpg",
    questionText="##Which of the following is NOT explained by Faraday's law of induction?",
    answersImage=[
        "./presentation_files/em1.png",
        "./presentation_files/em2.png",
        "./presentation_files/em3.png",
        "./presentation_files/em6.png",
        "./presentation_files/em5.png",
        "./presentation_files/em4.png",
    ],
)

p.newQuiz(
    questionImage="./presentation_files/mirror_q.png",
    questionText="If one places a perfect conductor in the dashed area on the image in the left, how does the equilibrium **charge distribution** in the conductor look like?",
    answersImage=[
        "./presentation_files/mirror_a4.png",
        "./presentation_files/mirror_a2.png",
        "./presentation_files/mirror_a1.png",
        "./presentation_files/mirror_a3.png",
    ],
)

p.newSlide()
p.title("Engaging audience: not only quizzes... ")
p.spanText(
    r"""
When used with relay server, live copy of presentation in the web-browsers of the audience (tablets, laptops, phones...) allows not only quiz answering, but also Roundtable use and material exploration and annotation.

:point_up: One can quickly switch to **Roundtable**, where everyone who follows live lecture on their browser can also draw and share material - useful for tutorials, supervisions, discussions.


:v: Each audience memeber **can move back** (but not beyond the lecturer) to consult previous slides, and **can annotate** both with free drawing and text

??? "Click for hint"
    :old_key: Useful for help with problem solutions, [see here for more details](https://facelessuser.github.io/pymdown-extensions/extensions/details/)
""",
    fontSize=0.9,
)

p.newSlide()
p.title("Roundtable? What is that?")
p.spanText(
    """
**Context**: You are in the middle of the lecture and you remember really good example but you need extra space to draw something. Or you have very good figure/code/PDF for the raised question.
Or someone in audience wants to share and draw something as part of discussion.

**Don't panic, simple solution:** Roundtable is **distributed work surface**
everyone can share, point with their pointer and manipulate **same** material, since everyone is equal
as in King's Arthur [Round table](https://en.wikipedia.org/wiki/Round_Table).
Perfect for **collaborative feedback**. (note: audience participation requires use of relay server)

It is accessed via ![controlicon](./caroline/images/roundtable.png "Roundtable icon").
IPython notebooks, codes, PDFs and images can be shared and will be opened in web browser immediately via
![controlicon](./images/addtosurface.png "Add to Roundtable surface"). Magic surface! Need more space? Press ![controlicon](./caroline/images/newsurface.png "Add new surface to Roundtable icon").
Go back to presentation ![controlicon](./caroline/images/icon_192.png "exit Roundtable icon") and jump back to Roundtable later - it saves the content!

:bulb: Open directly Roundtable at https://roundtable.researchx3d.com to use it for discussion/supervision meeting outside of regular talks/presentations.
""",
    fontSize=0.9,
)

p.newSlide()
p.title("Interactive figures")
p.leftText(
    r"""
HTML based interactive figures for presentations and EPUB are created using [Interactive-Publishing package](https://github.com/nikolasibalic/Interactive-Publishing)
that converts any your existing figure or drawing into interactive, multiple-parameter exploration object using HTML+JS.

Additionally, special toolbox for visualisation of AMO physics states (see Bloch sphere on the right as an example) will be released there soon.
"""
)
p.rightIFrame("./presentation_files/Bloch_Ry.html", height=650)

p.newSlide()
p.title("Embeding 3D object")
p.leftIFrame("https://www.researchx3d.com/en/?o=4&e", height=800)
p.rightText(
    """We use experimental apparatus model from [ResearchX3D](www.researchx3d.com) via their **embed** link.

Models can be translated, rotated and zoomed enlarged, but that is not all...
"""
)


p.newSlide()
p.title("Embeding 3D object WITH story")
p.leftText(
    "We can embed not only 3D model from ResearchX3D, but also a story that consists of multiple segments, each with textual and 3D annotation, and even supporting figures."
)
p.rightIFrame("https://www.researchx3d.com/en/?o=12&s=12&e", height=800)

p.newSlide()
p.title("Embeding Skechfab 3D object")
p.leftText(
    """We can also use other sources of 3D models, like  [Sketchfab](https://sketchfab.com/), using their **embed** URI.

:point_up: You can still use annotations to draw and write over the 3D model if you wish!
"""
)
p.rightIFrame(
    "https://sketchfab.com/models/770e7a94c2884e9c992dce238cb24157/embed?camera=0&ui_animations=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=1",
    height=650,
)


p.newSlide()
p.title("Example 3D object and story with spanIFrame")
p.spanIFrame("https://www.researchx3d.com/en/?o=4&s=7&e", height=900)

p.newSlide()
p.title("Embedding [PhET](https://phet.colorado.edu/) simulation")
p.spanIFrame("./presentation_files/bending-light_en.html", height=900)

p.newSlide()
p.title("Embeding Youtube video :movie_camera: or more :rocket:...")
p.leftText(
    """
Almost anything can be inserted as IFrame, even your local [Jupyter notebook server](https://jupyter.org/).

Nowdays one can find JavaScript (js) packages that are free and open-source for almost anything on GitHub. [Molecular viewers](https://github.com/nglviewer/ngl),
[ray optics simulators](https://github.com/ricktu288/ray-optics), [advanced interactive plots](https://github.com/plotly/plotly.js) and many more.
HTML+JS outputs of these can be included in IFrame and added to presentation providing limitless opportunities. And any other complex calculation output
can be made interactive and included with [Interactive-Publishing](https://github.com/nikolasibalic/Interactive-Publishing).
""",
    fontSize=0.9,
)
p.rightIFrame("https://www.youtube.com/embed/IPncIqST9B0", height=615)


p.newSlide()
p.title("Embed Youtube video with start and end defined")
p.spanCenterIFrame(
    "https://youtu.be/41Jc75tQcB0?start=1228&end=1300", height=915
)  # both formats work; keep height large (this is max height, it will shrink for smaller screens

p.newSlide()
p.title("Playing locally saved video file (.MP4)")
p.spanMP4("./presentation_files/feynman.mp4", height=700)

p.newSlide()
p.title("Named in honour of Caroline Herschel :telescope:")
p.leftText(
    r"""
[Caroline Herschel](https://en.wikipedia.org/wiki/Caroline_Herschel) (1750-1848) was pioneering astronomer and scientists. She had indenpendant scientific career as a creator of New General Catalogue and discoverer of several comets, in addition to her work with her brother William Herschel early in her career. She was the first woman to receive a salary as a scientists, the first woman to hold a government position in England, the first woman to publish scientific findings in the Philosophical Transactions of the Royal Society.

The **arrow** and the **line** below Caroline name in the package's logo illustrate the aim of the package: to be able to **show and annotate everything**.
""",
    fontSize=0.8,
)
p.rightImage(
    "./presentation_files/Caroline_Herschel.jpeg",
    textBelow="Caroline Herschel  at 78, one year after winning the Gold Medal of the Royal Astronomical Society in 1828. She also received Prussian Gold Medal for Science in 1846.",
    fontSize=0.8,
    height=400,
)

p.newSlide()
p.title("How to start using Caroline package?")
p.spanText(
    r"""
Install it with `pip` from command line:
```
pip install caroline-presentation
```

In the folder where you want to make your presentation run
```
python -m caroline.template
```

This creates a template presentation in the folder. Edit presentation by changing
`presentation_code.py` in your favourite code editor. Save changes and run
```
python presentation_code.py
```
To open/preview presentation open `presentation.html` (or just refresh page if it is already opened).

""",
    fontSize=0.9,
)

p.newSlide()
p.title("How does my `presentation_code.py` looks like?")
p.spanText(
    r"""
Simple text file starting with definition of few general things (logo of institution etc...)
```python
from caroline import Presentation
p = Presentation(...)
```
$+$ arbitrary number of `p.newSlide()` followed with `p.title(...)` and/or a number of


position | + Element  | = commandName(...)
:-- | :-- | :--
`span`, `spanCenter`, `left`, `right`, `grid`  | + `Text`, `MP4`, `Image`, `IFrame`, `MyCamera`  | = `spanText(...)` for example

If using `grid` for position, call `p.makeGrid` after `p.newSlide` to define grid for positioning elements.
In addition to slides, one can use `p.newQuiz(...)` to define quiz.
Finally generate HTML of your presentation with
```python
p.save("presentation_name.html")
```
""",
    fontSize=0.9,
)


p.newSlide()
p.title("Some useful references")
p.spanText(
    r"""
* Instead of empty template you can explore also full example presentation by calling `python -m caroline.example` and start from there.

* Since your presentation is defined with plain-text .py file, it is easy to use `git` to
track versions and branch subversions. Check [cheatsheet](https://www.git-tower.com/blog/git-cheat-sheet/) and [git documentation](https://git-scm.com/).

* [Markdown cheatsheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf) and [emoji cheatsheet](https://listemoji.com/cheat-sheet#nigh).

>  The aim of science is not to open the door to infinite wisdom, but to set a limit to infinite error.
> ― Bertolt Brecht, *Life of Galileo*

<!-- -->
>  \[A scientist should aim to\] make the world more easily understandable.
> ― Sir Peter Medawar paraphrased, *Advice To A Young Scientist*

""",
    fontSize=0.9,
)

p.save("./presentation.html")
