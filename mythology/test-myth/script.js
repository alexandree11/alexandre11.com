window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    // The divisor (5) controls the speed. 
    // Higher number = slower movement.
    document.body.style.backgroundPositionY = -(scrollPosition / 5) + 'px';
});