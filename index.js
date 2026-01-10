document.addEventListener('DOMContentLoaded',()=>{
   const video = document.querySelector("video");
    console.log(video)
    // streamVideo()
    // to stream the video through browser api mediadevice
    async function streamVideo(){
        const constraints={
            audio:true,
            video:true
        }
        // from window object navigator contains the browser info by mediadevice can access hardware video and audio
        const get_perm=await window.navigator.mediaDevices.getUserMedia(constraints)
        console.log(get_perm)
        video.srcObject=get_perm
    }
})
