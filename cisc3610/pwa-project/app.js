// =========================================================================
// 1. SERVICE WORKER REGISTRATION
// =========================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// =========================================================================
// 2. GLOBAL TEXT-TO-SPEECH STATE & BUTTONS
// =========================================================================
const synth = window.speechSynthesis;
let currentUtterance = null;
let currentStoryText = ""; // Holds the active text for the controls below

const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');

// =========================================================================
// 3. INITIAL DATA FETCH
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    fetch('mythology.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON");
            return response.json();
        })
        .then(data => {
            // Passing data.mythology to our layout renderer
            renderMythology(data.mythology);
        })
        .catch(error => console.error("Error loading mythology data:", error));
});

// =========================================================================
// 4. MAIN RENDERING AND EVENT HANDLING
// =========================================================================
function renderMythology(mythologyArray) {
    const selector = document.getElementById('myth-selector');
    const displayArea = document.getElementById('myth-display');

    // Build the dropdown options
    mythologyArray.forEach((myth, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = myth.title;
        selector.appendChild(opt);
    });

    // ONE single change listener handles content updates, styling, AND resetting audio
    selector.addEventListener('change', (e) => {
        const myth = mythologyArray[e.target.value];

        fetch(myth.text) // Matches your JSON key path
            .then(response => {
                if (!response.ok) throw new Error("Text file not found");
                return response.text();
            })
            .then(mythText => {
                currentStoryText = mythText; // Save globally so TTS controls can read it

                // Update UI layout
                displayArea.innerHTML = `
                    <h2>${myth.title}</h2>
                    <img src="${myth.image}" alt="${myth.title}" style="max-width:100%; height:auto;">
                    <p>${myth.description}</p>
                    <hr>
                    <p class="story-body">${mythText}</p>
                `;

                // Apply Custom Global Page Colors from JSON
                document.body.style.backgroundColor = myth.bgColor;
                document.body.style.color = myth.textColor;

                // Sync the PWA device theme color meta tag
                const themeMeta = document.querySelector('meta[name="theme-color"]');
                if (themeMeta) {
                    themeMeta.setAttribute('content', myth.bgColor);
                }

                // Reset and prime the media control buttons for the new story
                synth.cancel();
                playBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
            })
            .catch(err => console.error(err));
    });
}

// =========================================================================
// 5. TEXT-TO-SPEECH MEDIA CONTROL LOGIC
// =========================================================================

// 1. PLAY / RESUME
playBtn.addEventListener('click', () => {
    if (synth.paused) {
        synth.resume();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    } else if (currentStoryText) {
        synth.cancel(); // Clear any ongoing speech queues
        
        currentUtterance = new SpeechSynthesisUtterance(currentStoryText);
        currentUtterance.rate = 0.95; // Slightly slower layout cadence

        // Automatically clean up button configurations when speech finishes
        currentUtterance.onend = () => {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
        };

        synth.speak(currentUtterance);
        
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
    }
});

// 2. PAUSE
pauseBtn.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        playBtn.disabled = false; 
        pauseBtn.disabled = true;
    }
});

// 3. STOP
stopBtn.addEventListener('click', () => {
    synth.cancel();
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
});

// smooth background parellel scrolling
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    // The '0.2' is your speed control. 
    // Lower = slower (e.g., 0.1 is 10% speed, 0.5 is 50% speed).
    const backgroundPosition = scrollPos * 0.1; 
    
    // Apply the position to the body (or your specific container)
    document.body.style.backgroundPositionY = `${backgroundPosition}px`;
});