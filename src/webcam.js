export class Webcam
{

    static install(webcamSelect, video)
    {
        // handle webcam device selection change
        webcamSelect.addEventListener("change", (event) => Webcam.startStream(video, event.target.value));

        // setup webcam stream on page load
        Webcam.listWebcams().then(() => {
            const defaultDeviceId = webcamSelect.value;
            if (defaultDeviceId) {
                Webcam.startStream(video, defaultDeviceId);
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

    // start webcam stream with selected device
    static async startStream(video, deviceId)
    {
        const constraints = {
            video: { deviceId: { exact: deviceId } }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    }
}
