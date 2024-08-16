document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mid');

    container.addEventListener('click', function(event) {
        const clickedElement = event.target.closest('.images');
        
        if (!clickedElement) return; // Ignore clicks outside .images elements
        
        const checkbox = clickedElement.querySelector('input[type="checkbox"]');

        if (event.target.type === 'checkbox') {
            // If the checkbox is clicked, do not affect the glow directly
            if (checkbox.checked) {
                clickedElement.style.boxShadow = '0px 4px 8px rgba(5, 5, 5, 0.5)';
            } else {
                // If checkbox is unchecked, remove the glow
                clickedElement.style.boxShadow = '';
            }
        } else {
            // If the image or description is clicked
            if (clickedElement.style.boxShadow) {
                // If glow is already on, remove the glow and uncheck the checkbox
                clickedElement.style.boxShadow = '';
                if (checkbox) checkbox.checked = false;
            } else {
                // Apply the glow
                clickedElement.style.boxShadow = '0px 4px 8px rgba(5, 5, 5, 0.5)';
            }
        }
        
        console.log("Clicked ID:", clickedElement.id);
    });
});
