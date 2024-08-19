document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mid');
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
