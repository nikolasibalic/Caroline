# Frequently asked questions

### Can I save my slides as PDF?

Yes, slides can be saved, together with annotations, using the
Save presentation button that appears after the last slide
of the presentation. Note that for using this functionality
your presentation has either to be on web-server or run on
local server using `python -m caroline.preview` .

### Do I have to put presentation on some server online?

No, you can edit and use your presentation from your computer.
You don't even need to have connection to internet - at least
not if you are not loading content from Internet as IFrame.

Only situation in which you do need to put somewhere online
your slides is if you are using interaction with audience
feature - audience needs to be able to access their version
online, and path to the online version you have to specify in
`presentationServer` keyword when initialising presentation.
In this way audience is provided with good QR code before your
first presentation slide, so they connect their devices to that.
Simplest is to put them on github pages but you can put
also on some institutional password-protected server.
