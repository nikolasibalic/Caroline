# <img src="./caroline/html/images/caroline2.png " alt="Caroline logo" width="200" height="66">

**Caroline** is open-source Python framework for interactive web/HTML+JS based
science presentations.
With Caroline you can show and annotate everything.
Interface is minimalistic and focus is on content, as we stick to the principle that
the best software is the one that you don't realize is there.
Caroline blurs distinction between slides and whiteboard, between
demonstration and derivation, and smoothly even crosses from one way lecturing
to interacting with the audience, allowing real-time note-taking, quizzes and even
all-to-all collaboration.
With Caroline making flow of ideas smooth, we can now reimagine how lectures can
look! Caroline is made specifically not just to impress the audience
but to allow you to do everything you possibly can to reach "aha!" moment
of understanding and inspiration, thanks to

* **Simple input:** supports full markdown support, LaTeX, code highlighting, zoomable figures; shows blinking pointer when mouse/pen pressed...

* **Annotations** textual or by drawing during lecture **over anything** (text, video, figure...)

* **Camera support:** for lecturer view; multiple camera for experimental demonstrations

* **Interactive elements:** interactive figures, 3D objects, movies, JavaScript simulations and other IFrames

* **Audience engagement:** quizzes, Roundtable discussions and feedback, audience slide-copy supports annotations and exploration in parallel with a lecture

* **Simply portable, with a decluttered interface focused on really necessary**: Works in any web browser (from PC to smart fridge), even offline (assuming that no online materials are added in IFrames). Presentation is defined with
a human readable plain text file that can be easily versioned with git.

**Example presentation** that highlights Caroline's capabilities [is available here](https://nikolasibalic.github.io/caroline/example/presentation.html). The links open lecturer copy. To see
audience copy, follow the link on the first opened slide, but keep lecturer copy open to control presentation and see audience-submitted responses.

Example of stand-alone **Roundtable** - surface for collaborative feedback -
 which is part of is available at [https://roundtable.researchx3d.com](https://roundtable.researchx3d.com) as a public demo server.
Roundtable can be accessed from within the Caroline framework also.
When used as support during meetings (in-person, video conference or mixed),
it is ideally viewed opened on horizontal tablet surface while keeping
vertical surface for direct view of collaborators, keeping the usual geometry of
in-person meetings.

 [![PyPI version](https://badge.fury.io/py/Caroline-presentation.svg)](https://badge.fury.io/py/Caroline-presentation)

## Get started in 5 minutes

Start by installing Caroline package from calling Python pip ([install Python first](https://www.anaconda.com/products/individual) if you don't have it)
from the command line :

```
pip install caroline-presentation
```

In the folder where you want to make your presentation run
```
python -m caroline.template
```

This creates a template presentation in the folder. Edit presentation by changing
`presentation_code.py` in your favorite code editor. Save changes and run
```
python presentation_code.py
```
To open/preview a presentation open `presentation.html` (or just refresh the page if it is already opened).

Alternatively, if you want to start from one full example of presentation, run

```
python -m caroline.example
```

To see other methods to start presentation that has support for
interaction with the audience, or that is automatically pre-filled
with material you have provided in a folder, please check
[ways to start a new presentation](doc/start.md).

## Name and logo

**Caroline** is named after [Caroline Herschel](https://en.wikipedia.org/wiki/Caroline_Herschel)
(1750-1848) who was a pioneering astronomer and scientist. She had independent
scientific career as a creator of New General Catalogue and discoverer of several
comets, in addition to her work with her brother
[William Herschel](https://en.wikipedia.org/wiki/William_Herschel) (1738 -1822)
early in her career. She was the first woman to receive a salary as a
scientists, the first woman to hold a government position in England,
the first woman to publish scientific findings in the Philosophical
Transactions of the Royal Society.

The **arrow** and the **line** below Caroline name in the package's logo illustrate
the aim of the package to **show and annotate everything**.

**Roundtable** is part of the Caroline framework, inspired by collaborative feedback
sessions during supervision meetings. It is named after famous [Round table of
King Arthur](https://en.wikipedia.org/wiki/Round_Table), where everyone
is equal, since when using Roundtable everyone can contribute, manipulate
and annotate the content equally.


## Authors & contributing

Developed by [Nikola Šibalić](https://github.com/nikolasibalic), with
encouragement, constructive feedback and early testing by
 [Charles S. Adams](https://www.dur.ac.uk/physics/staff/profiles/?id=523).

If you like the Caroline, or Roundtable sub-project, please spread the word!

If you want to contribute to the project check [contributing guidelines](CONTRIBUTING.md). Caroline is open-source, build with open-source stack of tools with aim to be flexible and adjustable.

## License

All the files distributed with this program are provided subject to the
BSD-3-Clause license. A copy of the license is provided.
