document.addEventListener("DOMContentLoaded", function() {
    alert("PLEASE FILL ALL DETAILS TO PROCEED TO THE NEXT PAGE")
    const stDateInput = document.querySelector('.st_date');
    const currentDateInput = document.querySelector('.current_date');
    const endDateInput = document.querySelector('.end_date');
    const submitButton = document.getElementById('submitBtn');
    const unitInput = document.querySelector('.unit');
    

    function validateForm() {
        const isDateEmpty = !stDateInput.value || !currentDateInput.value || !endDateInput.value;
        const value = unitInput.value;
        const isUnitInvalid = /[^0-9]/.test(value) || parseInt(value, 10) <= 0;

        if (isDateEmpty || isUnitInvalid || !value) {
            submitButton.style.backgroundColor = 'red'; 
            submitButton.style.color = 'white'; 
            submitButton.style.cursor = 'not-allowed'; 
            submitButton.style.pointerEvents = 'none'; 
            unitInput.style.borderColor = isUnitInvalid ? 'red' : ''; 
        } else {
            submitButton.style.backgroundColor = ''; 
            submitButton.style.color = ''; 
            submitButton.style.cursor = 'pointer'; 
            submitButton.style.pointerEvents = 'auto'; 
            unitInput.style.borderColor = '';
        }
    }

    [stDateInput, currentDateInput, endDateInput, unitInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    submitButton.addEventListener('click', function() {
        window.location.href = '../html/second.html';
        const unitValue = unitInput.value;
        window.location.href = `../html/second.html?unitValue=${encodeURIComponent(unitValue)}`;
    });
    validateForm();
});
