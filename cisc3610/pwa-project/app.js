if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('mythology.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON");
            return response.json();
        })
        .then(data => {
            renderMythology(data.mythology);
        })
        .catch(error => console.error("Error loading mythology data:", error));
});

function renderMythology(mythologyArray) {
    const selector = document.getElementById('myth-selector');
    const displayArea = document.getElementById('myth-display');

    mythologyArray.forEach((myth, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = myth.title;
        selector.appendChild(opt);
    });

    selector.addEventListener('change', (e) => {
        const myth = mythologyArray[e.target.value];

        fetch(myth.textFile)
            .then(response => {
                if(!response.ok) throw new Error("Text file not found");
                return response.text();
                })
            .then(mythText => {
                // Update Content
                // ADD AUDIO TTS
                displayArea.innerHTML = `
                    <h2>${myth.title}</h2>
                    <img src="${myth.image}" alt="${myth.title}" style="max-width:100%; height:auto;">
                    <p>${myth.description}</p>
                    <p>${mythText}<p>
                    ${myth.audio ? `<audio controls src="${myth.audio}"></audio>` : ''}
                `;
                // Apply Custom Visuals from JSON
                document.body.style.backgroundColor = myth.bgColor;
                document.body.style.color = myth.textColor;
            });
        // Match the card background
        displayArea.style.backgroundColor = "rgba(255, 255, 255, 0.1)";

        // Sync the PWA theme color
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            themeMeta.setAttribute('content', myth.bgColor);
        }
    });
}