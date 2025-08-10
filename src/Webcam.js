export class Webcam
{

    static async install(webcamSelect, setupStream)
    {
        const devices = await navigator.mediaDevices.enumerateDevices()
        let ids = devices.filter(device => device.kind === "videoinput").map(device=>device.deviceId);
        let capPerStream = {};
        for (let deviceId of ids) {
            capPerStream[deviceId] = await Webcam.getDeviceCapabilities(deviceId);
        }

        // handle webcam device selection change
        webcamSelect.addEventListener("change", (event) => Webcam.startStream(event.target.value, capPerStream[webcamSelect.value], setupStream));

        let updateCameraListUI = () => {
            Webcam.listWebcams().then(() => {
                const defaultDeviceId = webcamSelect.value;
                if (defaultDeviceId) {
                    Webcam.startStream(defaultDeviceId, capPerStream[defaultDeviceId], setupStream);
                }
            });
        };

        // update when camera is plugged / unplugged
        navigator.mediaDevices.addEventListener('devicechange', () => {
            updateCameraListUI();
        });

        // setup webcam stream
        updateCameraListUI();

    }

    static async getDeviceCapabilities(deviceId) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        // Stop the stream to release the camera
        track.stop();

        return capabilities;
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

    static setupFocusSlider(mediastream, focusRange) {

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

    static getFps(mediastream) {
        const track = mediastream.getVideoTracks()[0];
        const settings = track.getSettings();
        return settings.frameRate ? settings.frameRate : 30;
    }

    // start webcam stream with selected device
    static async startStream(deviceId, caps, setupStream)
    {
        const constraints = {
            video: {
                deviceId: { exact: deviceId } ,
                width: caps.width.max,
                height: caps.height.max,
                // frameRate: caps.frameRate.max,
                // sharpness: 255
            }
        };

        await navigator.mediaDevices.getUserMedia(constraints).
            then(str=>setupStream(str, caps));
    }
    static async waitForResolutionChange(track, targetWidth, targetHeight) {
        return new Promise(resolve => {
            const check = () => {
            const { width, height } = track.getSettings();
            if (width === targetWidth && height === targetHeight) {
                resolve();
            } else {
                setTimeout(check, 100);
            }
            };
            check();
        });
    }
    static async setMaxResolution(mediastream, caps)
    {
        const track = mediastream.getVideoTracks()[0];
        track.applyConstraints({
            width: caps.width.max,
            height: caps.height.max,
         })
        .catch(error => console.error("Resolution change failed:", error));
        await Webcam.waitForResolutionChange(track, caps.width.max, caps.height.max);
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();
        const bitmap = await createImageBitmap(blob);
        const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = offscreen.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    }
    static async setMaxFramerate(mediastream, caps)
    {
        const track = mediastream.getVideoTracks()[0];
        track.applyConstraints({
                frameRate: caps.frameRate.max,
         })
        .catch(error => console.error("Framerate change failed:", error));
        await Webcam.waitForResolutionChange(track, caps.width.max, caps.height.max);
    }

    static captureToCanevas(video, targetCanvas, numFramesToAverage=1)
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
