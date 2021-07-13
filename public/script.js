console.log("Connecting to signaling server");
const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
let status = document.getElementById("info");
//New Work
const shareUrlImg = "public\Images\illustration-section-01.svg";
const leaveRoomIng = "public\Images\illustration-section-01.svg";
const confirmImg = "public\Images\illustration-section-01.svg";
const peerLoockupUrl ="https://extreme-ip-lookup.com/json/";
const avtarApiUrl = "https://eu.ui-avatars.com/api";
const showChat = document.querySelector("#showChat");
myVideo.muted = true;

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

const user = prompt("Enter your name");

let swalBackground = "rgba(0,0,0,0.7)";
let myPeerName;
let myName;
let roomUrl = "/";
let myVideoAvtarImag;
let myVideoParagraph;
let localMediaStream;



let whoAreYou = ()=>{
  Swal.fire({
    allowOutsideClick: false,
    background: swalBackground,
    position: "center",
    title: "Enter your name",
    input: "text",
    confirmButtonText: `Join meeting`,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
     inputValidator:(value)=>{
       if(!value){
         return "Please enter your name";
       }
       myName = value;
       myPeerName = value;
       //let userInfo = document.createElement("h4");
      // userInfo.innerHTML = myName+" (me) ";
       //status.append(userInfo);
       //VideoParagraph.innerHTML = myPeerName+" (me) ";
       //setPeerAvatarImgName("myVideoAvatarImage", myPeerName);
     },
  }).then(()=>{
    welcomeUser();
  })
}

let welcomeUser = ()=>{
  const myRoomUrl = window.location.href;
  Swal.fire({
    position: "center",
    title: "<strong>Welcome " + user + "</strong>",
    html:
      `
      <br/> 
      <p style="color:white;">Share this meeting invite others to join.</p>
      <p style="color:rgb(8, 189, 89);">` +
      myRoomUrl +
      `</p>`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: `Copy meeting URL`,
    cancelButtonText: `Close`,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      copyRoomURL();
    } 
  });
}
let copyRoomURL = () =>{
  // save Room Url to clipboard
  let roomURL = window.location.href;
  let tempInput = document.createElement("input");
  document.body.appendChild(tmpInput);
  tempInput.value = roomURL;
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  console.log("Copied to clipboard Join Link ", roomURL);
  document.body.removeChild(tempInput);
  userLog("toast", "Meeting URL is copied to clipboard");
}
let userLog = (type, message)=> {
  switch (type) {
    case "toast":
      const Toast = Swal.mixin({
        background: swalBackground,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "info",
        title: message,
      });
      break;
    default:
      alert(message);
  }
}

//New Work end
myVideo.muted = true;
let peer = new Peer(undefined, {
  host: "peerpacific-headland-94977.herokuapp.com",
});
let peers = {};
let myVideoStream; 
let peerStream = new Map();     // Mapping socket.id with peer's stream
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });

    socket.on("user-disconnected",(userId)=>{
      if(peers[userId]) peers[userId].close();
    });

  });

peer.on("call", function (call) {
 
  getUserMedia(
    { video: true, 
      audio: true },
     (stream) => {
      peerStream.set(socket.id,stream);
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      //const info = document.createElement("h4");
      call.on("stream", (remoteStream) => {
        addVideoStream(video, remoteStream);
      });
      
    }, 
  );
});

peer.on("open", (id) => {
  welcomeUser();
  socket.emit("join-room", ROOM_ID, id, user);
  roomUrl = window.location.href;
});

const connectToNewUser = (userId, streams, userName) => {
  var call = peer.call(userId, streams);
  //console.log(call);
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    //console.log(userVideoStream);
    addVideoStream(video, userVideoStream);
  });
  call.on('close',()=>{
    video.remove();
  })
  peers[userId] = call;
};

const addVideoStream = (videoEl, stream) => {
    console.log("Hello ",videoEl,stream);
    let peer_id = socket.id;
    let Video = videoEl;
    Video.setAttribute("playsinline", true);
    Video.autoplay = true;
    Video.controls = false;
    videoGrid.append(Video);
    Video.srcObject = stream;
    //getHtmlElementsById();
    //VideoParagraph = document.getElementById("myVideoParagraph");
    //VideoParagraph.innerHTML = user;
    totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
            100 / totalUsers + "%";
        }
    }
};
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});

const playStop = () => {
  console.log(peerStream.get(socket.id));
  let enabled;
  if(peerStream.has(socket.id)){
   
    enabled = peerStream.get(socket.id).getVideoTracks()[0].enabled;
    if(enabled){
      peerStream.get(socket.id).getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else{
      setStopVideo();
      peerStream.get(socket.id).getVideoTracks()[0].enabled = true;
    }

  }
  enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
  

  
};

const muteUnmute = () => {
  let enabled;
  if(peerStream.has(socket.id)){
    enabled = peerStream.get(socket.id).getAudioTracks()[0].enabled;
    if(enabled){
      peerStream.get(socket.id).getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else{
      setMuteButton();
      peerStream.get(socket.id).getAudioTracks()[0].enabled = true;
    }

  }
  enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

const leaveMeeting = () =>{
  window.location.assign("/rejoin");
}


const share = ()=>{
  copyRoomURL();
}
