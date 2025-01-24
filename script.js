// Initialize counter
let count = 0;

// Select elements
const counterDisplay = document.getElementById("counter");
const errorMessage = document.getElementById("error-message");

// List of variations of "hello"
const helloVariations = ["hello", "helo", "hallo", "hullo", "hola", "hi", "hey", "allo", "hellooo", "namhyo", "ringe", "kyu", "divansh", "hell", "hall", "haoil"];

// Check if Speech Recognition is supported
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = "en-US"; // English language
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false; // Only finalized results

    // Start listening
    recognition.start();

    // Function to check if a word is similar to "hello"
    function isSimilarToHello(word) {
        return helloVariations.some((variation) => word.toLowerCase().includes(variation));
    }

    // Function to count "hello" occurrences in a transcript
    function countHellos(transcript) {
        const words = transcript.split(/\s+/); // Split by spaces
        return words.filter(isSimilarToHello).length; // Count words similar to "hello"
    }

    // Event: When speech is recognized
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0];
        const transcript = result.transcript.trim().toLowerCase(); // Get the spoken words
        const confidence = result.confidence; // Get the confidence score

        console.log(`Detected speech: "${transcript}" (Confidence: ${confidence})`);

        if (confidence > 0.5) { // Only process if confidence is sufficient
            const helloCount = countHellos(transcript); // Count "hello"s
            count += helloCount; // Increment the counter
            counterDisplay.textContent = count; // Update the display
            console.log(`Detected ${helloCount} 'hello(s)' in transcript.`);
        }
    };

    // Event: On error
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        errorMessage.textContent = `Error: ${event.error}`;
    };

    // Event: On recognition end (restart automatically)
    recognition.onend = () => {
        console.log("Speech recognition stopped. Restarting...");
        recognition.start();
    };
} else {
    // Speech recognition is not supported
    errorMessage.textContent = "Sorry, your browser does not support Speech Recognition.";
    console.error("Speech Recognition is not supported in this browser.");
}
