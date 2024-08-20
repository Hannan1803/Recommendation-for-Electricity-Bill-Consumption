document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mid');
    const searchBox = document.getElementById('searchBox');
    const applianceContainer = document.getElementById('applianceContainer');
    const noResultsMessage = document.getElementById("noResults");
    //noResultsMessage.style.display='block';
    

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
                console.log(noResultsMessage)
                appliance.style.display = 'none';
            }
        });
        noResultsMessage.style.display = anyMatch ? 'none' : 'block';
    });

    container.addEventListener('click', function(event) {
        const clickedElement = event.target.closest('.images');
    
        if (!clickedElement) return; 
        
        const checkbox = clickedElement.querySelector('input[type="checkbox"]');
        const qtyInput = clickedElement.querySelector('input[type="number"]');

        qtyInput.addEventListener('input' , function(){
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
            return
        }
        if (event.target.type === 'checkbox') {
            if (checkbox.checked) {
                clickedElement.classList.add('glow');
            } 
        } else {
            if (clickedElement.classList.contains('glow')) {
                clickedElement.classList.remove('glow');
                qtyInput.value = '';
                if (checkbox){
                    checkbox.checked = false;
                    
                }
            } else {
                //clickedElement.style.boxShadow = '0px 4px 8px rgba(5, 5, 5, 0.5)';
                clickedElement.classList.add('glow');
            }
        }
        console.log("CHECKED ID:", checkbox.checked);
        console.log("Clicked ID:", clickedElement.id);
    });

});
