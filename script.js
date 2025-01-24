let count = 0;

const counterDisplay = document.getElementById("counter");
const errorMessage = document.getElementById("error-message");

const helloVariations = ["hello", "helo", "hallo", "hullo", "hola", "hi", "hey", "allo", "hellooo", "namhyo", "ringe", "kyu", "divansh", "hell", "hall", "haoil"];

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.start();

    function isSimilarToHello(word) {
        return helloVariations.some((variation) => word.toLowerCase().includes(variation));
    }

    function countHellos(transcript) {
        const words = transcript.split(/\s+/);
        return words.filter(isSimilarToHello).length;
    }

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0];
        const transcript = result.transcript.trim().toLowerCase();
        const confidence = result.confidence;

        console.log(`Detected speech: "${transcript}" (Confidence: ${confidence})`);

        if (confidence > 0.5) {
            const helloCount = countHellos(transcript);
            count += helloCount;
            counterDisplay.textContent = count;
            console.log(`Detected ${helloCount} 'hello(s)' in transcript.`);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        errorMessage.textContent = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        console.log("Speech recognition stopped. Restarting...");
        recognition.start();
    };
} else {
    errorMessage.textContent = "Sorry, your browser does not support Speech Recognition.";
    console.error("Speech Recognition is not supported in this browser.");
}
