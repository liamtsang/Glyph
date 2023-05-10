// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/2kU1XckoD/"

let model, webcam, labelContainer, maxPredictions

// Load the image model and setup the webcam
async function init() {
	const modelURL = URL + "model.json"
	const metadataURL = URL + "metadata.json"

	// load the model and metadata
	// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	// or files from your local hard drive
	// Note: the pose library adds "tmImage" object to your window (window.tmImage)
	model = await tmImage.load(modelURL, metadataURL)
	maxPredictions = model.getTotalClasses()

	// Convenience function to setup a webcam
	const flip = true // whether to flip the webcam
	webcam = new tmImage.Webcam(window.outerHeight , window.outerWidth, flip) // width, height, flip
	await webcam.setup({ facingMode: "environment" }) // use "user" to use front-cam on mobile phones

	// append elements to the DOM --> **before starting the webcam**
	// document.getElementById('webcam-container').appendChild(webcam.canvas); // just in case you want to use specifically the canvas
	document.getElementById("webcam-container").appendChild(webcam.webcam) // webcam object needs to be added in any case to make this work on iOS
	labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
    }

	// grab video-object in any way you want and set the attributes --> **"muted" and "playsinline"**
	let wc = document.getElementsByTagName("video")[0]
	wc.setAttribute("playsinline", true) // written with "setAttribute" bc. iOS buggs otherwise :-)
	wc.muted = "true"
	wc.id = "webcamVideo"

	// only now start the webcam --> **after video-object added to DOM and attributes are set**
	webcam.play()
	window.requestAnimationFrame(loop) // update canvas by loop-function
}

async function loop() {
	webcam.update() // update the webcam frame
	await predict()
	window.requestAnimationFrame(loop)
}

// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	const prediction = await model.predict(webcam.canvas)
	for (let i = 0; i < maxPredictions; i++) {
		const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
		labelContainer.childNodes[i].innerHTML = classPrediction;
	}
	if (prediction[0].probability > 0.9) { 	
		window.location.href = "https://www.glyph.guru/marcus_coin/" 
	}
	if (prediction[1].probability > 0.9) { 	
		window.location.href = "https://www.glyph.guru/chopmarks_coin/" 
	}
	if (prediction[2].probability > 0.9) { 	
		window.location.href = "https://www.glyph.guru/abdur_coin/" 
	}
}

init()
