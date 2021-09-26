/*!
 * Roundtable
 * (c) 2021 Nikola Sibalic
 */
function initRoundTable(){
 var h = window.location.hash.substr(1)
 if ((h=="") || (h.indexOf("slide")==0)){
   document.getElementById("gettable").value = 'Get my roundtable';
 }
 else{
   document.getElementById("gettable").value = 'Join roundtable';
 }
// document.getElementsByTagName("h1")[0].onclick = function(){
//   window.location = roundTableServer;
// }

 var e = document.getElementById("uname");
 e.focus();
 document.getElementById("gettable").addEventListener("click",function(){
   if (document.getElementById("uname").value.match(/^\s+$/) == null
     && document.getElementById("uname").value.length>0){
     username = document.getElementById("uname").value;
                             username = username.replace("=","");
     document.getElementById("intro1").style.display="none";
     document.getElementById("intro2").style.display="block";
     document.getElementById("about").style.display="none";
   }
   else{
     document.getElementById("uname").focus();
   }
 });
 document.getElementById("uname").addEventListener("keyup", function(e){
   var x = e.which || e.keyCode;
   if (x==13){
     if (document.getElementById("uname").value.match(/^\s+$/) == null
       && document.getElementById("uname").value.length>0 ){
       username = document.getElementById("uname").value;
                                     username = username.replace("=","");
       document.getElementById("intro1").style.display="none";
       document.getElementById("intro2").style.display="block";
     }
     else{
       document.getElementById("uname").focus();
     }
   }
 })

window.addEventListener('hashchange', function() {
 if (room != window.location.hash.substr(1)){
   window.location.reload();
 }
}, false);

document.getElementById("bproceed").disabled = true;

 document.getElementById("bproceed").addEventListener("click",function(){
   document.getElementById("intro2").style.display="none";
   document.getElementById("intro3").style.display="block";

   roundTableExit = function(){
     confirmChoice("Do you want to exit this roundtable?",
      "Cancel",
      function (){return; },
      "Yes, leave this roundtable",
      function (){window.location = roundTableServer; }
     );
   };

   roundTable=true;
   roundTableAuth = grecaptcha.getResponse();
   roundTableCallBack = afterConnection;
   initApp();

   // overwrite default clear all to add confirmation
   var d = document.getElementById("controlspace").children[19];
   d.onclick = function(e){
     confirmChoice("Do you want to delete everything from the table (including annotations of other people)?",
      "Cancel",
      function (){return; },
      "Yes, clear roundtable",
      function (){
        socket.emit('send_room',
         {action:"clearAll",
          username: username,
          room: room})
        cleanRoundtable();
      }
     );
     e.preventDefault();
   }
   // add proper notification if moderator cannot be reached
   roundtableModeratorTimout = function(){
     confirmChoice("It seems you joined a roundtable where moderator already left, or lost connection.<br> Would you like to navigate to homepage and set up your own roundable?",
      "No, continue waiting",
      function (){return; },
      "Yes, set up my own roundtable",
      function (){
        window.location = roundTableServer;
      }
     );
   };
 });

 var s = document.getElementsByClassName('rselect');
 for (var i=0; i<s.length; i += 1){
   s[i].addEventListener("click",function(e){
     if (e.target.innerHTML == "left hand use"){
       leftHanded = true;
     }
     else{
       leftHanded = false;
     }
     var s = document.getElementsByClassName('rselect');
     for (var i=0; i<s.length; i += 1){
       s[i].classList.remove('rselected');
     }
     e.target.classList.add('rselected');
   })
 }
}

function enabaleProceed(){
document.getElementById("bproceed").disabled = false;
}

function disableProceed(){
document.getElementById("bproceed").disabled = true;
}

function confirmChoice(prompt, bNo, fNo, bYes, fYes){
document.getElementById("confirmmessage").innerHTML = prompt;
document.getElementById("bno").value = bNo;
document.getElementById("bno").onclick = function (){
 document.getElementById("confirmd").style.display="none";
 fNo();
};
document.getElementById("byes").value = bYes;
document.getElementById("byes").onclick = function (){
 document.getElementById("confirmd").style.display="none";
 fYes();
}
document.getElementById("confirmd").style.height = window.innerHeight + "px";
document.getElementById("confirmd").style.width =  window.innerWidth + "px";
document.getElementById("confirmd").style.display="flex";
}


function afterConnection(existingRoom){
if (existingRoom){
 document.getElementById("intro").style.display = "none";
 document.getElementById("intro3").style.display="none";
}
else{
 var im = document.createElement("img");
 im.src = roundTableServer + "/api/qrcode/"+room;
 document.getElementById("qr").innerHTML = "";
 document.getElementById("qr").appendChild(im);
 var inp = document.createElement("input");
 inp.setAttribute("type","text");
 inp.classList.add("text");
 inp.value =  roundTableServer + "#"+room;
 inp.id="elink";
 document.getElementById("rlink").appendChild(inp);
 document.getElementById("intro3").style.display="none";
 document.getElementById("intro4").style.display="block";

  copyLinkToClipboard();
  document.getElementById("bstart").addEventListener("click",function(){
    document.getElementById("intro").style.display = "none";
    document.getElementById("intro4").style.display="none";
  });
}

}

function copyLinkToClipboard() {
var copyText = document.getElementById("elink");

 copyText.select();
 copyText.setSelectionRange(0, 99999); /*For mobile devices*/

 document.execCommand("copy");
}
