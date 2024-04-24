// const servers = {
//     iceServers: [
//         {
//             urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.google.com:19302']
//         }
//     ]
// };

// //this function is used to make an offer for RTC connection, we will pass this function when the second user joins the room and creates offer for the first user 
// const makeOffer = () => {
//     let connection = new RTCPeerConnection(servers);
  
//     let firstOffer = connection.createOffer()
//       .then( offer => {
//         connection.setLocalDescription(firstOffer);
//         return offer;
//       } )
//       .catch( error => {
//         console.log( "error while logging the offer:", error ); 
//       } )

      
// }

// export default makeOffer 


class PeerService{

    constructor(){
        if( !this.peer ){
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ]
                    }
                ]
            })
        } 
    }

    async makeOffer(){

        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription( new RTCSessionDescription(offer) );
            return offer;
        }
    }

}

export default new PeerService();
