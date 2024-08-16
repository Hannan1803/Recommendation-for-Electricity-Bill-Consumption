
document.addEventListener("DOMContentLoaded", function() {
        const unitInput = document.querySelector('.unit');
        const submitButton = document.getElementById('submitBtn');

        unitInput.addEventListener('input', function() {
            const value = unitInput.value;
            const isInvalid = /[^0-9]/.test(value); // Check for non-numeric characters

            if (isInvalid) {
                submitButton.style.backgroundColor = 'red'; 
                submitButton.style.color = 'white'; 
                submitButton.style.cursor = 'not-allowed'; 
                submitButton.style.pointerEvents = 'none'; 
                unitInput.style.borderColor = 'red'; 
            } else {
                submitButton.style.backgroundColor = ''; 
                submitButton.style.color = ''; 
                submitButton.style.cursor = ''; 
                submitButton.style.pointerEvents = ''; 
                unitInput.style.borderColor = ''; 
            }
        });
});

