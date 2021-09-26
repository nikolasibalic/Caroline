var fullScreen = false;
var slideIndex = 0;
var cursor =  document.getElementById("cursor");

var timeout1 = null;
var timeout2 = null;
var timeout3 = null;
var timeout4 = null;
var timeoutRoundtable = null;
var timeoutPDFpage = null;
var timeoutNotify = null;
var useSVG = true;
var drawLine = null;
var roundtableModeratorTimout = null;
var scroller = null;  // who scrolles ?
var presentationServerActive = false;

function resize(){
  if (roundTable || singleUserTable){
    resizeRoundtable();
  }
  else{
    resizeSlide();
  }
}

function initApp(){
  var a = getQueryVariable("a");
  if (a !== undefined){
    roundTableAuth = a;
  }
  a = getQueryVariable("r");
  if (a !== undefined){
    roundTableServer = decodeURIComponent(a);
  }
  a = getQueryVariable("l");
  if (a !== undefined){
    room = a;
  }

  document.getElementById("slidespace").addEventListener('mousemove', cursor_mousemove); //Attach an event listener
  document.getElementById("slidespace").addEventListener('mouseleave', hide_cursor); //Attach an event listener
  document.getElementById("slidespace").addEventListener('touchmove', cursor_mousemove_touch); //Attach an event listener
  document.getElementById("slidespace").addEventListener('touchend', hide_cursor); //Attach an event listener

  if (useSVG){
    drawLine = drawLineSVG;
  }
  else{
    drawLine = drawLineRaster;
  }

  window.onkeyup = function(e) {
      if (roundTable
          || singleUserTable
          || document.getElementById("controlspace").children[16].style.display == "block"){
        // we are just doing text annotation
        return;
      }
      var kc = e.keyCode;
      e.preventDefault();
      if      (kc === 39) {nextSlide();}
     // else if (kc === 38) Keys.up = false;
      else if (kc === 37) {previousSlide();};
      //else if (kc === 40) Keys.down = false;
  };
  window.addEventListener('resize', resize);
  window.addEventListener('popstate', function(){
    // we went back in history with back button
    getSlideFromURL();
    showSlide(true);  // true value prevents pushing state to history
  });


  var d = document.getElementById("controlspace");
  var c = document.getElementById("cameraspace");
  var rtp = document.getElementById("roundtable_participants");
  if (leftHanded){
    d.style.right="0px";
    c.style.left="0px";
    rtp.style.left="0px";
  }
  else {
    d.style.left="0px";
    c.style.right="0px";
    rtp.style.right="0px";
  }
  d = d.children;
  d[0].style.display="none";
  d[0].addEventListener("click", function(){
    if (roundTableExit!= null){ roundTableExit(); }
  });

  d[1].addEventListener("click",function(e){
    if (fullScreen){
      closeFullScreen();
    }
    else{
      openFullScreen();
    }
    e.preventDefault();
  })
  d[2].onclick = function(e){
    nextSlide()
    e.preventDefault();
  };
  d[3].onclick = function(e){
    previousSlide()
    e.preventDefault();
  };
  d[4].addEventListener("click",function(e){
    openPointer();
    e.preventDefault();
  });
  d[4].style.display="none";
  d[5].addEventListener("click",function(e){
    document.getElementById("controlspace").children[4].style.backgroundImage = 'url("./caroline/images/draw.png")';
    openSketchPad();
    e.preventDefault();
  });

  d[6].children[0].style.backgroundColor = 'rgb(0,0,0)';
  d[6].addEventListener("mousedown",function(e){
    penColor = [0,0,0,255];
    document.getElementById("cursor").children[0].style.backgroundColor=
      'rgba(0,0,0,0.7)';
    e.preventDefault();
    var te = document.getElementById("textannotation");
    if (te){ // text editor active
      te.style.color = "rgb(" + penColor[0]+"," +penColor[1]+"," + penColor[2]+")";
    }
  });
  d[6].style.display="none";

  d[7].children[0].style.backgroundColor = 'rgb(231,70,73)';
  d[7].addEventListener("mousedown",function(e){
    penColor = [231,70,73,255];
    document.getElementById("cursor").children[0].style.backgroundColor=
      'rgba(231,70,73,0.7)';
    e.preventDefault();
    var te = document.getElementById("textannotation");
    if (te){ // text editor active
      te.style.color = "rgb(" + penColor[0]+"," +penColor[1]+"," + penColor[2]+")";
    }
  });
  d[7].style.display="none";
  d[8].children[0].style.backgroundColor = 'rgb(246,209,84)';
  d[8].addEventListener("mousedown",function(e){
    penColor = [246,209,84,255];
    document.getElementById("cursor").children[0].style.backgroundColor=
      'rgba(246,209,84,0.7)';
    e.preventDefault();
    var te = document.getElementById("textannotation");
    if (te){ // text editor active
      te.style.color = "rgb(" + penColor[0]+"," +penColor[1]+"," + penColor[2]+")";
    }
  });
  d[8].style.display="none";
  d[9].children[0].style.backgroundColor = 'rgb(58,124,242)';
  d[9].addEventListener("mousedown",function(e){
    penColor = [58,124,242,255];
    document.getElementById("cursor").children[0].style.backgroundColor=
      'rgba(58,124,242,0.7)';
    e.preventDefault();
    var te = document.getElementById("textannotation");
    if (te){ // text editor active
      te.style.color = "rgb(" + penColor[0]+"," +penColor[1]+"," + penColor[2]+")";
    }
  });
  d[9].style.display="none";

  d[10].style.display="none";
  d[10].addEventListener("click",function(e){
    if (penSize>10){
      penSize = Math.round(penSize*0.9);
    }
    else{
      penSize = Math.round(penSize-1);
    }
    if (penSize<1){penSize=1;}
    minLineLength = Math.max(2, Math.round(penSize*0.05));
    e.target.innerHTML = penSize+" px";
    cursor.children[0].style.height= penSize+"px";
    cursor.children[0].style.width= penSize+"px";
    if (timeout1!= null){ clearTimeout(timeout1); }
    timeout1 = setTimeout(function clearLine1() {
      document.getElementById("controlspace").children[10].innerHTML="";
    }, 1000);
    e.preventDefault();
  });

  d[11].style.display="none";
  d[11].addEventListener("click",function(e){
    if (penSize>10){
      penSize = Math.round(penSize*1.1);
    }
    else{
      penSize = Math.round(penSize+1);
    }
    if (penSize>60){penSize=60;}
    minLineLength = Math.max(2, Math.round(penSize*0.05));
    e.target.innerHTML =  penSize+" px";
    cursor.children[0].style.height= penSize+"px";
    cursor.children[0].style.width= penSize+"px";
    if (timeout2!= null){ clearTimeout(timeout2); }
    timeout2 = setTimeout(function clearLine2() {
      document.getElementById("controlspace").children[11].innerHTML="";
    }, 1000);
    e.preventDefault();
  });

  d[12].addEventListener("click",function(e){
    document.getElementById("controlspace").children[4].style.backgroundImage = 'url("./caroline/images/text.png")';
    addOrEditText();
    e.preventDefault();
  })
  if (!presenter){
    d[13].style.display="none";
  }
  d[13].addEventListener("click",function(e){
    startRoundtable();
    e.preventDefault();
  });

  d[14].style.display="none";
  d[14].addEventListener("click",function(e){
    document.getElementById("selectedimage").click();
  });
  document.getElementById("selectedimage").addEventListener("change", shareImage);

  d[15].style.display="none";
  d[15].addEventListener("click",function(e){
    e.preventDefault();
    if (pdfSource == null && roundTableData[currentSurface].file == null){
      saveScreenshot();
    }
    else if (roundTableData[currentSurface].file != null){
      confirmChoice("Do you want to download shared source code file (without annotations)<br> or annotated image of the full source code?",
         "Download shared file",
         function (){
           downloadFile(
             roundTableData[currentSurface].file,
             timestampFilename() +"-code"+roundTableData[currentSurface].extension,
             "text/plain");
         },
         "Get annotated code as png",
         saveScreenshot
      );
    }
    else{
      confirmChoice("Do you want to download shared PDF (without annotations)<br> or annotated image of current view (single page)?",
         "Download shared PDF",
         function (){
           downloadFile(
             pdfSource,
             timestampFilename() +"-PDF.pdf",
             "application/pdf");
         },
         "Get current annotated view",
         saveScreenshot
        );
      }
  });

  d[16].style.display="none";
  d[16].addEventListener("mousedown",function(e){
    fontSize = Math.min(Math.round(fontSize*1.1*100)/100, 6);
    var d = document.getElementById("textannotation");
    if (d != null ){ d.style.fontSize = fontSize + "em"; }
    e.target.innerHTML =  fontSize;
    if (timeout3!= null){ clearTimeout(timeout3); }
    timeout3 = setTimeout(function clearLine2() {
      document.getElementById("controlspace").children[16].innerHTML="";
    }, 1000);
    e.preventDefault();
  });

  d[17].style.display="none";
  d[17].addEventListener("mousedown",function(e){
    fontSize = Math.max(Math.round(fontSize/1.1*100)/100, 0.35);
    var d = document.getElementById("textannotation");
    if (d != null ){ d.style.fontSize = fontSize + "em"; }
    e.target.innerHTML =  fontSize;
    if (timeout4!= null){ clearTimeout(timeout4); }
    timeout4 = setTimeout(function clearLine2() {
      document.getElementById("controlspace").children[17].innerHTML="";
    }, 1000);
    e.preventDefault();
  });

  d[18].style.display="none";
  d[18].addEventListener("click",function(e){
    if (useSVG){
      if (lineCount>0){
        if (roundTable){
          socket.emit('send_room',
            {"action":"remove",
             "id":lineCount,
             "username": username,
             "room": room});
        }
        var l = document.getElementById("l"+lineCount+"-"+username);
        l.parentElement.removeChild(l);
        lineCount -= 1;
      }
    }
    else{
      canvas = document.getElementById('sketchpad');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    e.preventDefault();
  });
  d[19].style.display="none";
  d[19].onclick = function(e){
    if (roundTable){
      socket.emit('send_room',
        {"action":"clearAll",
         "username": username,
         "room": room});
     }
    cleanRoundtable();
    e.preventDefault();
  };
  d[20].style.display="none";
  d[20].addEventListener("click", function(){
    if (roundTable){
      socket.emit('send_room',
        {"action":"surface_new",
         "id": currentSurface,
         "room": room});
    }
    newSurface(currentSurface);
  });

  d = document.getElementById("slidespace");
  d.addEventListener('mousedown', cursor_blink_on, false);
  d.addEventListener('mouseup', cursor_blink_off, false);
  d.addEventListener('touchstart', cursor_blink_on, false);
  d.addEventListener('touchend', cursor_blink_off, false);

  d = document.getElementById("cameraspace").children[0];
  d.addEventListener("click",function(){showCameraOptions();});

  var h = window.location.hash.substr(1);

  if (presenter){
    document.getElementById("cameraspace").style.display="block";
  }
  else{
    document.getElementById("cameraspace").style.display="none";
  }

  document.getElementById("controlspace").style.display="block";
  document.getElementById("slidespace").style.display="block";

  roundtableModeratorTimout = function(){return;};

  if (!roundTable && ((h.indexOf("slide")==0) || h.length<10)){
    if (presenter && presentationServer != ""){
      username = "Lecturer";
      lecturerConnection();
    }
    else if(!presenter && roundTableAuth){
      username = "Audience";
      audienceConnection();
    }
    else{
      getSlideFromURL();
      showSlide();
    }
  }
  else{
    startRoundtable();
  }
}

function audienceConnection(){
  socket = io(roundTableServer,  {
      "query": {"auth2":roundTableAuth
    }
  });
  presentationConnection();
  window.onbeforeunload = function(event) {
    return "Are you sure you want to stop following presentation?";
  };
}

function showPresentationLink(){
  slideIndex = -1;
  document.getElementById("slidespace").innerHTML =
    "<div class='slide'><div class='spancenter'><h2>Follow presentation with your annotations on</h2><div id='qr'>connecting to server...</div></div></div>";
  document.getElementById("qr").innerHTML = "<img src='"
    + roundTableServer + "/api/qrpres/?q=" +  encodeURIComponent(presentationServer)
    +"&a="+ roundTableAuth
    +"&r="+ encodeURIComponent(roundTableServer)
    +"&l="+ encodeURIComponent(room) +"' ><br>"
    +"<input value='" + presentationServer
    +"?a="+ roundTableAuth
    +"&r="+ encodeURIComponent(roundTableServer)
    +"&l="+ encodeURIComponent(room)+ "' >";
}

function lecturerConnection(){
  roundTableModerator = true;
  socket = io(roundTableServer,  {
      "query": {"pkey":roundTableAuth,
      "site":  presentationServer
    }
  });
  presentationConnection();
  slideIndex = -1;
  window.onbeforeunload = function(event) {
    return "Are you sure you want to stop current presentation?";
  };
}

var maxSlideIndex = 1000000;

function presentationConnection(){
  socket.on('connect', function() {
    presentationServerActive = true;
    if (username.indexOf("=")==-1){
      username = username + "=" + socket.id;
    }

    //  join room if specified, if not open new room
    if (room ==null){
        room = window.location.hash.substr(1);
    }
    var existingRoom = true;

    if ((room=="") || (room.indexOf("slide")==0)){
      //var array = new Uint32Array(1);
      ///window.crypto.getRandomValues(array);
      room =  socket.id + "L";
      //history.pushState("", "", location.protocol+'//'+location.host+location.pathname + "#"+room);
      roundTableModerator = true;
      tableWidth = 0.8 * window.innerWidth;
      tableHeight = window.innerHeight;
      resize();
      existingRoom = false;
      document.getElementById("roundtable_participants").innerHTML = " Participants: "+
       "<span id='"+username.substr(username.indexOf("=")+1) +"'>" +
         username.substr(0,username.indexOf("=")) + "</span>";
    }
    if (!roundTableModerator){
      if (timeoutRoundtable!= null){ clearTimeout(timeoutRoundtable); }
      timeoutRoundtable = setTimeout(roundtableModeratorTimout, 6000);
    }
    socket.emit('join_room',
        {"username": username,
         "room": room});
    if (presenter){
      getSlideFromURL();
      if (slideIndex==0){
          showPresentationLink();
      }
      else{
        showSlide();
        if (room != null){
          socket.emit("send_room",
            {"action":"maxslide",
            "i":slideIndex,
            "room":room});
        }
      }
      socket.on("presentationstate",function(m){
        socket.emit("presentationstate",{
          "to":m["from"],
          "slideIndex":Math.max(slideIndex,0),
          "roundtable":roundTable
        });
      });

    }
    else{
      // get current max slide and slide index
      socket.on("presentationstate",function(m){
        slideIndex = m["slideIndex"];
        maxSlideIndex = slideIndex;
        showSlide();
        if (m["roundtable"]){ startRoundtable(); }
      });
      socket.emit("presentationstate",
      {
        "from": socket.id,
        "to":room.substr(0,room.length - 1),
      });
    }
    if (roundTableCallBack != null){
      roundTableCallBack(existingRoom);}
   });

   socket.on('initial_response',function(m){
     if (!presenter){
       maxSlideIndex=0;
       slideIndex=0;
       showSlide();
     }

     roundTableAuth = m["token"];
   });

   socket.io.on("reconnect_attempt", () => {
     //notify("Connection lost. Reconnecting...");
     socket.io.opts.query = {"auth2":roundTableAuth};
   });

   socket.on('connect_error', function (data) {
       notify("Connection error.");
   });

   socket.on("new_user",function(m){
     if (m["username"]==username) { return; }
     var d = document.getElementById("roundtable_participants");
     if (document.getElementById(m["sid"])==null){
       var s=" Participants: ";
       if (d.innerHTML!=""){
         s += d.innerHTML.substr(15);
       }
       d.innerHTML =
         s +
        "<span id='"+m["sid"]+"'>" +
          m["username"].substr(0,m["username"].indexOf("=")) + "</span>";
     }
     if (roundTableModerator){
       socket.emit("send_user",
         {"userid":m["username"].substr(m["username"].indexOf("=")+1),
          "action":"introduceNewMember",
          "sid":m["sid"],
          "list":d.innerHTML.substr(15),
          "tableWidth":tableWidth,
          "tableHeight":tableHeight
         })
     }
   });

   socket.on('user_disconnected',function(m){
     socket.emit("room_user_left",{
       "userid":m["userid"],
       "room":room,
       "action":"memberLeft"
     });
   });
   socket.on('m', mouseMoveHandler);
   socket.on('update_state', updateHadler);

   socket.on("quizanswers",function(m){
     while (m["qid"] >= quizAnswers.length){
       quizAnswers.push({});
     }

     quizAnswers[m["qid"]][m["u"]] = m["a"];

     if (activeQuizId != null && activeQuizId == m["qid"]){
       addQuizResultsButton(m["qid"]);
     }
   });

   socket.io.on("reconnect_attempt", () => {
     //notify("Connection lost. Reconnecting...");
     socket.io.opts.query = {"auth2":roundTableAuth};
   });
   socket.on('connect_error', function (data) {
       notify("Connection error.");
   });
}

function addQuizResultsButton(quizId){
  // if we are not showing results at the moment
  if (answersHTML.length ==0){
    var count = document.getElementById("responseCount"+quizId);
    if (count !=null){
      count.innerHTML = "<input id='seeresults' data-qid="
       + quizId + " type='button' value='See responses ("
       + Object.keys(quizAnswers[quizId]).length +")'>";
       document.getElementById("seeresults").onclick = function(e){
         showQuizAnalysis(quizId);
       }
    }
  }
  else{
    //update histogram
    showQuizHistogram(quizId);
  }
}

function showQuizAnalysis(qid){
  var question = document.getElementsByClassName("quizq");
  questionHTML = "";
  for (var i=0; i<question.length; i+=1){
    questionHTML += question[i].parentElement.outerHTML;
  }
  answersHTML = [];
  while (document.getElementsByClassName("quiza").length > 0){
    var answer = document.getElementsByClassName("quiza")[0];
    answer.classList.add('resultanswer');
    answer.classList.remove('quiza');
    answersHTML[parseInt(answer.dataset["aid"] ,10)] = answer.outerHTML;
  }
  showQuizHistogram(qid);
}

function showQuizHistogram(qid){
  closeExistingSlide();
  var d = document.getElementById("slidespace");

  d.innerHTML = "<div class='slide'><div class='gridslide' style='grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 33.33%)'>"
    + questionHTML
    + "<div id='resultspace' style='padding:0.3em;grid-column: 1 / 3; grid-row: 2 / 4; font-size:1.00e+00m'></div></div>";

  var accumulatedAnswers = {};
  var totalAnswers = Object.keys(quizAnswers[qid]).length;
  for (var i=0; i<totalAnswers; i += 1){
    var key = Object.keys(quizAnswers[qid])[i];
    var index = "";
    for (var j=0; j<quizAnswers[qid][key].length; j+=1 ){
      index += quizAnswers[qid][key][j];
    }

    if (index in accumulatedAnswers){
      accumulatedAnswers[index] += 1/totalAnswers;
    }
    else{
      accumulatedAnswers[index] = 1/totalAnswers;
    }
  }

  var t = document.createElement("table");
  t.classList.add("quizresultview");
  for (var i =0; i< Object.keys(accumulatedAnswers).length; i += 1){
    var tr = document.createElement("tr");
    var key = Object.keys(accumulatedAnswers)[i];
    var answers = "";
    var selectedAnswers = key.split("");
    for (var j=0; j<selectedAnswers.length; j+= 1){
      answers += answersHTML[parseInt(selectedAnswers[j], 10)] + "&nbsp;";
    }
    tr.innerHTML = "<td>" + answers
      + "</td><td><div class='histogram' style='width:"
      + accumulatedAnswers[key]*100 + "%'>&nbsp;&nbsp;"
      + parseInt(accumulatedAnswers[key]*Object.keys(quizAnswers[qid]).length ,10)
      + "</div></td>";
    t.appendChild(tr);
  }
  document.getElementById('resultspace').appendChild(t);

  var count = document.getElementById("responseCount"+qid);
  if (count !=null){
    count.innerHTML = "<input id='seeresults' data-qid="
     + qid + " type='button' value='Go back to questions ("
     + Object.keys(quizAnswers[qid]).length +")'>";
     document.getElementById("seeresults").onclick = function(e){
       showSlide(true);
     }
  }
}

var quizAnswers = [];
var activeQuizId = null;
var answersHTML = [];
var questionHTML = null;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return undefined;
}

function newSurface(where){
  // make newSpace
  where +=1;
  roundTableData = [
    ...roundTableData.slice(0,where),
    {
      surface:[],
      pdfSource:null,
      pageNum:1,
      multipageAnnotations:[],
      annotationAnchor:null,
      file:null,
      extension:null,
      timestamp:0,
      scroll:[0,0]
    },
    ...roundTableData.slice(where)
  ];
  var controls = document.getElementById("controlspace").children;
  if (roundTableData.length>1){
    controls[2].style.display="block";
    controls[3].style.display="block";
  }
  else{
    controls[2].style.display="none";
    controls[3].style.display="none";
  }
  openSurface(where);
}

function saveSurface(){
  if (!(roundTable || singleUserTable)){ return; }   // loading existing slide from presentations
  var s = [];
  collectAnnotationPage(pageNum);
  roundTableData[currentSurface].pageNum = pageNum;
  if (annotationAnchor != null){
    roundTableData[currentSurface].scroll = [annotationAnchor.scrollTop,
      annotationAnchor.scrollLeft];
  }
  while (document.getElementById("slidespace").children.length > 0){
    s.push(document.adoptNode(document.getElementById("slidespace").children[0]));
  }
  roundTableData[currentSurface].surface = s;
  roundTableData[currentSurface].pdfSource = pdfSource;
  roundTableData[currentSurface].multipageAnnotations = multipageAnnotations;
  roundTableData[currentSurface].annotationAnchor = annotationAnchor;
  annotationAnchor = null;
}

function openSurface(surfaceId){
  saveSurface();
  annotationAnchor = null;
  currentSurface = surfaceId;
  var addDrawingHelp = sketchpadActive;


  multipageAnnotations = roundTableData[currentSurface].multipageAnnotations;
  pdfSource = roundTableData[currentSurface].pdfSource;

  if(roundTableData[currentSurface].surface==null
    && roundTableData[currentSurface].pdfSource != null){
      // received file as update but have not yet digested this...
    roundTableData[currentSurface].pdfSource = new Blob( [ roundTableData[currentSurface].pdfSource ] );
  }
  if(roundTableData[currentSurface].surface==null
    && roundTableData[currentSurface].file != null){
    roundTableData[currentSurface].file = new Blob( [ roundTableData[currentSurface].file ] );
  }

  if (roundTableData[currentSurface].pdfSource != null){
    pageNum = roundTableData[currentSurface].pageNum;
    openPDF(roundTableData[currentSurface].pdfSource);
    openPointer();
    sketchpadActive = false;
  }
  else {
    initRoundTableSurface();  // NOTE; this sets sketchpadActive to false ; hence we need addDrawingHelp
    if (roundTableData[currentSurface].surface != null
      && roundTableData[currentSurface].surface.length > 0){
      // this is saved slide, we don't need default canvas
      document.getElementById("slidespace").innerHTML = "";

      while (roundTableData[currentSurface].surface.length > 0 ){
        document.getElementById("slidespace").appendChild(
          roundTableData[currentSurface].surface.pop());
      }
    }

    if (addDrawingHelp){
      openDrawingHelp();
      openSketchPad();
    }
    else{
      closeDrawingHelp();
      openPointer();
    }
    sketchpadActive = addDrawingHelp;
    pageNum = 1;
    annotationAnchor = roundTableData[currentSurface].annotationAnchor;
    if (roundTableData[currentSurface].surface==null){
      // surface received in update call
      // check if you need to open some files
      if (roundTableData[currentSurface].file != null){
        var allowedExtensions =  /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
          openImage(roundTableData[currentSurface].file,
            roundTableData[currentSurface].extension);
        }
        allowedExtensions =  /(\.sh|\.c|\.cpp|\.h|\.cc|\.c\+\+|\.cxx|\.hxx|\.cs|\.css|\.txt|\.diff|\.go|\.html|\.xml|\.json|\.java|\.js|\.less|\.lua|\.make|\.gmk|\.md|\.php|\.pl|\.py|\.sql|\.r|\.rb|\.rs|\.swift|\.vb|\.yaml|\.f|\.f95|\.f90|\.f03|\.f08|\.ftn|\.for|\.mat|\.jl|\.m|\.nb|\.wl)$/i;
        if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
          openCode(roundTableData[currentSurface].file,
            roundTableData[currentSurface].extension);
        }
        allowedExtensions =  /(\.ipynb)$/i;
        if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
           openIpynb(roundTableData[currentSurface].file);
        }
      }
    }
    setAnnotationPage(pageNum);
  }
  getLineCount();
  if (annotationAnchor != null){
    annotationAnchor.scrollTop = roundTableData[currentSurface].scroll[0];
    annotationAnchor.scrollLeft = roundTableData[currentSurface].scroll[1];
  }
  notify("Surface "+(currentSurface+1)+" of " + roundTableData.length +".");
}

function notify(text){
  var n = document.getElementById("notify");
  n.children[0].innerHTML=text;
  n.style.display = "block";
  if (timeoutNotify!= null){ clearTimeout(timeoutNotify); }
  timeoutNotify = setTimeout(function(){
      document.getElementById("notify").style.display = "none";
    }, 1000);
}

function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

function onInputResize(e) {
  e.target.style.height = "auto";
  e.target.style.height = (e.target.scrollHeight) + "px";
}

function deactiveteSlideClicks(){
  var ifr = document.getElementsByClassName("sframe");
  for (var i=0; i < ifr.length; i += 1){
    ifr[i].classList.add( "canvas-inactive");
  }
  var img = document.getElementsByClassName("simage");
  for (var i=0; i < img.length; i += 1){
    img[i].classList.add( "canvas-inactive");
  }
  if (annotationAnchor != null){
    annotationAnchor.removeEventListener("pointerdown",mouseDownDragHandler);
    var a = annotationAnchor.getElementsByTagName("a");
    for (var i=0; i < a.length; i += 1){
      a[i].classList.add( "canvas-inactive");
    }
  }
  //var c = document.getElementsByTagName("code");
  //for (var i=0; i < c.length; i += 1){
  //  c[i].removeEventListener("pointerdown",mouseDownDragHandler);
 // }
}

function activateSlideClicks(){
  var ifr = document.getElementsByClassName("sframe");
  for (var i=0; i < ifr.length; i += 1){
    ifr[i].classList.remove( "canvas-inactive");
  }
  var img = document.getElementsByClassName("simage");
  for (var i=0; i < img.length; i += 1){
    img[i].classList.remove( "canvas-inactive");
  }
  //var c = document.getElementsByTagName("code");
  //for (var i=0; i < c.length; i += 1){
  //  c[i].classList.remove( "canvas-inactive");
  //  c[i].addEventListener("pointerdown",mouseDownDragHandler);
 // }
  if (annotationAnchor != null){
    annotationAnchor.addEventListener("pointerdown",mouseDownDragHandler);
    var a = annotationAnchor.getElementsByTagName("a");
    for (var i=0; i < a.length; i += 1){
      a[i].classList.remove( "canvas-inactive");
    }
  }
}

function textAdder(e){
  var ta = document.createElement("textarea");
  //ta.setAttribute("rows",10);
  //ta.setAttribute("columns",10);
  ta.id = "textannotation";
  ta.classList.add("textannotation");
  ta.setAttribute("placeholder","Type text or $LaTeX$...")

  if (annotationAnchor==null){
    ta.style.fontSize = fontSize + "em";
    ta.style.left = (e.clientX - window.innerWidth*0.1)/roundTableScale + "px";
    ta.style.top = e.clientY/roundTableScale+"px";
    document.getElementById("slidespace").appendChild(ta);
  }
  else{
    ta.style.fontSize = fontSize/0.76 + "em"; // because code blocks have smaller em
    ta.style.left = (e.clientX - window.innerWidth*0.1
     )/roundTableScale  + annotationAnchor.scrollLeft + "px";
    ta.style.top = (e.clientY
      )/roundTableScale + annotationAnchor.scrollTop +"px";
    annotationAnchor.appendChild(ta);
  }
  ta.style.height = ta.scrollHeight + "px";
  if (roundTable){
    ta.style.width = (tableWidth+(window.innerWidth*0.1-e.clientX)/roundTableScale) + "px";
  }
  else{
    ta.style.width = (window.innerWidth*0.9 - e.clientX)+ "px";
  }
  ta.style.color = "rgb(" + penColor[0]+"," +penColor[1]+"," + penColor[2]+")";
  ta.addEventListener("input", onInputResize, false);

  ta.focus();
  document.getElementById("slidespace").removeEventListener("click",textAdder, true);
  ta.addEventListener("blur", convertToDivAndParseMath);
}

function addOrEditText(){
  showTextMenuOptions();
  document.getElementById("slidespace").addEventListener("click", textAdder, true);
}

function showTextMenuOptions(){
  var d = document.getElementById("controlspace").children;
  for (var i=4; i<16; i += 1){
    d[i].style.display = "none";
  }
  d[4].style.display="block";
  d[5].style.display="none";
  d[6].style.display="block";
  d[7].style.display="block";
  d[8].style.display="block";
  d[9].style.display="block";
  d[16].style.display="block";
  d[17].style.display="block";
  d[18].style.display="block";
  d[19].style.display="none";
  d[20].style.display="none";
  deactiveteSlideClicks();
}

function convertToDivAndParseMath(e){
  e = e.target;
  var text = e.value;
  text = escapeHtml(text).replace(/\r?\n/g, '<br>');
  var where = e.parentElement;
  if (text == ""){
    where.removeChild(e);
    openPointer();
    return;
  }
  var d = document.createElement("div");
  d.classList.add("textannotation");
  d.style.left = e.style.left;
  d.style.top = e.style.top;
  d.style.height =  "auto";
  d.style.width = "auto";
  d.style.maxWidth = e.style.width;
  d.style.fontSize = e.style.fontSize;
  d.innerHTML = text;
  var color = e.style.color;
  d.style.color = color;
  e.parentElement.removeChild(e);
  lineCount += 1;
  d.id = "l"+lineCount+"-"+username;
  d.addEventListener("dblclick", textEditor, false);
  d.dataset["s"] = text;  // MathJax migth mess up original
  where.append(d);
  MathJax.typesetClear();
  MathJax.typesetPromise();

  openPointer();

  if (roundTable){
    socket.emit('send_room',
      {"action":"text",
       "id":lineCount,
       "text": text,
       "fontSize": fontSize,
       "color": color,
       "x": parseFloat(e.style.left.replace("px","")),
       "y": parseFloat(e.style.top.replace("px","")),
       "username": username,
       "room": room},
       function (timestamp){
         roundTableData[currentSurface].timestamp = timestamp;
       })
  }
}

function textEditor(e){
  showTextMenuOptions();
  var d = e.target;

  // send info about deletion to other nodes
  var ta = document.createElement("textarea");
  //ta.setAttribute("rows",10);
  //ta.setAttribute("columns",10);
  ta.id = "textannotation";
  ta.classList.add("textannotation");
  ta.setAttribute("placeholder","Type text or $LaTeX$...");
  ta.style.left = d.style.left;
  ta.style.top = d.style.top;
  ta.style.fontSize = d.style.fontSize;
  ta.value = unescapeHtml(d.dataset["s"].replace(/<br>/g,"\n"));
  ta.style.color = d.style.color;

  if (roundTable){
    socket.emit('send_room',
     {"action":"deleteAnnotation",
       "id": d.id,
       "room": room},
     function (timestamp){
       roundTableData[currentSurface].timestamp = timestamp;
     }
    );
  }

  deleteAnnotation(d.id);

  if (annotationAnchor === null){
    document.getElementById("slidespace").appendChild(ta);
  }
  else{
    annotationAnchor.appendChild(ta);
  }
  ta.style.height = ta.scrollHeight + "px";
  if (roundTable){
    ta.style.width = (tableWidth+(window.innerWidth*0.1-e.clientX)/roundTableScale) + "px";
  }
  else{
    ta.style.width = (window.innerWidth*0.9 - e.clientX)+ "px";
  }

  ta.addEventListener("input", onInputResize, false);

  ta.focus();
  document.getElementById("slidespace").removeEventListener("click",textAdder, true);
  ta.addEventListener("blur", convertToDivAndParseMath);
}

function deleteAnnotation(id){
  var d = document.getElementById(id);
  d.parentElement.removeChild(d);
  // allows deleting annotaitons out of order; renumbers other annotations
  var aid = parseInt(id.substr(1,id.indexOf("-")), 10);
  var uid = id.substr(id.indexOf("-"));
  aid += 1;
  while (document.getElementById("l"+aid + uid) !=null){
    var el = document.getElementById("l"+aid+uid);
    el.id = "l"+(aid-1)+uid;
    aid += 1;
  }
  if (uid.substr(1) == username){
    lineCount -= 1;
  }
}

var socket;
var roundTableModerator = false;
var roundTableScale = 1;
var tableHeight = 5;
var tableWidth = 5;


function shareImage(ev, im=undefined){
  cleanRoundtable();
  if (im === undefined){
    im = document.getElementById("selectedimage").files[0];
  }
  if ((im.size/1024/1024)>5){
    alert("Only images up to 5 MB can be shared in this way. "
        +"Selected image has " +
         (Math.round(100*im.size/1024/1024)/100) + " MB.");
    return;
  }
  var allowedExtensions =  /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (allowedExtensions.exec(im.name)) {
    imFileExtension = allowedExtensions.exec(im.name)[0];

    if (roundTable){
      socket.emit('send_room',
        {"action":"image",
         "file":im,
         "extension":imFileExtension,
         "username": username,
         "room": room},
         function (timestamp){
           roundTableData[currentSurface].timestamp = timestamp;
         });
    }
    openImage(im, imFileExtension);
    return;
  }
  allowedExtensions =  /(\.pdf)$/i;
  if (allowedExtensions.exec(im.name)) {
    pageNum = 1;
    openPDF(im);
    if (roundTable){
      socket.emit('send_room',
        {"action":"pdf",
         "file":im,
         "username": username,
         "room": room},
         function (timestamp){
           roundTableData[currentSurface].timestamp = timestamp;
         });
    }
    return;
  }
  allowedExtensions =  /(\.sh|\.c|\.cpp|\.h|\.cc|\.c\+\+|\.cxx|\.hxx|\.cs|\.css|\.txt|\.diff|\.go|\.html|\.xml|\.json|\.java|\.js|\.less|\.lua|\.make|\.gmk|\.md|\.php|\.pl|\.py|\.sql|\.r|\.rb|\.rs|\.swift|\.vb|\.yaml|\.f|\.f95|\.f90|\.f03|\.f08|\.ftn|\.for|\.mat|\.jl|\.m|\.nb|\.wl)$/i;

  if (allowedExtensions.exec(im.name)) {
    imFileExtension = allowedExtensions.exec(im.name)[0];
    if (roundTable){
      socket.emit('send_room',
        {"action":"code",
         "file":im,
         "extension":imFileExtension,
         "username": username,
         "room": room},
         function (timestamp){
           roundTableData[currentSurface].timestamp = timestamp;
         });
    }
    openCode(im, imFileExtension);

    return;
  }

  allowedExtensions =  /(\.ipynb)$/i;
  if (allowedExtensions.exec(im.name)) {
    imFileExtension = allowedExtensions.exec(im.name)[0];
    if (roundTable){
      socket.emit('send_room',
        {"action":"ipynb",
         "file":im,
         "extension":imFileExtension,
         "username": username,
         "room": room},
         function (timestamp){
           roundTableData[currentSurface].timestamp = timestamp;
         });
    }
    openIpynb(im);

    return;
  }
  alert('Invalid file type for sharing.\n Allowed types are .jpg, .jpeg, .png, .gif, .pdf, .ipynb'
+' .sh, .c, .cpp, .h, .cc, .c++, .cxx, .hxx, .cs, .css, .txt, .diff, .go, .html,'
+' .xml, .json, .java, .js, .less, .lua, .make, .gmk, .md, .php, .pl, .py, .sql,'
+' .r, .rb, .rs, .swift, .vb, .yaml, .f, .f95, .f90, .f03, .f08, .ftn, .for,'
+' .mat, .jl, .m, .nb and .wl.');
  return;
}

function openImage(im, extension){
  initRoundTableSurface();
  roundTableData[currentSurface].file = im;
  roundTableData[currentSurface].extension = extension;
  var d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
  var image = document.createElement("img");
  image.classList.add('simage');
  image.addEventListener("mousedown", nodrag);
  image.setAttribute("draggable","false");
  image.src = URL.createObjectURL(im);
  d.appendChild(image);
  setAnnotationPage(pageNum);
}

function openIpynb(im){
  const fr = new FileReader();
  fr.addEventListener('loadend', function(e){
    codeLight();
    document.getElementById("slidespace").innerHTML=
      "<div class='slide'> <div id='ipynb'></div></div>";
      const nbv = nbv_constructor(document, {
          "md": window["markdownit"]().use(window["markdownitMathjax"]()),
          "hljs":hljs
      });
      roundTableData[currentSurface].file = im;
      roundTableData[currentSurface].extension = ".ipynb";
      nbv.render(JSON.parse(e.target.result),
        document.getElementById("ipynb"));
      annotationAnchor = document.getElementById("ipynb");
      annotationAnchor.style.fontSize = Math.round(0.76*(tableWidth/0.8)/1920*40) + "px";
      annotationAnchor.style.lineHeight = Math.round(25.8667 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
      annotationAnchor.scrollTop = roundTableData[currentSurface].scroll[0];
      annotationAnchor.scrollLeft = roundTableData[currentSurface].scroll[1];
      // annotationAnchor.scrollLeft = 0;
      // annotationAnchor.scrollTop = 0;
      var codes = document.getElementById("slidespace").getElementsByTagName("code");
      for (var i =0; i<codes.length; i +=1){
        codes[i].style.fontSize = Math.round(0.65*(tableWidth/0.8)/1920*40) + "px";
        codes[i].style.lineHeight = Math.round(25.8667 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
      }
      codes = document.getElementsByTagName("div");
      for (var i =0; i<codes.length; i +=1){
        codes[i].style.lineHeight = Math.round(30 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
      }
      codes = document.getElementsByTagName("p");
      for (var i =0; i<codes.length; i +=1){
        codes[i].style.lineHeight = Math.round(30 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
      }
      codes = document.getElementsByTagName("pre");
      for (var i =0; i<codes.length; i +=1){
        codes[i].style.lineHeight = Math.round(25.8667 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
      }

      newSketchpad(); openPointer();
      annotationAnchor.addEventListener('pointerdown', mouseDownDragHandler);
      annotationAnchor.addEventListener("scroll", onScroll);
      setAnnotationPage(pageNum);
      var imageList = annotationAnchor.getElementsByTagName("img");
      for (var i=0; i<imageList.length; i += 1){
        imageList[i].addEventListener("mousedown", nodrag);
        imageList[i].setAttribute("draggable","false");
        imageList[i].addEventListener("load",function(e){
          resize();
        });
      }
      resize();
  });
  fr.readAsText(im);
}

function openCode(im, imFileExtension)
{
  const fr = new FileReader();
  fr.addEventListener('loadend', function(e){
    document.getElementById("slidespace").innerHTML=
      "<div class='slide'> <pre><code class='language-" + fileExtension2Language[imFileExtension]
      + "'> "+ escapeHtml(e.target.result) +"</pre></code></div>";
    hljs.highlightAll();
    roundTableData[currentSurface].file = im;
    roundTableData[currentSurface].extension = imFileExtension;
    annotationAnchor = document.getElementById("slidespace").getElementsByTagName("code")[0];
    annotationAnchor.style.fontSize = Math.round(0.76*(tableWidth/0.8)/1920*40) + "px";
    annotationAnchor.style.lineHeight = Math.round(25.8667 / 27.2292 *(tableWidth/0.8)/1920*40) + "px";
    annotationAnchor.scrollTop = roundTableData[currentSurface].scroll[0];
    annotationAnchor.scrollLeft = roundTableData[currentSurface].scroll[1];
    // annotationAnchor.scrollLeft = 0;
    // annotationAnchor.scrollTop = 0;
    newSketchpad(); openPointer();
    resize();
    annotationAnchor = document.getElementById("slidespace").getElementsByTagName("code")[0];
    annotationAnchor.addEventListener('pointerdown', mouseDownDragHandler);
    annotationAnchor.addEventListener("scroll", onScroll);
    setAnnotationPage(pageNum);
    var  d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
    var nd = document.createElement("div");
    nd.classList.add("pdfcontrol");
    nd.innerHTML = '<button id="dark">Dark</button> '
      +' <button id="light">Light</button>';
    d.append(nd);
    document.getElementById("light").addEventListener("click", function(){
      codeLight()
      socket.emit('send_room',
        {"action":"code_light",
         "username": username,
         "room": room});
    });
    document.getElementById("dark").addEventListener("click", function(){
      codeDark();
      socket.emit('send_room',
        {"action":"code_dark",
         "username": username,
         "room": room});
    });
  });
  fr.readAsText(im);
}

function onScroll(e){
  if ((scroller != username) || (!roundTable)) return;
  socket.emit('send_room',
    {"action":"scroll",
    "top":e.target.scrollTop,
    "left":e.target.scrollLeft,
     "username": username,
     "room": room});
}

function codeLight(){
  document.getElementById("codedarkcss").setAttribute("disabled","disabled");
  document.getElementById("codelightcss").removeAttribute("disabled");
}

function codeDark(){
  document.getElementById("codelightcss").setAttribute("disabled","disabled");
  document.getElementById("codedarkcss").removeAttribute("disabled");
}

var annotationAnchor = null;
let annotationAnchorPos = { top: 0, left: 0, x: 0, y: 0 };
var imFileExtension = null;
const fileExtension2Language = {
  ".sh":"bash",
  ".c":"c",
  ".cpp":"c",
  ".h":"c",
  ".cc":"c",
  ".c++":"c",
  ".cxx":"c",
  ".hxx":"c",
  ".cs":"csharp",
  ".css":"css",
  ".txt":"txt",
  ".diff":"diff",
  ".go":"go",
  ".html":"html",
  ".xml":"xml",
  ".json":"json",
  ".java":"java",
  ".js":"js",
  ".less":"less",
  ".lua":"lua",
  ".make":"make",
  ".gmk":"make",
  ".md":"mf",
  ".php":"php",
  ".pl":"perl",
  ".py":"python",
  ".sql":"sql",
  ".r":"r",
  ".rb":"ruby",
  ".rs":"rust",
  ".swift":"swift",
  ".vb":"vbnet",
  ".yaml":"yaml",
  ".f":"fortran",
  ".f95":"fortran",
  ".f90":"fortran",
  ".f03":"fortran",
  ".f08":"fortran",
  ".ftn":"fortran",
  ".for":"fortran",
  ".mat":"matlab",
  ".jl":"julia",
  ".m":"mathematica",
  ".nb":"mathematica",
  ".wl":"mathematica"
};

function mouseDownDragHandler(e) {
    scroller = username;
    annotationAnchorPos = {
        // The current scroll
        left: annotationAnchor.scrollLeft,
        top: annotationAnchor.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };
    annotationAnchor.style.userSelect = 'none';
    document.addEventListener('pointermove', mouseMoveDragHandler);
    document.addEventListener('pointerup', mouseUpDragHandler);
};

const mouseMoveDragHandler = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - annotationAnchorPos.x;
    const dy = e.clientY - annotationAnchorPos.y;

    // Scroll the element
    annotationAnchor.scrollTop = annotationAnchorPos.top - dy/roundTableScale;
    annotationAnchor.scrollLeft = annotationAnchorPos.left - dx/roundTableScale;
};

const mouseUpDragHandler = function(ele) {
    //ele.style.cursor = 'grab';
    annotationAnchor.style.removeProperty('user-select');
    document.removeEventListener('pointermove', mouseMoveDragHandler);
    document.removeEventListener('pointerup', mouseUpDragHandler);
};

function collectAnnotationPage(pageNum){
  if (pageRendering) return;
  var t =[];
  while (document.getElementsByClassName("textannotation").length > 0) {
    t.push(document.adoptNode(document.getElementsByClassName("textannotation")[0]));
  }
  var svg = "";
  if (document.getElementById("sketchpad") != null){
    svg = document.getElementById("sketchpad").innerHTML;
    document.getElementById("sketchpad").innerHTML="";
  }

  multipageAnnotations[pageNum] = {
    "svg":svg,
    "text":t
  };
}

function setAnnotationPage(pageNum){
  if (multipageAnnotations[pageNum] == undefined) return;
  document.getElementById("sketchpad").innerHTML += multipageAnnotations[pageNum]["svg"];
  while (multipageAnnotations[pageNum]["text"].length>0){
      document.getElementById("sketchpad").parentElement.appendChild(
        multipageAnnotations[pageNum]["text"].pop());
  }
  getLineCount();
  MathJax.typesetClear();
  MathJax.typesetPromise();
}

var multipageAnnotations = {};  // when slide has more than one page (e.g. pdf)

function openPDF(im){
  initRoundTableSurface();
  pdfSource = im;
  roundTableData[currentSurface].pdfSource = im;
  var d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
  d.innerHTML +='<canvas id="pdf-canvas"></canvas>'
    ;
   canvasPDF = document.getElementById('pdf-canvas');
   ctxPDF = canvasPDF.getContext('2d');

   /**
   * Asynchronously downloads PDF.
   */
   pdfjsLib.getDocument(URL.createObjectURL(im)).promise.then(function(pdfDoc_) {
     pdfDoc = pdfDoc_;
     if (pdfDoc.numPages > 1){
       var  d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
       var nd = document.createElement("div");
       nd.classList.add("pdfcontrol");
       nd.innerHTML = '<button id="prev">&nbsp;&lt;&nbsp;&lt;&nbsp;</button> '
         +'<span><span id="textpdfpage">1</span><input type="range" id="pdfpage" name="pdfPage"  min="1" max="1"><span>'
         +' <button id="next">&nbsp;&gt;&nbsp;&gt;&nbsp;</button>';
       d.append(nd);
       document.getElementById('pdfpage').max = pdfDoc.numPages;
       document.getElementById("pdfpage").addEventListener("change",function(e){
          var num = parseInt(document.getElementById("pdfpage").value, 10);
          collectAnnotationPage(pageNum);
          pageNum = num;
          queueRenderPage(num);
       });
       document.getElementById('prev').addEventListener('click', onPrevPage);
       document.getElementById('next').addEventListener('click', onNextPage);
     }
     // Initial/first page rendering
     renderPage(pageNum);
   });
}

var pdfSource = null,
    pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvasPDF = null,
    ctxPDF = null;


/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  roundTableData[currentSurface].pageNum = pageNum;
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport({"scale":1});
    var scale = Math.min(tableWidth / viewport.width, tableHeight/viewport.height)
    viewport = page.getViewport({"scale": scale});
    canvasPDF.height = viewport.height;
    canvasPDF.width = viewport.width;
    canvasPDF.style.height = viewport.height + "px";
    canvasPDF.style.width = viewport.width+ "px";
    canvasPDF.style.marginLeft = (tableWidth - viewport.width)/2+ "px";
    canvasPDF.style.marginTop = (tableHeight - viewport.height)/2+ "px";


    // Render PDF page into canvas context
    var renderContext = {
      "canvasContext": ctxPDF,
      "viewport": viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
      else{
        setAnnotationPage(pageNum);
      }
    });
  });

  // Update page counters
  var pageCounterIndicator = document.getElementById('pdfpage');
  if (pageCounterIndicator !=null){
    pageCounterIndicator.value = num;
  }
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  queueRenderPage_nosend(num);
  socket.emit('send_room',
    {"action":"pdf_page",
     "page":num,
     "username": username,
     "room": room},
     function (timestamp){
       roundTableData[currentSurface].timestamp = timestamp;
     });
}

function queueRenderPage_nosend(num){
  document.getElementById('textpdfpage').innerHTML = "pdf page "+num +" of "+ pdfDoc.numPages;
  document.getElementById("textpdfpage").style.display="inline-block";
  if (timeoutPDFpage!= null){ clearTimeout(timeoutPDFpage); }
  timeoutPDFpage = setTimeout(function clearLine1() {
    document.getElementById("textpdfpage").style.display="none";
  }, 1000);
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  collectAnnotationPage(pageNum);
  pageNum--;
  queueRenderPage(pageNum);
}


/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  collectAnnotationPage(pageNum);
  pageNum++;
  queueRenderPage(pageNum);
}

function timestampFilename(){
  var now = new Date();
  return "roundtable_" + now.getFullYear() +"-"
     + ((now.getMonth()<10)?"0":"")
     + now.getMonth()+"-"+((now.getDate()<10)?"0":"") + now.getDate()
     +"_at_"+((now.getHours()<0)?"0":"")+now.getHours()
     +"-"+((now.getMinutes()<0)?"0":"")+now.getMinutes()
     +"-"+now.getSeconds();
}

function timestampFilenamePresentation(){
  var now = new Date();
  return "presentation_slides_" + now.getFullYear() +"-"
     + ((now.getMonth()<10)?"0":"")
     + now.getMonth()+"-"+((now.getDate()<10)?"0":"") + now.getDate()
     +"_at_"+((now.getHours()<0)?"0":"")+now.getHours()
     +"-"+((now.getMinutes()<0)?"0":"")+now.getMinutes()
     +"-"+now.getSeconds();
}

function downloadFile(data, filename, mime) {
  // Source : https://gist.github.com/davalapar/d0a5ba7cce4bc599f54800da22926da2
  if (data==null) return;
  const blob = new Blob([data], {"type": mime || 'application/octet-stream'});
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  setTimeout(() => {
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}

function saveScreenshot(){
  var screenshotTarget = document.getElementById("slidespace");
  var scale = 1980 / window.innerWidth;
  if (annotationAnchor === null){
    html2canvas(screenshotTarget, { "scale": scale, "logging": false, "useCORS": true,
       "allowTaint": true,  "letterRendering": true,
     }).then((canvas) =>{
     const base64image = canvas.toDataURL("image/png") ;
     var filename = timestampFilename() + ".png";
     saveAs(base64image, filename);
     });
  }
  else{
    screenshotTarget.style.width = annotationAnchor.scrollWidth + "px";
    screenshotTarget.style.height = annotationAnchor.scrollHeight + "px";
    html2canvas(screenshotTarget, { "scale": scale, "logging": false, "useCORS": true,
       "allowTaint": true,
       width: annotationAnchor.scrollWidth,
       height: annotationAnchor.scrollHeight/0.99  }).then((canvas) =>{
     const base64image = canvas.toDataURL("image/png") ;
     var filename = timestampFilename() + ".png";
     saveAs(base64image, filename);
     resize();
     });
  }
}

function cleanRoundtable(){
  annotationAnchor = null;
  roundTableData[currentSurface].file = null;
  roundTableData[currentSurface].extension = null;
  roundTableData[currentSurface].timestamp = 0;
  roundTableData[currentSurface].pageNum = 1;
  pdfSource = null;
  pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 0.8,
  canvasPDF = null,
  ctxPDF = null;
  multipageAnnotations = [];
  initRoundTableSurface();
}

function initRoundTableSurface(){

  var d = document.getElementById("controlspace").children;
  d[0].style.display = "block";
  d[1].style.display = "none";
  //d[2].style.display = "none";
  //d[3].style.display = "none";
  d[11].style.display = "block";
  d[13].style.display = "none";
  d[14].style.display = "block";
  d[15].style.display="block";
  d[19].style.display = "block";
  d[20].style.display = "block";
  document.getElementById("cameraspace").style.display = "none";
  d = document.getElementById("slidespace");
  d.innerHTML = "<div class='slide' ></div>";
  newSketchpad(); openPointer();
  resize();
  d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
  d.addEventListener('drop',
    function(e){
      e.preventDefault();
      if (e.dataTransfer.items) {
        if (e.dataTransfer.items.length>0
          && e.dataTransfer.items[0].kind === 'file') {
            shareImage(e, e.dataTransfer.items[0].getAsFile());
          }
      }
      else {
        if (e.dataTransfer.files.length>0) {
          shareImage(e, e.dataTransfer.files[0]);
        }
      }
  });
  document.addEventListener("dragover", function(e) {
      e.preventDefault();
  });
  lineCount = 0;
}

var roundTableData = [
  {
    surface:[],
    pdfSource:null,
    pageNum:1,
    multipageAnnotations:[],
    annotationAnchor:null,
    file:null,
    extension:null,
    timestamp:0,
    scroll:[0, 0]
  }
];
var currentSurface = 0;

var roundTableOpenedBefore = false;
var singleUserTable = false;

function startRoundtable(){
   closeExistingSlide();
   // overwrite next and previous slide with next and previous roundtable space
   var d = document.getElementById("controlspace").children;
   d[2].onclick = function(e){
     e.preventDefault();
     if (currentSurface < roundTableData.length-1){
       openSurface(currentSurface + 1);
       if (roundTable){
         socket.emit('send_room',
           {"action":"surface_change",
            "id": currentSurface,
            "room": room});
        }
     }
     else{
       notify("This is last surface. Click on + to add more.");
     }
   };
   d[2].setAttribute('title',"Next surface");
   d[3].onclick = function(e){
     e.preventDefault();
     if (currentSurface > 0){
       openSurface(currentSurface - 1);
       if (roundTable){
         socket.emit('send_room',
           {"action":"surface_change",
            "id": currentSurface,
            "room": room});
        }
     }
     else{
       notify("This is the first surface.");
     }
   };
   d[3].setAttribute('title',"Previous surface");

   // hide commands while we have only one space
   if (roundTableData==null || roundTableData.length==1){
     d[2].style.display = "none";
     d[3].style.display = "none";
   }
   else{
     d[2].style.display = "block";
     d[3].style.display = "block";
   }

   document.getElementById("roundtable_participants").style.display = "block";

   if (!roundTableOpenedBefore){
      if (roundTableServer != ""){
          roundTable = true;
      }
      else{
        singleUserTable = true;
      }
      cleanRoundtable();
   }
   else{
     initRoundTableSurface();
     openSurface(currentSurface);
     if (roundTableServer != ""){
         roundTable = true;
     }
     else{
       singleUserTable = true;
     }
   }
   d[13].style.display = "none";
   d[14].style.display = "block";
   d[19].style.display="block";
   d[20].style.display="block";


   roundTableOpenedBefore = true;

   if (!presentationServerActive){
      roundTableConnection();
   }
   else{
     if (presenter){
       if (roundTable){
         socket.emit("send_room",
           {"action":"openroundtable",
           "room":room});
       }
       d[0].onclick = closeRoundtable;
     }
     else{
       d[0].onclick = function(){
         alert("Only lecturer can initiate leaving of Roundtable.");
       }
     }
   }
}

function closeRoundtable(){

  saveSurface();
  sketchpadOpen = false;
  if (presenter && roundTable){
    socket.emit("send_room",
      {"action":"closeroundtable",
      "room":room});
  }

  // hide all cursors
  var c = document.getElementsByClassName("cursor");
  for (var i = 0; i < c.length; i += 1){
    p_hide_cursor(c[i]);
  }

  // order of this two commands is important to prevent saving roundtable as slide
  showSlide();
  roundTable = false;
  singleUserTable = false;
  openPointer();
  var d = document.getElementById("controlspace").children;
  d[0].style.display = "none";
  d[1].style.display = "block";
  d[2].onclick = function(e){
    nextSlide()
    e.preventDefault();
  };
  d[2].setAttribute('title',"Next surface");
  d[3].onclick = function(e){
    previousSlide()
    e.preventDefault();
  };
  d[3].setAttribute('title',"Previous surface");
  // hide commands while we have only one space
  d[2].style.display = "block";
  d[3].style.display = "block";
  if (presenter){
    d[13].style.display = "block";
  }
  d[14].style.display = "none";
  d[15].style.display = "none";
  d[19].style.display = "none";
  d[20].style.display = "none";
  document.getElementById("roundtable_participants").style.display = "none";
  if (presenter){
    document.getElementById("cameraspace").style.display="block";
  }
  d = document.getElementById("slidespace");
  d.style.transform = "scale(1,1)";
  resize();
}

function mouseMoveHandler(m){
  if (roundTable){
    mouseMoveTable(m);
  }
  else{
    mouseMoveTable(m);
  }
}

function updateHadler(m){
  if (roundTable){
    updateStateTable(m);
  }
  else{
    updateStatePresentation(m);
  }
}

function mouseMoveTable(m){
  moveMouse(
    m["x"]*roundTableScale + window.innerWidth*0.1,
    m["y"]*roundTableScale, userCursor(m["u"])
  );
}

function updateStateTable(m){
  if(m["action"]=="cursorhide"){
    p_hide_cursor( userCursor(m["username"]) );
  }
  else if(m["action"]=="closeroundtable"){
    closeRoundtable();
  }
  else if(m["action"]=="line"){
    var l = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    l.setAttribute("style", m["style"]);
    l.setAttribute("points", m["points"]);
    var lineID = "l"+m["id"]+"-"+m["username"];
    l.id = lineID;
    document.getElementById("sketchpad").appendChild(l);
    smoothLine(lineID);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="image"){
   var blob = new Blob( [ m["file"] ] );
    var d = document.getElementById("slidespace").getElementsByClassName('slide')[0];
    cleanRoundtable();
    openImage(blob, m["extension"]);
    roundTableData[currentSurface].file = blob;
    roundTableData[currentSurface].extension = m["extension"];
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="pdf"){
    cleanRoundtable();
    var blob = new Blob( [ m["file"] ] );
    pageNum = 1;
    openPDF(blob);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="pdf_page"){
    collectAnnotationPage(pageNum);
    pageNum = m["page"];
    queueRenderPage_nosend(m["page"]);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="code"){
    var blob = new Blob( [ m["file"] ] );
    cleanRoundtable();
    openCode(blob, m["extension"]);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="ipynb"){
    var blob = new Blob( [ m["file"] ] );
    cleanRoundtable();
    openIpynb(blob);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="scroll"){
    scroller = m["username"];
    annotationAnchor.scrollTop = m["top"];
    annotationAnchor.scrollLeft = m["left"];
  }
  else if(m["action"]=="code_light"){
    codeLight();
  }
  else if(m["action"]=="code_dark"){
    codeDark();
  }
  else if(m["action"]=="blink_on"){
    userCursor(m["username"]).classList.add('cursor_blinks');
  }
  else if(m["action"]=="memberLeft"){
    var d  = document.getElementById(m["userid"]);
    d.parentElement.removeChild(d);
  }
  else if(m["action"]=="blink_off"){
    userCursor(m["username"]).classList.remove('cursor_blinks');
  }
  else if(m["action"]=="remove"){
    var lineID = m["id"]+"-"+m["username"];
    var l = document.getElementById("l"+lineID);
    l.parentElement.removeChild(l);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if (m["action"]=="clearAll"){
    cleanRoundtable();
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="text"){
    var lineID = m["id"]+"-"+m["username"];
    var d = document.createElement("div");
    d.classList.add("textannotation");
    d.classList.add("canvas-inactive");
    d.style.left = m["x"] + "px";
    d.style.top = m["y"] + "px";
    d.style.height =  "auto";
    d.style.width = "auto";
    d.style.fontSize = m["fontSize"] + "em";
    d.innerHTML = m["text"];
    d.style.color = m["color"];
    d.id = "l"+lineID;
    if (annotationAnchor == null){
        document.getElementById("slidespace").append(d);
    }
    else{
        annotationAnchor.append(d);
    }
    roundTableData[currentSurface].timestamp = m["t"];
    MathJax.typesetClear();
    MathJax.typesetPromise()
  }
  else if(m["action"]=="introduceNewMember"){
    if (timeoutRoundtable!= null){ clearTimeout(timeoutRoundtable); }
    notify("You have joined the Roundtable.");
    var d = document.getElementById("roundtable_participants");
    d.innerHTML = " Participants: "+m["list"];
    tableWidth = m["tableWidth"];
    tableHeight = m["tableHeight"];
    resizeRoundtable();

    var timestamps = [];
    for (var i=0; i<roundTableData.length; i += 1){
      timestamps.push(roundTableData[i].timestamp);
    }

    socket.emit("send_user",
      {"sid":socket.id,
       "action":"updateme",
       "timestamps":timestamps
     })
  }
  else if(m["action"]=="surface_change"){
    openSurface(m["id"]);
  }
  else if(m["action"]=="surface_new"){
    newSurface(m["id"]);
  }
  else if(m["action"]=="deleteAnnotation"){
    deleteAnnotation(m["id"]);
    roundTableData[currentSurface].timestamp = m["t"];
  }
  else if(m["action"]=="updateme"){
    var update = [];
    var fileCount = 0;
    var response = {};

    if (annotationAnchor != null){
      roundTableData[currentSurface].scroll = [
        annotationAnchor.scrollTop,
        annotationAnchor.scrollLeft
      ]
    }

    for (var i=0; i<roundTableData.length; i += 1){
      if ((i>=m["timestamps"].length) ||
       (roundTableData[i].timestamp > m["timestamps"][i])) {
         update.push(
           {
             surface : null,
             pdfSource :  roundTableData[i].pdfSource,
             pageNum : roundTableData[i].pageNum,
             multipageAnnotations : roundTableData[i].multipageAnnotations,
             annotationAnchor : null,
             file : roundTableData[i].file,
             extension : roundTableData[i].extension,
             timestamp : roundTableData[i].timestamp,
             scroll: roundTableData[i].scroll,
           });
       }
       else{
         update.push(null);
       }
    }

    socket.emit("send_user",
      {"sid":m["sid"],
       "action":"update",
       "update":update,
       "currentSurface":currentSurface,
       "surface":document.getElementById("slidespace").innerHTML
    });
  }
  else if(m["action"]=="update"){
    var update = m["update"];
    for (var i = 0; i <update.length; i += 1){
      if (i >= roundTableData.length){
        roundTableData.push(update[i]);
      }
      if (update[i] != null){
        roundTableData[i] =update[i];
      }
    }
    currentSurface = m["currentSurface"];
    document.getElementById("slidespace").innerHTML = m["surface"];
    sketchpadEventListeners();
    if (roundTableData[currentSurface].pdfSource != null){
      roundTableData[currentSurface].pdfSource = new Blob(
        [ roundTableData[currentSurface].pdfSource ]);
      pageNum = roundTableData[currentSurface].pageNum;
      collectAnnotationPage(pageNum);
      openPDF(roundTableData[currentSurface].pdfSource);
    }
    else if(roundTableData[currentSurface].file != null){
      pageNum = roundTableData[currentSurface].pageNum;
      collectAnnotationPage(pageNum);
      initRoundTableSurface();
      roundTableData[currentSurface].file = new Blob([
        roundTableData[currentSurface].file
      ]);
      var allowedExtensions =  /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
        openImage(roundTableData[currentSurface].file,
          roundTableData[currentSurface].extension);
      }
      allowedExtensions =  /(\.sh|\.c|\.cpp|\.h|\.cc|\.c\+\+|\.cxx|\.hxx|\.cs|\.css|\.txt|\.diff|\.go|\.html|\.xml|\.json|\.java|\.js|\.less|\.lua|\.make|\.gmk|\.md|\.php|\.pl|\.py|\.sql|\.r|\.rb|\.rs|\.swift|\.vb|\.yaml|\.f|\.f95|\.f90|\.f03|\.f08|\.ftn|\.for|\.mat|\.jl|\.m|\.nb|\.wl)$/i;
      if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
        openCode(roundTableData[currentSurface].file,
          roundTableData[currentSurface].extension);
      }
      allowedExtensions =  /(\.ipynb)$/i;
      if (allowedExtensions.exec(roundTableData[currentSurface].extension)){
         openIpynb(roundTableData[currentSurface].file);
      }
    }
    openPointer();
    var controls = document.getElementById("controlspace").children;
    if (roundTableData.length>1){
      controls[2].style.display="block";
      controls[3].style.display="block";
    }
    else{
      controls[2].style.display="none";
      controls[3].style.display="none";
    }
  }
}

function mouseUpdatePresentation(m){
  return;
}

function updateStatePresentation(m){
  if (m["action"]=="maxslide"){
    if (!presenter){
      maxSlideIndex = Math.max(maxSlideIndex, m["i"]);
      if (maxSlideIndex == slideIndex + 1){
        nextSlide();
      }
      else if (m["i"]>slideIndex){
        notify("You are behind the lecturer (slide " + slideIndex + "/"+maxSlideIndex+")");
      }
    }
  }
  else if(m["action"]=="openroundtable"){
    startRoundtable();
  }
  else if(m["action"]=="memberLeft"){
    var d  = document.getElementById(m["userid"]);
    d.parentElement.removeChild(d);
  }
  else if(m["action"]=="introduceNewMember"){
    if (timeoutRoundtable!= null){ clearTimeout(timeoutRoundtable); }
    var d = document.getElementById("roundtable_participants");
    d.innerHTML = " Participants: "+m["list"];
    tableWidth = m["tableWidth"];
    tableHeight = m["tableHeight"];

    var timestamps = [];
    for (var i=0; i<roundTableData.length; i += 1){
      timestamps.push(roundTableData[i].timestamp);
    }

    socket.emit("send_user",
      {"sid":socket.id,
       "action":"updateme",
       "timestamps":timestamps
     })
  }
  else if(m["action"]=="updateme"){
    var update = [];
    var fileCount = 0;
    var response = {};

    if (annotationAnchor != null){
      roundTableData[currentSurface].scroll = [
        annotationAnchor.scrollTop,
        annotationAnchor.scrollLeft
      ]
    }

    for (var i=0; i<roundTableData.length; i += 1){
      if ((i>=m["timestamps"].length) ||
       (roundTableData[i].timestamp > m["timestamps"][i])) {
         update.push(
           {
             surface : null,
             pdfSource :  roundTableData[i].pdfSource,
             pageNum : roundTableData[i].pageNum,
             multipageAnnotations : roundTableData[i].multipageAnnotations,
             annotationAnchor : null,
             file : roundTableData[i].file,
             extension : roundTableData[i].extension,
             timestamp : roundTableData[i].timestamp,
             scroll: roundTableData[i].scroll,
           });
       }
       else{
         update.push(null);
       }
    }

    socket.emit("send_user",
      {"sid":m["sid"],
       "action":"update",
       "update":update,
       "currentSurface":currentSurface,
       "surface":document.getElementById("slidespace").innerHTML
    });
  }
  else if(m["action"]=="update"){
    var update = m["update"];
    for (var i = 0; i <update.length; i += 1){
      if (i >= roundTableData.length){
        roundTableData.push(update[i]);
      }
      if (update[i] != null){
        roundTableData[i] =update[i];
      }
    }
  }
}

function roundTableConnection(){
  if (roundTableServer == ""){
    singleUserTable = true;
    tableWidth = 0.8 * window.innerWidth;
    tableHeight = window.innerHeight;
    roundTableModerator = true;
    roundTable = false;
    var d = document.getElementById("controlspace").children;
    d[0].onclick = closeRoundtable;
    resizeRoundtable();
    return;
  }
  else{
    singleUserTable = false;
  }
  socket = io(roundTableServer,  {
      "query": {"auth":roundTableAuth}
  });

  socket.on('connect', function() {
    if (username.indexOf("=")==-1){
      username = username + "=" + socket.id;
    }

    //  join room if specified, if not open new room
    room = window.location.hash.substr(1);
    var existingRoom = true;

    if ((room=="") || (room.indexOf("slide")==0)){
      var array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      room =  socket.id +  array;
      history.pushState("", "", location.protocol+'//'+location.host+location.pathname + "#"+room);
      roundTableModerator = true;
      tableWidth = 0.8 * window.innerWidth;
      tableHeight = window.innerHeight;
      resize();
      existingRoom = false;
      document.getElementById("roundtable_participants").innerHTML = " Participants: "+
       "<span id='"+username.substr(username.indexOf("=")+1) +"'>" +
         username.substr(0,username.indexOf("=")) + "</span>";
    }
    if (!roundTableModerator){
      if (timeoutRoundtable!= null){ clearTimeout(timeoutRoundtable); }
      timeoutRoundtable = setTimeout(roundtableModeratorTimout, 6000);
    }
    socket.emit('join_room',
        {"username": username,
         "room": room});
    if (roundTableCallBack != null){
      roundTableCallBack(existingRoom);}
   });

   socket.on('initial_response',function(m){
     roundTableAuth = m["token"];
   })

   socket.io.on("reconnect_attempt", () => {
     //notify("Connection lost. Reconnecting...");
     socket.io.opts.query = {"auth2":roundTableAuth};
   });
   socket.on('connect_error', function (data) {
       notify("Connection error.");
   });
   socket.on("new_user",function(m){
     if (m["username"]==username) { return; }
     var d = document.getElementById("roundtable_participants");
     if (document.getElementById(m["sid"])==null){
       var s=" Participants: ";
       if (d.innerHTML!=""){
         s += d.innerHTML.substr(15);
       }
       d.innerHTML =
         s +
        "<span id='"+m["sid"]+"'>" +
          m["username"].substr(0,m["username"].indexOf("=")) + "</span>";
     }
     if (roundTableModerator){
       socket.emit("send_user",
         {"userid":m["username"].substr(m["username"].indexOf("=")+1),
          "action":"introduceNewMember",
          "sid":m["sid"],
          "list":d.innerHTML.substr(15),
          "tableWidth":tableWidth,
          "tableHeight":tableHeight
         })
     }
   });
   socket.on('user_disconnected',function(m){
     socket.emit("room_user_left",{
       "userid":m["userid"],
       "room":room,
       "action":"memberLeft"
     });
   });
   socket.on('m', mouseMoveHandler);
   socket.on('update_state', updateHadler);
}

function userCursor(username){
  var c = document.getElementById("c"+username);
  if (c==null){
    c = document.createElement("div");
    c.classList.add("cursor");
    c.id = "c"+username;
    c.innerHTML = '<div class="cursor-icon"><div class="cursor-name">'
      + username.substr(0,username.indexOf("="))
      + '</div></div>';
    document.getElementById("cursor").parentElement.appendChild(c);
  }
  return c;
}

var presenterVideoStream;

function listCameras(mediaDevices, where, callbackFunction) {
  var d;
  if (where === undefined){
    d = document.getElementById("cameraspace");
  }
  else{
    d = where;
  }
  if (callbackFunction === undefined){
    callbackFunction = function(e){
        if (e.target){
          addCameraStream(e.target.dataset.deviceid,e.target.dataset.facing);
       }
      };
  }
  d.innerHTML="<p>Select camera:</p>";
  var options = document.createElement("ul");
  let count = 0;


  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      count += 1;
    }
  });

  if (count ==1){
    var option = document.createElement('li');
    option.dataset.facing ="user";
    option.innerHTML = "Front facing";
    option.addEventListener("click",callbackFunction)
    options.append(option);

    option = document.createElement('li');
    option.dataset.facing ="environment";
    option.innerHTML = "Back facing";
    option.addEventListener("click",callbackFunction);
    options.append(option);
  }

  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('li');
      option.dataset.deviceid = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      option.innerHTML = label;
      option.addEventListener("click",callbackFunction);
      options.append(option);
    }
  });
  d.append(options);
}

function showCameraOptions(where=undefined, callbackFunction=undefined){
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.enumerateDevices().then(
      function(mediaDevices){
       listCameras(mediaDevices,where, callbackFunction);
     });
  }
}

function addCameraStream(deviceId, facing){
  var request = {video:true};
  if (deviceId !==undefined && deviceId != ""){
    request = { video:{deviceId:{exact: deviceId}}, audio:false };
  }
  else if(facing!==undefined && facing != ""){
    request = { video:{facingMode:facing}, audio:false };
  }
  document.getElementById("cameraspace").innerHTML="Adding camera...";
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia(request).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        presenterVideoStream = stream;
        var video = document.createElement("video");
        video.id="presentervideo";
        var w = Math.round(window.innerWidth*0.1);
        var h = Math.round(w/640*480);
        video.setAttribute("width",w + "px");
        video.setAttribute("height",h + "px");
        var d = document.getElementById("cameraspace");
        d.innerHTML="";
        d.append(video);
        video.addEventListener("click",function(){
          presenterVideoStream.getTracks().forEach(function(track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
          var d = document.getElementById("cameraspace");
          d.removeChild(d.children[0]);
          var c = document.createElement("div");
          c.classList.add("camera");
          c.title="Add camera in the corner";
          c.addEventListener("click",function(){showCameraOptions();});
          d.append(c);
        });
        video.title="Click to stop camera";
        video.srcObject = stream;
        video.play();
    });
  }
}


function cursor_blink_on(){
  if (sketchpadActive) return;
  if(!cursor.classList.contains('cursor_blinks')) {
    cursor.classList.add('cursor_blinks');
    if (roundTable){
      socket.emit('send_room',
        {"action":"blink_on",
         "username": username,
         "room": room});
    }
  }
}

function getSlideFromURL(){
  var selectedSlide = window.location.hash.substr(1);
  slideIndex=0;
  if (selectedSlide != ""){
    if (selectedSlide.indexOf("slide")==0){
      selectedSlide = selectedSlide.substring(5);
      slideIndex = parseInt(selectedSlide,10);
    }
  }
}

function cursor_blink_off(){
  if(cursor.classList.contains('cursor_blinks')) {
    cursor.classList.remove('cursor_blinks');
    if (roundTable){
      socket.emit('send_room',
        {"action":"blink_off",
         "username": username,
         "room": room});
    }
  }
}


// ===================== sketchpad start =======================

var sketchpadOpen = false;
var sketchpadActive = false;
var canvas = null;
var ctx = null;
var mouseX,mouseY,mouseDown=0;
var touchX,touchY;
var penSize = 5; // px
var fontSize = 1; // em
var penColor = [0,0,0,255];
var minLineLength = 2;

function openPointer(){
  if (sketchpadActive){
    var s = document.getElementById("sketchpad");
    s.classList.add( "canvas-inactive");
    sketchpadActive=false;
    closeDrawingHelp();
  }
  var d = document.getElementById("controlspace").children;
  d[4].style.display="none";
  d[5].style.display="block";
  d[6].style.display="none";
  d[7].style.display="none";
  d[8].style.display="none";
  d[9].style.display="none";
  d[10].style.display="none";
  d[11].style.display="none";
  d[12].style.display="block";
  //d[13].style.display="block";
 // d[15].style.display="none";
  d[16].style.display="none";
  d[17].style.display="none";
  d[18].style.display="none";
  document.getElementById("cursor").children[0].style.backgroundColor=
    'rgba(188, 40, 35, 0.7)';
  cursor.children[0].style.height= 15+"px";
  cursor.children[0].style.width= 15+"px";
   document.getElementById("slidespace").removeEventListener("click", textAdder, true);
  activateSlideClicks();
  if (roundTable || singleUserTable){
    d[14].style.display="block";
    d[15].style.display="block";
    d[19].style.display="block";
    d[20].style.display="block";
  }
  else{
    d[14].style.display="none";
    d[19].style.display="none";
    if (presenter){
      d[13].style.display="block";
    }
  }
}

function newSketchpad(){
  if (!useSVG){
    newSketchpadRaster();
    return;
  }
  sketchpadOpen = true;
  sketchpadActive = true;
  var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.id="sketchpad";
  var d = annotationAnchor;
  if (d == null){
    d = document.getElementById("slidespace");
    s.setAttribute("width", Math.round(window.innerWidth*0.8));
    s.setAttribute("height", window.innerHeight);
  }
  else{
    s.setAttribute("width", annotationAnchor.scrollWidth);
    s.setAttribute("height", annotationAnchor.scrollHeight);
  }
  d.append(s);

  sketchpadEventListeners();

  if (drawingHelp != ""){
    addDrawingHelp();
    // turn off slide background
    openDrawingHelp();
  }
}

function sketchpadEventListeners(){
  var s = document.getElementById("sketchpad");
  s.addEventListener('mousedown', sketchpad_mouseDown, false);
  s.addEventListener('mousemove', sketchpad_mouseMove, false);
  window.addEventListener('mouseup', sketchpad_mouseUp, false);
  s.addEventListener('touchstart', sketchpad_touchStart, false);
  s.addEventListener('touchmove', sketchpad_touchMove, false);
  window.addEventListener('touchend', sketchpad_touchEnd, false);
}

function closeDrawingHelp(){
  var slide = document.getElementsByClassName("slide");
  if (slide.length>0){
    slide[0].style.backgroundColor="white";
  }
}

function openDrawingHelp(){
  if (drawingHelp!=""){
    var slide = document.getElementsByClassName("slide");
    if (slide.length>0){
      slide[0].style.backgroundColor="transparent";
    }
  }
}

function addDrawingHelp(width=undefined, height=undefined){
  if ((width == undefined)  ||  (height==undefined)){
    width = window.innerWidth;
    height = window.innerHeight;
  }
  var d = document.getElementsByClassName("slide");
  if (d.length<1){ return ; }
  d = d[0];
  var color = Math.round(255-drawingHelpIntensity*255);
  color = "rgb("+color+","+color+","+color+")";
  var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.id ="drawinghelp";
  s.setAttribute("width", Math.round(width*0.8));
  s.setAttribute("height", height);
  d.append(s);

  if (drawingHelp == "dots"){
    var delta = Math.min(width, height)/15;
    var radius = Math.max(3,delta/15);
    var rows = Math.round(width*0.8/delta)+1;
    var columns = Math.round(height/delta)+1;
    for (var i=1; i < rows; i += 1 ){
      for (var j=1; j < columns; j+= 1){
        let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", i*delta);
        c.setAttribute("cy", j*delta);
        c.setAttribute("stroke-width",0)
        c.setAttribute("fill",color)
        c.setAttribute("r", radius);
        s.append(c);
      }
    }
  }
  else if(drawingHelp == "lines"){
    var delta = Math.min(width,height)/15;
    var thickness = Math.max(2,delta/20);
    var rows = Math.round(width*0.8/delta)+1;
    var columns = Math.round(height/delta)+1;
    var length = Math.round(width*0.8);
    for (var i=1; i < columns; i += 1 ){
      let c = document.createElementNS("http://www.w3.org/2000/svg", "line");
      c.setAttribute("x1", 0);
      c.setAttribute("y1", i*delta);
      c.setAttribute("x2", length);
      c.setAttribute("y2", i*delta);
      c.setAttribute("style","stroke:" + color +";stroke-width:"+thickness);
      s.append(c);
    }
    for (var j=1; j < rows; j+= 1){
      let c = document.createElementNS("http://www.w3.org/2000/svg", "line");
      c.setAttribute("x1", j*delta);
      c.setAttribute("y1", 0);
      c.setAttribute("x2", j*delta);
      c.setAttribute("y2", height);
      c.setAttribute("style","stroke:" + color +";stroke-width:"+thickness);
      s.append(c);
    }
  }

}

function newSketchpadRaster(){
  sketchpadOpen = true;
  sketchpadActive = true;
  var s = document.createElement("canvas");
  var d = document.getElementById("slidespace");
  s.id="sketchpad";
  s.setAttribute("width",(window.innerWidth*0.8)+"px");
  s.setAttribute("height", window.innerHeight + "px");
  d.append(s);

  canvas = document.getElementById('sketchpad');
  if (canvas.getContext)
      ctx = canvas.getContext('2d');

  if (ctx) {
      canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
      canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
      window.addEventListener('mouseup', sketchpad_mouseUp, false);
      canvas.addEventListener('touchstart', sketchpad_touchStart, false);
      canvas.addEventListener('touchmove', sketchpad_touchMove, false);
      window.addEventListener('touchend', sketchpad_touchEnd, false);
  }
}

function openSketchPad(){
  cursor.children[0].style.height= penSize+"px";
  cursor.children[0].style.width= penSize+"px";
  document.getElementById("cursor").children[0].style.backgroundColor=
    'rgba(' + penColor[0]+','+ penColor[1]+','+ penColor[2]+',0.7)';
  if (!sketchpadOpen){
    newSketchpad();
  }
  else if(!sketchpadActive){
    document.getElementById("sketchpad").classList.remove("canvas-inactive")
    sketchpadActive = true;
    openDrawingHelp();
  }
  var d = document.getElementById("controlspace").children;
  d[4].style.display="block";
  d[5].style.display="none";
  d[6].style.display="block";
  d[7].style.display="block";
  d[8].style.display="block";
  d[9].style.display="block";
  d[10].style.display="block";
  d[11].style.display="block";
  d[12].style.display="none";
  d[13].style.display="none";
  d[14].style.display="none";
  d[15].style.display="none";
  d[18].style.display="block";
  d[19].style.display="none";
  d[20].style.display="none";
  deactiveteSlideClicks();
}

// Keep track of the old/last position when drawing a line
  // We set it to -1 at the start to indicate that we don't have a good value for it yet
  var lastX=-1;
  var lastY=-1;
  var firstSegment = false; //prevent drawaing line between palm and pen
  var lineCount = 0;
  var currentLine = null;

function drawLineSVG(ctx,x,y,size) {
  // If lastX is not set, set lastX and lastY to the current position
  if (lastX==-1) {
      lastX=x;
      lastY=y;
      firstSegment = true;
      return;
  }
  else if (firstSegment &&
      (Math.abs(lastX-x)>maxLine || Math.abs(lastY-y)>maxLine)){
    lastX=x;
    lastY=y;
    return;
  }

  if (firstSegment){
    lineCount +=1;
    currentLine = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
    currentLine.id = "l" + lineCount + "-" + username;
    currentLine.setAttribute("points",lastX+","+lastY);
    currentLine.setAttribute("style",
      "stroke-linecap:round;fill:none;stroke:rgba("+
      penColor[0]+","+penColor[1]+","+penColor[2]+","+(penColor[3]/255)+");stroke-width:"+size);
    document.getElementById("sketchpad").append(currentLine);
    firstSegment = false;
  }

  if ((Math.abs(lastX-x)>maxLine || Math.abs(lastY-y)>maxLine)){
    // prevent big jups in lines that happen when screen detects hand first
    // and only later detects tip of the pen
    currentLine.setAttribute("points", x+","+y);
  }
  else{
    currentLine.setAttribute("points", currentLine.getAttribute("points") +" "+ x+","+y);
  }

  // Update the last position to reference the current position
  lastX=x;
  lastY=y;
  }

  // Draws a line between the specified position on the supplied canvas name
  // Parameters are: A canvas context, the x position, the y position, the size of the dot
  function drawLineRaster(ctx,x,y,size) {

      // If lastX is not set, set lastX and lastY to the current position
      if (lastX==-1) {
          lastX=x;
          lastY=y;
          firstSegment = true;
          return;
      }
      else if (firstSegment &&
          (Math.abs(lastX-x)>maxLine || Math.abs(lastY-y)>maxLine)){
        lastX=x;
        lastY=y;
        return;
      }
      else{
        firstSegment = false;
      }

      // Select a fill style
      ctx.strokeStyle = "rgba("+penColor[0]+","+penColor[1]+","+penColor[2]+","+(penColor[3]/255)+")";

      // Set the line "cap" style to round, so lines at different angles can join into each other
      ctx.lineCap = "round";
      //ctx.lineJoin = "round";


      // Draw a filled line
      ctx.beginPath();

      // First, move to the old (previous) position
      ctx.moveTo(lastX,lastY);

      // Now draw a line to the current touch/pointer position
      ctx.lineTo(x,y);

      // Set the line thickness and draw the line
      ctx.lineWidth = size;
      ctx.stroke();

      ctx.closePath();

  // Update the last position to reference the current position
  lastX=x;
  lastY=y;
  }

  function smoothLine(lineID){
    if (lineID==0) return;
    const smoothing = 0.15;
    var l = document.getElementById(lineID);
    if (l===null) return;
    var a = l.getAttribute("points").split(" ");
    var points = [];
    var prevX = -100;
    var prevY = -100;
    if (a.length<5) {return;}
    for (var i=0; i<a.length; i += 1){
      var el = a[i].split(",");
      var x = parseInt(el[0],10);
      var y = parseInt(el[1],10);
      if (Math.abs(x-prevX)>minLineLength
        || Math.abs(y-prevY)>minLineLength){
          points.push([x,y]);
          prevX=x;
          prevY=y;
      }

    }
    if (points.length<5) {return;}

    // Properties of a line
    // I:  - pointA (array) [x,y]: coordinates
    //     - pointB (array) [x,y]: coordinates
    // O:  - (object) { length: l, angle: a }: properties of the line
    const line = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0]
      const lengthY = pointB[1] - pointA[1]
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      }
    }

    // Position of a control point
    // I:  - current (array) [x, y]: current point coordinates
    //     - previous (array) [x, y]: previous point coordinates
    //     - next (array) [x, y]: next point coordinates
    //     - reverse (boolean, optional): sets the direction
    // O:  - (array) [x,y]: a tuple of coordinates
    const controlPoint = (current, previous, next, reverse=undefined) => {

      // When 'current' is the first or last point of the array
      // 'previous' or 'next' don't exist.
      // Replace with 'current'
      const p = previous || current
      const n = next || current

      // Properties of the opposed-line
      const o = line(p, n)

      // If is end-control-point, add PI to the angle to go backward
      const angle = o.angle + (reverse ? Math.PI : 0)
      const length = o.length * smoothing

      // The control point position is relative to the current point
      const x = current[0] + Math.cos(angle) * length
      const y = current[1] + Math.sin(angle) * length
      return [x, y]
    }

    // Create the bezier curve command
    // I:  - point (array) [x,y]: current point coordinates
    //     - i (integer): index of 'point' in the array 'a'
    //     - a (array): complete array of points coordinates
    // O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
    const bezierCommand = (point, i, a) => {

      // start control point
      const cps = controlPoint(a[i - 1], a[i - 2], point)

      // end control point
      const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
      return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
    }

    // Render the svg <path> element
    // I:  - points (array): points coordinates
    //     - command (function)
    //       I:  - point (array) [x,y]: current point coordinates
    //           - i (integer): index of 'point' in the array 'a'
    //           - a (array): complete array of points coordinates
    //       O:  - (string) a svg path command
    // O:  - (string): a Svg <path> element

    const d = points.reduce((acc, point, i, a) => i === 0
  ? `M ${point[0]},${point[1]}`
  : `${acc} ${bezierCommand(point, i, a)}`
, '')
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    l = document.getElementById(lineID);
    l.parentElement.removeChild(l);
    p.setAttribute("style", l.getAttribute("style"));
    p.setAttribute("d",d);
    p.id = lineID;
    document.getElementById("sketchpad").append(p);


  }

  // Clear the canvas context using the canvas width and height
  function clearCanvas(canvas,ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Keep track of the mouse button being pressed and draw a dot at current location
  function sketchpad_mouseDown() {
      mouseDown=1;
      drawLine(ctx,mouseX,mouseY,penSize);
  }

  // Keep track of the mouse button being released
  function sketchpad_mouseUp(e) {
      if (mouseDown==0){ return; }
      mouseDown=0;

      if (firstSegment){
        getMousePos(e);
        if (mouseX == lastX && mouseY == lastY){
          drawLine(ctx,mouseX,mouseY,penSize);
        }
      }

      // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
      lastX=-1;
      lastY=-1;
      if (useSVG && !firstSegment){
        var lineID = "l"+lineCount+"-"+username;
        if (roundTable){
          var l = document.getElementById(lineID);
          if (l===null || l.getAttribute("points")===null) return;
          socket.emit('send_room',
            {"action":"line",
             "points":l.getAttribute("points"),
             "style":l.getAttribute("style"),
             "id":lineCount,
             "username": username,
             "room": room},
           function (timestamp){
             roundTableData[currentSurface].timestamp = timestamp;
           });
        }
        smoothLine(lineID);
      }
  }

  // Keep track of the mouse position and draw a dot if mouse button is currently pressed
  function sketchpad_mouseMove(e) {
      // Update the mouse co-ordinates when moved
      getMousePos(e);

      // Draw a dot if the mouse button is currently being pressed
      if (mouseDown==1) {
          drawLine(ctx,mouseX,mouseY,penSize);
      }
  }

  // Get the current mouse position relative to the top-left of the canvas
  function getMousePos(e) {
      if (!e)
          e = event;

      if (e.offsetX) {
          mouseX = e.offsetX;
          mouseY = e.offsetY;
      }
      else if (e.layerX) {
          mouseX = e.layerX;
          mouseY = e.layerY;
      }
   }

  // Draw something when a touch start is detected
  function sketchpad_touchStart(e) {
      // Update the touch co-ordinates
      getTouchPos(e);

      drawLine(ctx,touchX/roundTableScale,touchY/roundTableScale,penSize);

      // Prevents an additional mousedown event being triggered
      event.preventDefault();
  }

  function sketchpad_touchEnd(e) {
      if (firstSegment){
        getTouchPos(e);
        if (touchX == lastX && touchY == lastY){
          drawLine(ctx,touchX/roundTableScale,touchY/roundTableScale,penSize);
        }
      }

      // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
      lastX=-1;
      lastY=-1;

      if (useSVG && !firstSegment){
        var l = document.getElementById("l"+lineCount+"-"+username);
        if (l===null || l.getAttribute("points")===null) return;
        if (roundTable){
          socket.emit('send_room',
            {"action":"line",
             "points":l.getAttribute("points"),
             "style":l.getAttribute("style"),
             "id":lineCount,
             "username": username,
             "room": room},
             function (timestamp){
               roundTableData[currentSurface].timestamp = timestamp;
             });
        }
        smoothLine("l"+lineCount+"-"+username);
      }
  }

  // Draw something and prevent the default scrolling when touch movement is detected
var te=null;

  function sketchpad_touchMove(e) {
      // Update the touch co-ordinates
      getTouchPos(e);
      te = e;

      // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
      drawLine(ctx,touchX/roundTableScale,touchY/roundTableScale,penSize);

      // Prevent a scrolling action as a result of this touchmove triggering.
      event.preventDefault();
  }

  // Get the touch position relative to the top-left of the canvas
  // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
  // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
  // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
  function getTouchPos(e) {
      if (!e)
          e = event;

      if(e.touches) {
          if (e.touches.length == 1) { // Only deal with one finger
              var touch = e.touches[0]; // Get the information for finger #1
              // note: next two lines with parent element work only
              // if child element is completely filling parent element
              // in this case the code works both for SVG and canvas
              // where without parentElement it works only for canvas
              touchX=touch.pageX-window.innerWidth*0.1+ touch.target.parentElement.scrollLeft*roundTableScale;
              touchY=touch.pageY-touch.target.parentElement.offsetTop + touch.target.parentElement.scrollTop*roundTableScale;
          }
      }
  }

  function getTouchPos_Absolute(e) {
      if (!e)
          e = event;

      if(e.touches) {
          if (e.touches.length == 1) { // Only deal with one finger
              var touch = e.touches[0]; // Get the information for finger #1
              touchX=touch.pageX;
              touchY=touch.pageY;
          }
      }
  }
// ===================== sketchpad end =======================

var maxLine = 1000;

function resizeSlide(){
  maxLine = Math.min(200, 0.2*Math.max(window.innerWidth*window.innerHeight));
  var d = document.getElementById("slidespace");
  d.style.height = window.innerHeight + "px";
  d.style.width = 0.8*window.innerWidth + "px";
  d.style.marginLeft = window.innerWidth*0.1 + "px";
  d.style.fontSize = "1em";
  document.body.style.fontSize = Math.round(window.innerWidth/1920*40) + "px";
  if (sketchpadOpen){
    var s = document.getElementById("sketchpad");
     s.setAttribute("width",(window.innerWidth*0.8)+"px");
     s.setAttribute("height", window.innerHeight + "px");
  }
  if (fullScreen){
    document.getElementById("controlspace").children[1].classList.add('fullscreenopened');
  }
  else{
    document.getElementById("controlspace").children[1].classList.remove('fullscreenopened');
  }
  var e = document.getElementById("zoomedim");
  if (e !== null){
    e.style.width = 0.8*window.innerWidth+"px";
    e.style.height = window.innerHeight +"px";
  }

  var dh = document.getElementById("drawinghelp");
  if (dh){
    dh.parentElement.removeChild(dh);
    addDrawingHelp();
  }

  checkOverflow();
  var c = document.getElementById("presentervideo");
  if (c){
    var w = Math.round(window.innerWidth*0.1);
    var h = Math.round(w/640*480);
    c.setAttribute("width",w + "px");
    c.setAttribute("height",h + "px");
  }

  d = document.getElementsByClassName("demoCameraStream");
  for (var i=0; i< d.length; i += 1){
    var vid = document.getElementById("demovideo"+i);
    if (vid){
      var w = vid.parentElement.clientWidth;
      var h = vid.parentElement.clientHeight;
      vid.setAttribute("width",w + "px");
      vid.setAttribute("height", h+"px");
    }
  }

}

function resizeRoundtable(){
  maxLine = Math.min(200, 0.2*Math.max(window.innerWidth*window.innerHeight));
  var d = document.getElementById("slidespace");
  d.style.height = tableHeight + "px";
  d.style.width = tableWidth + "px";
  d.style.marginLeft = window.innerWidth*0.1 + "px";
  document.body.style.fontSize = Math.round(window.innerWidth/1920*40) + "px";

  roundTableScale = 1/Math.max(tableWidth/(window.innerWidth*0.8), tableHeight/window.innerHeight);
  d.style.fontSize = (tableWidth/0.8)/1920*40 + "px";
  d.style.transform = "scale("+roundTableScale+"," + roundTableScale +")";
  d.style.transformOrigin = "top left";

  if (sketchpadOpen){
    var s = document.getElementById("sketchpad");
    if (annotationAnchor == null){
     s.setAttribute("width",tableWidth+"px");
     s.setAttribute("height", tableHeight + "px");
    }
    else{
      s.setAttribute("width",annotationAnchor.scrollWidth+"px");
      s.setAttribute("height", annotationAnchor.scrollHeight + "px");
    }
  }
  if (fullScreen){
    document.getElementById("controlspace").children[1].classList.add('fullscreenopened');
  }
  else{
    document.getElementById("controlspace").children[1].classList.remove('fullscreenopened');
  }
  var e = document.getElementById("zoomedim");
  if (e !== null){
    e.style.width = 0.8*window.innerWidth+"px";
    e.style.height = window.innerHeight +"px";
  }

  var dh = document.getElementById("drawinghelp");
  if (dh){
    dh.parentElement.removeChild(dh);
    addDrawingHelp(tableWidth/0.8, tableHeight);
  }


}

var previousIndex = -1;

function closeExistingSlide(){
  if (previousIndex == -1 || roundTable || singleUserTable){
    previousIndex = slideIndex; return;
  }
  if ((previousIndex != data["slides"].length)
      && sketchpadOpen){
    // save old canvas
    var canvas = document.getElementById("sketchpad");
    if (useSVG){
      data["slides"][previousIndex]["canvas"] = canvas.innerHTML;
    }
    else{
      data["slides"][previousIndex]["canvas"] =canvas.toDataURL();
    }
  }
  if (previousIndex != data["slides"].length && previousIndex != null){
    var textAnnotation = [];
    var d = document.getElementsByClassName("textannotation");
    for (var i=0; i<d.length; i +=1){
      if (d[i].id != null){
        textAnnotation.push({
          id:d[i].id,
          left:d[i].style.left,
          top:d[i].style.top,
          color:d[i].style.color,
          maxWidth:d[i].style.maxWidth,
          fontSize:d[i].style.fontSize,
          html:d[i].innerHTML,
          text:d[i].dataset["s"]
        });
       }
    }
    data["slides"][previousIndex]["textAnnotation"] = textAnnotation;
  }
  previousIndex = slideIndex;
}

function showSlide(doNotPushHistory=false){
  if (slideIndex==-1){ showPresentationLink(); return; }
  if (doNotPushHistory == null || doNotPushHistory == false){
    history.pushState("", "", location.protocol+'//'+location.host+location.pathname + "#slide"+slideIndex);
  }
  // if we are not showing quiz results, save slide annotation
  if (answersHTML.length == 0){
    closeExistingSlide();
  }

  if (slideIndex >= data["slides"].length){
    showEmptySlide();
    return;
  }


  var l;
  if (data["slides"][slideIndex]["style"]!=""){
    l = "style='" + data["slides"][slideIndex]["style"].replace("'",'"') + "'";
  }
  else if (logoURL ===null){
    l="";
  }
  else{
    l = "style='background-image: url(" + logoURL +
      ");background-size: 13%;background-repeat: no-repeat;background-position: bottom right;background-origin: border-box;'";
  }
  var d = document.getElementById("slidespace");
  d.innerHTML =
  "<div class='slide'" + l +">"
   + data["slides"][slideIndex]["html"]
   + "</div>";

   if (data["slides"][slideIndex]["textAnnotation"]!=null){
     var textAnnotation = data["slides"][slideIndex]["textAnnotation"];
     for (var i =0; i<textAnnotation.length; i +=1){
       var t = document.createElement("div");
       t.classList.add("textannotation");
       t.id = textAnnotation[i].id;
       t.style.left = textAnnotation[i].left;
       t.style.top = textAnnotation[i].top;
       t.style.color = textAnnotation[i].color;
       t.style.maxWidth = textAnnotation[i].maxWidth;
       t.style.fontSize = textAnnotation[i].fontSize;
       t.innerHTML = textAnnotation[i].html;
       t.style.height = "auto";
       t.style.width = "auto";
       t.addEventListener("dblclick", textEditor, false);
       t.dataset["s"] = textAnnotation[i].text;
       d.appendChild(t);
     }
   }

  if (sketchpadActive){
    // maintain pen tool, initialize new sketchpad
    sketchpadOpen=false;
    sketchpadActive=false;
    openSketchPad();
    // if old drawing exists show
    showSavedCanvas()
  }
  else{
    sketchpadOpen=false;
    // if old driving exists, open canvas, show it, and close canvas editing
    showSavedCanvas()
  }
  var im = d.getElementsByClassName("simage");

  for (var i=0; i<im.length; i = i+1){
    im[i].addEventListener("dblclick", function(src){
      var e = document.createElement("div");
      e.id="zoomedim";
      e.style.width = 0.8*window.innerWidth+"px";
      e.style.height = window.innerHeight +"px";
      e.innerHTML = "<img src='"+src.target.src+"' class='simage' alt='zoomed figure'>";
      e.addEventListener("dblclick", closeZoomedImage, false);
      document.getElementById("slidespace").append(e);
    });
    im[i].addEventListener("mousedown", nodrag);
    im[i].setAttribute("draggable","false");
  }

  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  // get quiza
  answersHTML = [];
  var q = document.getElementsByClassName("quiza");
  for (var i =0; i<q.length; i += 1){
    q[i].addEventListener("click", quizAnswerClick);
  }
  if (presenter && q.length > 0){
    activeQuizId = q[0].dataset["qid"];
    // if already there are some answers show button
    if ( (quizAnswers.length > activeQuizId)
      && (Object.keys(quizAnswers[activeQuizId]).length>0) ){
      addQuizResultsButton(activeQuizId);
    }
  }
  else{
    activeQuizId = null;
  }

  addDemoCameraStream();
  scaledDemoStreamOriginalHeight = [];
  scaledElementOriginalHeight = [];
  resize();
  checkOverflow();

  try{
    MathJax.typesetClear();
    MathJax.typesetPromise();
  }
  catch (error){
    console.log("warning: ",error);
  }
}

function quizAnswerClick(e){
  var elem = e.target;
  if (!elem.classList.contains("quiza")){
    elem = elem.parentElement;
  }
  if (elem.classList.contains("selected")){
    elem.classList.remove("selected");
  }
  else{
    elem.classList.add("selected");
  }
  if (!presenter){
    var selected =  [];
    var a = document.getElementsByClassName("quiza");
    var quizId = a[0].dataset["qid"];
    for (var i=0; i<a.length; i += 1){
      if (a[i].classList.contains("selected")){
        selected.push(a[i].dataset["aid"]);
      }
    }
    notify("You have selected "+ selected.length + " answer"
      +((selected.length==1)?"":"s")+".");
    socket.emit("quizanswers",
    {
      "to":room.substr(0,room.length - 1),
      "u":username,
      "qid":quizId,
      "a":selected
    });
  }
}

var scaledElementOriginalHeight = null;
var scaledDemoStreamOriginalHeight = [];
var demoStreams =[];

function addDemoCameraStream(){
  for (var i=0; i < demoStreams.length; i += 1){
    if (demoStreams[i] != null){
      demoStreams[i].getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
      });
    }
  }
  demoStreams = [];
  var d = document.getElementsByClassName('demoCameraStream');
  for (var i=0; i < d.length; i += 1 ){
    d[i].id = ("demostream"+i);
    if (d[i].dataset.src){
      var video = document.createElement("video");
      video.id=("demovideo"+i);
      video.setAttribute("controls","");
      video.innerHTML = '<source src="' + d[i].dataset.src + '" type="video/mp4">';
      d[i].append(video);
      var w = d[i].clientWidth;
      var h = d[i].clientHeight;
      video.setAttribute("width","100%");
      video.setAttribute("height", h+"px");
    }
    else{
      showCameraOptions(d[i], addHereDemoStream);
    }
    demoStreams.push(null);
  }
}

var whereToAddCamera = null;

function addHereDemoStream(e){
  if (e.target){ e = e.target; }
  var d = e.parentElement.parentElement;
  var streamId = parseInt(d.id.replace("demostream",""),10);

  var deviceId = e.dataset.deviceid;
  var facing = e.dataset.facing;
    var request = {video:true};
    if (deviceId != ""){
      request = { video:{deviceId:{exact: deviceId}}, audio:false };
    }
    else if(facing != ""){
      request = { video:{facingMode:facing}, audio:false };
    }
    d.innerHTML="Adding camera...";

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia(request).then(function(stream) {
          //video.src = window.URL.createObjectURL(stream);
          demoStreams[streamId]= stream;
          var video = document.createElement("video");
          video.id=("demovideo"+streamId);
          var w = d.clientWidth;
          var h = d.clientHeight;
          video.setAttribute("width",w + "px");
          video.setAttribute("height", h+"px");
          video.style.maxHeight="100%";

          d.innerHTML="";
          d.append(video);
          video.srcObject = stream;
          video.play();
          checkOverflow();

          var control = document.createElement("div");
          control.classList.add("streamcontrol");
          var c = document.createElement("div");
          c.innerHTML = "Change source"
          c.addEventListener("click", function(){
            if (demoStreams[streamId] != null){
                demoStreams[streamId].getTracks().forEach(function(track) {
                if (track.readyState == 'live') {
                    track.stop();
                }
              });
            }
            showCameraOptions(d, addHereDemoStream);
          }
          )
          control.append(c);
          c = document.createElement("div");
          c.innerHTML = "Stop"
          c.addEventListener("click", function(){
            if (demoStreams[streamId] != null){
              video = document.getElementById("demovideo"+streamId);
              var canvas = document.createElement("canvas");
              canvas.setAttribute('width', video.videoWidth+"px");
              canvas.setAttribute('height', video.videoHeight+"px");
              canvas.style.display="none";
              video.parentElement.append(canvas);
              var context = canvas.getContext('2d');
              context.drawImage(video, 0, 0,
                video.videoWidth, video.videoHeight);
              var imageData = canvas.toDataURL('image/png');
              var photo = document.createElement("img");
              photo.classList.add("simage");
              photo.setAttribute("style",video.getAttribute("style"));
              photo.addEventListener("mousedown", nodrag);
              photo.setAttribute("draggable","false");
              photo.setAttribute('src', imageData);
              photo.addEventListener("dblclick", function(src){
                var e = document.createElement("div");
                e.id="zoomedim";
                e.style.width = 0.8*window.innerWidth+"px";
                e.style.height = window.innerHeight +"px";
                e.innerHTML = "<img src='"+src.target.src+"' class='simage' alt='zoomed figure'>";
                e.addEventListener("dblclick", closeZoomedImage, false);
                document.getElementById("slidespace").append(e);
              });
              photo.addEventListener("mousedown", nodrag);
              photo.setAttribute("draggable","false");

              // save into presentation data to allow showing saved image
              // if we return to this slide
              // var closingStreamId = video.parentElement.getAttribute("id");
              // if (!("videoimage" in data["slides"][slideIndex])){
              //   data["slides"][slideIndex]["videoimage"] = {};
              // }
              // data["slides"][slideIndex]["videoimage"][closingStreamId] = imageData;

              video.parentElement.append(photo);
              video.style.display = "none";

              demoStreams[streamId].getTracks().forEach(function(track) {
                if (track.readyState == 'live') {
                    track.stop();
                }
              });
            }
            demoStreams[streamId] = null;
          });
          control.append(c);

          d.append(control);
      });
  }
}

function nodrag(e){
  e.preventDefault();
}

function findSlideOffset(d){

  var offset = 0;
  for (var i=0; i<d.length; i += 1){
    offset = Math.max(offset,
      d[i].offsetTop + d[i].clientHeight);
  }
  // find if correctoin is needed
  offset = offset - window.innerHeight;
  return offset;
}

function checkOverflow(){
  // find bottom most element
  var d = document.getElementsByClassName("slide");
  if (d.length>0){
    d = d[0].getElementsByTagName("div");
  }
  else{
    return;
  }

  var sframe = document.getElementsByClassName("sframe");

  if (sframe.length>0){
    if (scaledElementOriginalHeight.length == 0){
      for (var i=0; i<sframe.length; i += 1){
        scaledElementOriginalHeight.push(sframe[i].clientHeight);
      }
    }
    else{
      for (var i=0; i<sframe.length; i += 1){
        sframe[i].style.maxHeight = scaledElementOriginalHeight[i] +"px" ;
      }
    }
  }
  var offset = findSlideOffset(d);
  var index = 0;
  // try changing iframe height if possible
  while ((offset > 0) && (index < sframe.length)){
    if (sframe[index].clientHeight > offset){
        sframe[index].style.maxHeight = (sframe[index].clientHeight-offset) + "px" ;
    }
    index += 1;
    offset = findSlideOffset(d);
  }

  // try changing demoCameraStream height if possible
  var ds = document.getElementsByClassName("demoCameraStream");
  if (scaledDemoStreamOriginalHeight == 0){
    for (var i=0; i<ds.length; i +=1){
      scaledDemoStreamOriginalHeight.push(-1);
    }
  }
  index = 0;
  while (index<ds.length){
   var vid = document.getElementById("demovideo"+index);
   if (vid){
     if (scaledDemoStreamOriginalHeight[index] ==-1){
       scaledDemoStreamOriginalHeight[index] = vid.height;
     }
     else{
       vid.style.maxHeight =  scaledDemoStreamOriginalHeight[index] +"px" ;
     }
   }
    index += 1;
  }

  ds = document.getElementsByClassName("demoCameraStream");
  index = 0;
  offset = findSlideOffset(d);
  while (offset > 0 && index<ds.length){
    vid = document.getElementById("demovideo"+index);
    if (vid){
      if (vid.height > offset){
        vid.style.maxHeight = (vid.clientHeight-offset) + "px" ;
      }
    }
      index += 1;
      offset = findSlideOffset(d);

  }

}

function showSavedCanvas(){
  if (data["slides"][slideIndex]["canvas"] !=""){
    if (!sketchpadOpen) { newSketchpad(); openPointer(); }
    var canvas = document.getElementById("sketchpad");
    if (useSVG){
      canvas.innerHTML = data["slides"][slideIndex]["canvas"];

    }
    else{
      var image = new Image();
      image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0); // draw the new image to the screen
      }
      image.src = data["slides"][slideIndex]["canvas"];
    }
  }
  getLineCount();
}

function getLineCount(){
  // following is both for SVG elements and textual annotations
  lineCount = 0;
  while (document.getElementById("l"+(lineCount+1)+"-"+username)) {
    lineCount += 1;
  }
}

function closeZoomedImage(){
  var e = document.getElementById("zoomedim");
  e.parentElement.removeChild(e);
}

function showEmptySlide(){
  // maintain pen tool, initialize new sketchpad
  openPointer();
  sketchpadOpen=false;
  sketchpadActive=false;
  document.getElementById("slidespace").innerHTML =
    "<div class='cnotification'>End of presentation...<br>"
    +"<span id='presentation2pdf'>Save presentation with annotations as PDF</span><br/>"
    +"This presentation is made with"
    +"<img src='./caroline/images/caroline2.png' class='logo'>"
    + "<a class='carolinelink' target='_blank' href='https://github.com/nikolasibalic/Caroline'>https://github.com/nikolasibalic/Caroline</a><br><br>"
    + "open-source Python framework for interactive web/HTML-based science presentations."
    +"</div>"
    ;
  document.getElementById("presentation2pdf").addEventListener("click",
    presentation2pdf);
}

var presentationPDF = null;
var presentationPDFx = 297;
var presentationPDFy = 210;

function presentation2pdf(){
  openPointer();

  var aspect = window.innerWidth*0.8 / window.innerHeight;
  presentationPDFx = 297;
  presentationPDFy = 297/aspect;
  presentationPDF = new jsPDF("landscape", "mm",
    [presentationPDFx, presentationPDFy]);
  slideIndex = 0;
  showSlide();
  slide2pdf();
}

function slide2pdf(){
  notify("Please wait. Saving slides " + Math.round((slideIndex+1)/data["slides"].length*100)+" %");
  var screenshotTarget = document.getElementById("slidespace");
  var scale = 1980 / window.innerWidth;
  html2canvas(screenshotTarget, { "scale": scale, "logging": false, "useCORS": false,
       "allowTaint": false,  "letterRendering": true,
       "onclone" : function (doc){
         var a = doc.getElementsByClassName("sframe");
         while (a.length > 0){
           var p = document.createElement("p");
           p.style.cssText = "font-variant: normal !important; -webkit-font-variant: normal !important; font-variant-ligatures: none !important; -webkit-font-variant-ligatures: none !important; ";
           var s = new String(window.location);
           s = s.substring(0,s.lastIndexOf("/"));
           var b =  new String(a[0].getAttribute("src"));
           if (b.indexOf(".")==0){
             b = b.substring(1);
           }
           if (b.indexOf("http") ==-1){
              s = s + b;
           }
           else{
             s = b;
           }
           s = s.replace(/&/g,"&amp;&#8203;");
           s = s.replace(/\//g,"&#47;&#8203;");
           s = s.replace(/\?/g,"?&#8203;");
           p.innerHTML = "See interactive element at: " + s;
           a[0].parentElement.insertBefore(p,a[0]);
           a[0].parentElement.removeChild(a[0]);
           a = doc.getElementsByClassName("sframe");
         }
         var b = doc.getElementsByTagName("mjx-assistive-mml");
         while (b.length>0){
            b[0].parentElement.removeChild(b[0]);
            b = doc.getElementsByTagName("mjx-assistive-mml");
            console.log("REMOVING");
         }

       }
     }).then((canvas) =>{
     const base64image = canvas.toDataURL("image/jpeg", 0.8);
     presentationPDF["addImage"](base64image, 'JPEG',
        0, 0, presentationPDFx, presentationPDFy);
     if (slideIndex==0){
       var slidesURL = String(window.location);
       slidesURL = slidesURL.substring(0, slidesURL.lastIndexOf("#"));
       presentationPDF["textWithLink"]('Click here to see interactive slides.', 5, 5,
         {url: slidesURL});
     }
     if (slideIndex < data["slides"].length-1){
       presentationPDF["addPage"]();
       slideIndex += 1;
       showSlide();
       slide2pdf();
     }
     else{
       presentationPDF["save"](timestampFilenamePresentation()+".pdf");
       slideIndex += 1;
       showEmptySlide();
     }
  });
}

function nextSlide(){
  if (slideIndex < data["slides"].length){
    if (presenter){
      slideIndex += 1;
      if (room != null){
        socket.emit("send_room",
          {"action":"maxslide",
          "i":slideIndex,
          "room":room});
      }
    }
    else if(slideIndex < maxSlideIndex){
      slideIndex += 1;
      if (slideIndex == maxSlideIndex){
        notify("You are following the lecturer.");
      }
    }
    else{
      notify("You cannot go beyond lecturer in presentation. Let's keep drama alive.");
      return;
    }
  }
  showSlide();
}

function previousSlide(){
  if ((slideIndex == 0) && presenter && (presentationServer !="")) {
    openPointer();
    closeExistingSlide();
    previousIndex = -1;
    sketchpadOpen = false;
    slideIndex = -1;
    showPresentationLink();
  }
  else if (slideIndex > 0 ){
    slideIndex -= 1;
    showSlide();
  }
}

function openFullScreen() {
  var docElm = document.documentElement;
  fullScreen = true;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else {
    fullScreen = false;
  }
}

function closeFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  fullScreen = false;
}

function show_cursor(c) {
  if (c==undefined){c=cursor;}
	if(c.classList.contains('cursor_hidden')) {
        c.classList.remove('cursor_hidden');
    }
    c.classList.add('cursor_visible');
}

function p_hide_cursor(c=undefined){
  if (c==undefined){c=cursor;}
  if(c.classList.contains('cursor_visible')) {
        c.classList.remove('cursor_visible');
    }
    c.classList.add('cursor_hidden');
}

function hide_cursor(e) {
  p_hide_cursor();
  if (roundTable){
      socket.emit('send_room',
        {"action":"cursorhide",
         "username": username,
         "room": room})
  }
}

function cursor_mousemove_touch(e) {
    getTouchPos_Absolute(e);
    moveMouse(touchX, touchY);
    e.preventDefault();
    if (roundTable){
      socket.emit('m',
        {"x":(touchX-window.innerWidth*0.1)/roundTableScale,
         "y":touchY/roundTableScale,
         "u": username,
         "r": room})
    }
}

function moveMouse(x, y, c=undefined){
    if (c==undefined){ c=cursor;}
    show_cursor(c);
    var cursor_width = c.offsetWidth * 0.5; //The actual cursor is in the centre of the custom cursor
    var cursor_height = c.offsetHeight * 0.5;

    var cursor_x = x - cursor_width; //x-coordinate
    var cursor_y = y - cursor_height; //y-coordinate
    var cursor_pos = `translate(${cursor_x}px, ${cursor_y}px)`;
    c.style.transform = cursor_pos;
}

function cursor_mousemove(e) {
    if (roundTable){
      socket.emit('m',
        {"x":(e.clientX-window.innerWidth*0.1)/roundTableScale,
         "y":e.clientY/roundTableScale,
         "u": username,
         "r": room})
    }
    moveMouse(e.clientX, e.clientY);
}

function escapeHtml (string) {
  return string
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
}
function unescapeHtml (string) {
  return string
          .replace(/&amp;/g, "&" )
          .replace(/&lt;/, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
}
