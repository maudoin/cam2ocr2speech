export class Webcam
{

    static install(webcamSelect, video, focusRange)
    {
        // handle webcam device selection change
        webcamSelect.addEventListener("change", (event) => Webcam.startStream(video, event.target.value));

        // setup webcam stream on page load
        Webcam.listWebcams().then(() => {
            const defaultDeviceId = webcamSelect.value;
            if (defaultDeviceId) {
                Webcam.startStream(video, focusRange, defaultDeviceId);
            }
        });
    }

    // retrieve webcam devices and populate the select element
    static async listWebcams()
    {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoSelect = document.getElementById("webcamSelect");

        // Clear existing options
        videoSelect.innerHTML = "";

        devices
            .filter(device => device.kind === "videoinput")
            .forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            videoSelect.appendChild(option);
            });
    }

    static gotMedia(mediastream, video, focusRange) {
        video.srcObject = mediastream;

        const track = mediastream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        // Check whether focus distance is supported or not.
        if (!capabilities.focusDistance) {
            return;
        }

        // Map focus distance to a slider element.
        focusRange.min = capabilities.focusDistance.min;
        focusRange.max = capabilities.focusDistance.max;
        focusRange.step = capabilities.focusDistance.step;
        focusRange.value = track.getSettings().focusDistance;

        focusRange.oninput = function(event) {
            track.applyConstraints({
            advanced: [
                {
                focusMode: "manual",
                focusDistance: event.target.value
                }
            ]
            });
        };
        focusRange.hidden = false;
    }
    // start webcam stream with selected device
    static async startStream(video, focusRange, deviceId)
    {
        const constraints = {
            video: {
                deviceId: { exact: deviceId } ,
                width: { ideal: 3840 },
                height: { ideal: 2160 }
            }
        };

        await navigator.mediaDevices.getUserMedia(constraints).
            then((mediastream)=>{Webcam.gotMedia(mediastream, video, focusRange)});
    }

    static captureToCanevas(video, targetCanvas, numFramesToAverage=5)
    {
        const ctxInput = targetCanvas.getContext("2d", { willReadFrequently: true });
        targetCanvas.width = video.videoWidth;
        targetCanvas.height = video.videoHeight;
        ctxInput.drawImage(video, 0, 0, targetCanvas.width, targetCanvas.height);
        let result;
        if (numFramesToAverage>1)
        {
            result = cv.imread(targetCanvas);
        }
        for (let i = 1 ; i < numFramesToAverage ; ++i)
        {
            ctxInput.drawImage(video, 0, 0, targetCanvas.width, targetCanvas.height);
            let mat = cv.imread(targetCanvas);
            cv.addWeighted(result, 0.5, mat, 0.5, 0, result);
        }
        if (numFramesToAverage>1)
        {
            cv.imshow(targetCanvas, result);
        }
    }
}
