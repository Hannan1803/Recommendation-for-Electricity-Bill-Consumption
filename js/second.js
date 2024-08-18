document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mid');
    container.addEventListener('click', function(event) {
        const clickedElement = event.target.closest('.images');
    
        if (!clickedElement) return; // Ignore clicks outside .images elements
        
        const checkbox = clickedElement.querySelector('input[type="checkbox"]');
        const qtyInput = clickedElement.querySelector('input[type="number"]');

        if (event.target === qtyInput) {
            // If the quantity input box is clicked
            clickedElement.classList.add('glow');
            qty.classList.add('glow');
            console.log("authiten")
            return
        }
        if (event.target.type === 'checkbox') {
            // If the checkbox is clicked, do not affect the glow directly
            if (checkbox.checked) {
                clickedElement.classList.add('glow');
            } else {
                //clickedElement.classList.remove('glow');
            }
        } else {
            // If the image or description is clicked
            if (clickedElement.classList.contains('glow')) {
                // If glow is already on, remove the glow and uncheck the checkbox
                //clickedElement.style.boxShadow = '';
                clickedElement.classList.remove('glow');
                if (checkbox) checkbox.checked = false;
            } else {
                //clickedElement.style.boxShadow = '0px 4px 8px rgba(5, 5, 5, 0.5)';
                clickedElement.classList.add('glow');
            }
        }
        console.log("CHECKED ID:", checkbox.checked);
        console.log("Clicked ID:", clickedElement.id);
    });

});
