# Ways to start a new presentation

There are four main ways to start a new presentation.

### If you don't need interaction with the audience

Run  in terminal/command line

```
python -m caroline.template
```

### If you need interaction with audience (Quiz, all-to-all Roundtable)

Run  in terminal/command line

```
python -m caroline.template_quiz
```

### If you are efficient with time or just feeling lazy

Start pasting all your slide materials into subfolder named for example `presentation_folder`. Then in the main folder run in terminal/command line

```
python -m caroline.folder2presentation ./presentation_folder
```

This will generate `presentation_f2p.py` that places on separate slide every
single material from your `presentation_folder`. Recognized file types are
images (.jpg, .jpeg, .png, .gif), IFrame content (.html) and .mp4 files. Files
in other formats are ignored. Note that files are inserted on individual slides
in alphabetical order. Therefore, if you enumerate your files like 01-filename,
02-filename... 12-filename..., you will even get a good order of slides in
presentation. Run `python presentation_f2p.py` to generate HTML and open
`presentation.html` then to see results!

### If you want to start with modifying existing example

Run  in terminal/command line

```
python -m caroline.example
```
