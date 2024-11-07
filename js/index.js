document.addEventListener("DOMContentLoaded", function() {
    alert("PLEASE FILL ALL DETAILS TO PROCEED TO THE NEXT PAGE");

    const stDateInput = document.querySelector('.st_date');
    const currentDateInput = document.querySelector('.current_date');
    const endDateInput = document.querySelector('.end_date');
    const submitButton = document.getElementById('submitBtn');
    const unitInput = document.querySelector('.unit');
    const room = document.querySelector('.room');
    const ppl = document.querySelector('.people');
    const chd = document.querySelector('.children');
    const income = document.querySelector('.income');
    const flat_type_radios = document.querySelectorAll('input[name="ques"]');

    function validateForm() {
        const isDateEmpty = !stDateInput.value || !currentDateInput.value || !endDateInput.value;
        const value = unitInput.value;
        const isUnitInvalid = /[^0-9]/.test(value) || parseInt(value, 10) < 0;
        const roomval = room.value;
        const isroom = /[^0-9]/.test(roomval) || parseInt(roomval, 10) < 0;
        const pplvalue = ppl.value;
        const isppl = /[^0-9]/.test(pplvalue) || parseInt(pplvalue, 10) < 0;
        const chdvalue = chd.value;
        const ischd = /[^0-9]/.test(chdvalue) || parseInt(chdvalue, 10) < 0;
        const income_val = income.value;
        const isincome = /[^0-9]/.test(income_val) || parseInt(income_val, 10) < 0;

        // Check if any radio button is selected
        const isFlatTypeSelected = Array.from(flat_type_radios).some(radio => radio.checked);

        if (isDateEmpty || isUnitInvalid || !value || isroom ||isppl || ischd || isincome || !isFlatTypeSelected) {
            submitButton.style.backgroundColor = 'red'; 
            submitButton.style.color = 'white'; 
            submitButton.style.cursor = 'not-allowed'; 
            submitButton.style.pointerEvents = 'none'; 
            unitInput.style.borderColor = isUnitInvalid ? 'red' : ''; 
            room.style.borderColor = isroom ? 'red': '';
            ppl.style.borderColor = isppl ? 'red' : ''; 
            chd.style.borderColor = ischd ? 'red' : '';
            income.style.borderColor = isincome ? 'red' : ''; 
        } else {
            submitButton.style.backgroundColor = ''; 
            submitButton.style.color = ''; 
            submitButton.style.cursor = 'pointer'; 
            submitButton.style.pointerEvents = 'auto'; 
            unitInput.style.borderColor = '';
            room.style.borderColor ='';
            ppl.style.borderColor = ''; 
            chd.style.borderColor =  '';
            income.style.borderColor =  ''; 
        }
    }

    [stDateInput, currentDateInput, endDateInput, unitInput, room ,ppl, chd, income].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Add event listeners to the radio buttons to trigger validation when selected
    flat_type_radios.forEach(radio => {
        radio.addEventListener('change', validateForm);
    });

    submitButton.addEventListener('click', function() {
        let final_val;
        // Get the selected radio button
        const flat_type = document.querySelector('input[name="ques"]:checked');
        
        if (flat_type) {
            // Get the value (either "yes" or "no")
            const userSelection = flat_type.value;

            // Perform an action based on the selected value
            if (userSelection === 'yes') {
                final_val = 1;
            } else {
                final_val = 0;
            }
        } 
        //console.log("Flat or not : " , final_val);
        const send_flat = final_val;
        const unitValue = unitInput.value;
        const cdate = currentDateInput.value;
        const edate = endDateInput.value;

        const no_room = room.value;
        const avg_income = income.value;
        const people_val = ppl.value;
        const children_val = chd.value;
        

        // Construct the URL with all the parameters
        const url = `../html/second.html?unitValue=${encodeURIComponent(unitValue)}&cdate=${encodeURIComponent(cdate)}&edate=${encodeURIComponent(edate)}&send_flat=${encodeURIComponent(send_flat)}&avg_income=${encodeURIComponent(avg_income)}&people_val=${encodeURIComponent(people_val)}&children_val=${encodeURIComponent(children_val)}&no_room=${encodeURIComponent(no_room)}`;

        window.location.href = url; // Redirect to the constructed URL
    });

    validateForm(); // Initial validation
});
