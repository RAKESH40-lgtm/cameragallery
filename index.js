document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector("video");
    const rec_btn_cont = document.querySelector(".rec-btn")
    const rec_btn_area = document.querySelector(".rec-area")
    const cap_btn_cont = document.querySelector(".capture-btn")
    const cap_btn_area = document.querySelector(".capture-area")
    const showtimer = document.querySelector(".showtimer")
    const showtimerBlock = document.querySelector(".timer")
    let recorder
    let recordFlag = false
    let countTimersec = 0
    let intervalId
    const chunkStreamData = []
    streamVideo()
    // to stream the video through browser api mediadevice
    async function streamVideo() {
        const constraints = {
            audio: false,
            video: true
        }
        // from window object navigator contains the browser info by mediadevice can access hardware video and audio
        const get_perm = await window.navigator.mediaDevices.getUserMedia(constraints)
        console.log(get_perm)
        video.srcObject = get_perm
        recorder = new MediaRecorder(get_perm)
        recorder.addEventListener("start", (e) => {
            chunkStreamData.length = 0
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunkStreamData.push(e.data)
        })
        recorder.addEventListener('stop', (e) => {
            const blob = new Blob(chunkStreamData, { type: 'video/mp4' })
            const create_url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = create_url
            a.download = "videostream"
            a.click()
        })
    }
    rec_btn_cont.addEventListener("click", (e) => {
        e.stopPropagation()
        if (!recorder) return
        recordFlag = !recordFlag

        if (recordFlag) {
            recorder.start()
            rec_btn_area.classList.add("rec-scale")
            startTimer()
        } else {
            recorder.stop()
            endTimer()
            rec_btn_area.classList.remove("rec-scale")
        }
    })
    function startTimer() {
        function showTimer() {
            showtimerBlock.style.display = "block"
            let timeInsec = countTimersec
            let hours = Number.parseInt(timeInsec / 3600)
            timeInsec = timeInsec % 3600
            let min = Number.parseInt(timeInsec / 600)
            timeInsec = timeInsec % 600
            let sec = Number.parseInt(timeInsec)
            hhformat = hours < 10 ? `0${hours}` : `${hours}`
            MMformat = min < 10 ? `0${min}` : `${min}`
            SSformat = sec < 10 ? `0${sec}` : `${sec}`
            showtimer.innerText = `${hhformat}:${MMformat}:${SSformat}`
            countTimersec++
        }
        intervalId = setInterval(showTimer, 1000)
    }
    function endTimer() {
        clearInterval(intervalId)
        showtimer.innerText = "00:00:00"
        showtimerBlock.style.display = "none"
    }
})
