document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mid');
    const searchBox = document.getElementById('searchBox');
    const applianceContainer = document.getElementById('applianceContainer');
    const noResultsMessage = document.getElementById("noResults");
    const subBtn = document.querySelector('.appsub_btn');
    const params = new URLSearchParams(window.location.search);
    const unitValue = params.get('unitValue');
    

    searchBox.addEventListener('input', () => {
        const searchTerm = searchBox.value.toLowerCase();
        const appliances = applianceContainer.querySelectorAll('.images');
        let anyMatch = false;

        appliances.forEach(appliance => {
            const applianceName = appliance.querySelector('h5').textContent.toLowerCase();
            if (applianceName.includes(searchTerm)) {
                appliance.style.display = '';
                anyMatch = true;
            } else {
                appliance.style.display = 'none';
            }
        });
        noResultsMessage.style.display = anyMatch ? 'none' : 'block';
    });

    let finalcheck = "false";

    container.addEventListener('click', function(event) {
        const clickedElement = event.target.closest('.images');
    
        if (!clickedElement) return; 
        
        const checkbox = clickedElement.querySelector('input[type="checkbox"]');
        const qtyInput = clickedElement.querySelector('input[type="number"]');

        qtyInput.addEventListener('input', function() {
            let value = qtyInput.value;
            value = value.replace(/[^0-9.]/g, '');
            const parsedValue = parseFloat(value);
    
            if (parsedValue <= 0 || isNaN(parsedValue)) {
                qtyInput.value = '';
            } else {
                qtyInput.value = value;
            }
        });

        if (event.target === qtyInput) {
            clickedElement.classList.add('glow');
            qtyInput.classList.add('glow');
            return;
        }
        if (event.target.type === 'checkbox') {
            if (checkbox.checked) {
                clickedElement.classList.add('glow');
            } 
        } else {
            if (clickedElement.classList.contains('glow')) {
                clickedElement.classList.remove('glow');
                qtyInput.value = '';
                if (checkbox) {
                    checkbox.checked = false;
                }
            } else {
                clickedElement.classList.add('glow');
            }
        }
        
        console.log("CHECKED ID:", checkbox.checked);
        console.log("Clicked ID:", clickedElement.id);
        finalcheck = checkbox.checked;
        console.log("Final ID:", finalcheck);
    });

    subBtn.addEventListener('click', function() {
        const selectedAppliances = [];
        const appliances = applianceContainer.querySelectorAll('.images');
    
        appliances.forEach(appliance => {
            const checkbox = appliance.querySelector('input[type="checkbox"]');
            const qtyInput = appliance.querySelector('input[type="number"]');
            const isConstant = checkbox.checked;
            const isGlowing = appliance.classList.contains('glow');
            
            if (checkbox.checked || isConstant || isGlowing) {
                const applianceName = appliance.querySelector('h5').textContent;
                const quantity = qtyInput.value || '1'; // Default to '1' if empty
                selectedAppliances.push({
                    name: applianceName,
                    quantity: quantity,
                    constant: isConstant
                });
            }
        });
    
        const applianceDataJson = JSON.stringify(selectedAppliances);
        const userInput1 = '5000'; 
        const userInput2 = unitValue; 
    
        fetch('http://localhost:3000/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applianceData: selectedAppliances,
                param1: userInput1,
                param2: userInput2
            }),
        })
        .then(response => {
            console.log('Response status:', response.status); // Log response status
            return response.text(); // Get response as text to debug
        })
        .then(text => {
            console.log('Response text:', text); // Log response text
            try {
                const data = JSON.parse(text); // Try to parse response as JSON
                console.log('Optimized Usage:', data);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});