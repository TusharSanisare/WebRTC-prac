let localStream;
let remoteStream;
let peerConnection;

const server = {
  iceServers:[
    {
      urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
  ]
};

let init = async()=>{
  localStream = await navigator.mediaDevices.getUserMedia({video:true, Audio:false});
  document.getElementById('user-1').srcObject = localStream;

  createOffer();
}


let createOffer = async ()=>{
  peerConnection = new RTCPeerConnection(server);

  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event)=>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack();
    })
  };

  peerConnection.onicecandidate = async(event)=>{
    if(event.candidate){
      console.log('New ICE candidate : ',event.candidate);
    }
  }


  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log('Offer : ',offer);
}
init();