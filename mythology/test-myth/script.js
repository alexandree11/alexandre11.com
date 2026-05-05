window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    // The '0.2' is your speed control. 
    // Lower = slower (e.g., 0.1 is 10% speed, 0.5 is 50% speed).
    const backgroundPosition = scrollPos * 0.05; 
    
    // Apply the position to the body (or your specific container)
    document.body.style.backgroundPositionY = `${backgroundPosition}px`;
});