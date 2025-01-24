// Initialize counter
let count = 0;

// Select elements
const counterDisplay = document.getElementById("counter");
const errorMessage = document.getElementById("error-message");

// Define a list of variations of "hello"
const helloVariations = ["hello", "helo", "hallo", "hullo", "hola", "hi", "hey", "allo", "hellooo"];

// Function to check similarity using word list
function isSimilarToHello(word) {
    return helloVariations.some((variation) =>
        word.toLowerCase().includes(variation)
    );
}

// Function to preprocess transcript
function cleanTranscript(transcript) {
    // Remove unnecessary spaces, punctuations, etc.
    return transcript.trim().toLowerCase();
}

// Check if Speech Recognition is supported
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = "en-US"; // Set language to English
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false; // Process only finalized results

    // Start listening
    recognition.start();

    // Event: When speech is recognized
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0];
        const transcript = cleanTranscript(result.transcript); // Preprocess transcript
        const confidence = result.confidence; // Get confidence score
        console.log(`Detected speech: "${transcript}" (Confidence: ${confidence})`);

        // Match if confidence is high and the word is similar to "hello"
        if (confidence > 0.6 && isSimilarToHello(transcript)) {
            count++; // Increment counter
            counterDisplay.textContent = count; // Update display
        }
    };

    // Event: On error
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        errorMessage.textContent = `Error: ${event.error}`;
    };

    // Event: On speech recognition end
    recognition.onend = () => {
        console.log("Speech recognition stopped. Restarting...");
        recognition.start(); // Restart recognition if it stops
    };
} else {
    // Show error message if Speech Recognition is not supported
    errorMessage.textContent = "Sorry, your browser does not support Speech Recognition.";
    console.error("Speech Recognition is not supported in this browser.");
}
