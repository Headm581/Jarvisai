// ====== Configuration ======
const NEWS_API_KEY = af8e9fb24e784c3899fc9f7456f21d78; // Replace with your NewsAPI key

// Voice Recognition Setup
const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = languageSelect.value;
recognition.interimResults = false;

// Load Voices
let voices = [];
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}
window.speechSynthesis.onvoiceschanged = loadVoices;

// Activate Jarvis
startBtn.addEventListener('click', () => {
    recognition.lang = languageSelect.value;
    recognition.start();
    output.textContent = 'Listening...';
});

// Handle Voice Commands
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    output.textContent = `You said: "${transcript}"`;
    respond(transcript);
};

// NewsAPI Integration
async function getNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'ok') {
            const headlines = data.articles.slice(0, 5).map(article => article.title);
            return `Here are the top headlines: ${headlines.join(', ')}`;
        } else {
            return "Sorry, I couldn't fetch the news right now.";
        }
    } catch (error) {
        return "Sorry, there was an error fetching the news.";
    }
}

// Reminder System (same as before)

// Wake-Word Detection (same as before)

// Smart Response System
function respond(message) {
    const jarvisResponse = new SpeechSynthesisUtterance();
    jarvisResponse.lang = languageSelect.value;

    const selectedVoiceIndex = voiceSelect.value;
    if (voices[selectedVoiceIndex]) {
        jarvisResponse.voice = voices[selectedVoiceIndex];
    }

    // Wake Word Detection
    if (message.includes("hey jarvis")) {
        jarvisResponse.text = "Hello! How can I assist you today?";
        speechSynthesis.speak(jarvisResponse);
        return;
    }

    // News Command
    if (message.includes('news')) {
        getNews().then((newsReport) => {
            jarvisResponse.text = newsReport;
            speechSynthesis.speak(jarvisResponse);
        });
        return;
    }

    // Reminder Commands (same as before)

    // Default Responses (same as before)

    speechSynthesis.speak(jarvisResponse);
}

// Dark Mode Toggle (same as before)

// Load Voices on Page Load
loadVoices();
