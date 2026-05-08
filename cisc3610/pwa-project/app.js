if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
// 1. Wait for the page to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Fetch the JSON data
    fetch('mythology.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON");
            return response.json();
        })
        .then(data => {
            // 3. Populate your menu and main content area
            renderMythology(data.mythology);
        })
        .catch(error => console.error("Error loading mythology data:", error));
});

function renderMythology(mythologyArray) {
    const menu = document.getElementById('menu-list');
    const displayArea = document.getElementById('myth-display');

    mythologyArray.forEach((myth, index) => {
        // Create menu items
        const listItem = document.createElement('li');
        listItem.textContent = myth.title;
        listItem.className = 'menu-item';
        
        // Add click event to show myth details
        listItem.addEventListener('click', () => {
            displayArea.innerHTML = `
                <h2>${myth.title}</h2>
                <img src="${myth.image}" alt="${myth.title}" style="width: 100%;">
                <p>${myth.description}</p>
                <audio controls src="${myth.audio}"></audio>
            `;
        });
        
        menu.appendChild(listItem);
    });
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});