document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.querySelector('.mid');
    const searchBox = document.getElementById('searchBox');
    const applianceContainer = document.getElementById('applianceContainer');
    const noResultsMessage = document.getElementById("noResults");
    const subBtn = document.querySelector('.appsub_btn');
    const params = new URLSearchParams(window.location.search);
    const unitValue = params.get('unitValue');
    const cdate = params.get('cdate');
    const edate = params.get('edate');

    const no_room = params.get('no_room');
    const people_val = params.get('people_val');
    const children_val = params.get('children_val');
    const avg_income = params.get('avg_income');
    const send_flat = params.get('send_flat');

    let p_sum;
    let s_sum;
    let f_url1;
    let f_url2;
    let sugg;
    var units_1;
    var units_2;
    var units_3;
    var units_4;
    var units_5;
    var units_6;

    console.log(people_val, children_val, avg_income, send_flat , no_room);

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
        console.log("Current date:", cdate, "End date:", edate, "Units:", unitValue);

        const selectedAppliances = [];
        const appliances = applianceContainer.querySelectorAll('.images');

        appliances.forEach(appliance => {
            const checkbox = appliance.querySelector('input[type="checkbox"]');
            const qtyInput = appliance.querySelector('input[type="number"]');
            const isGlowing = appliance.classList.contains('glow');

            if (checkbox.checked || isGlowing) {
                const applianceName = appliance.querySelector('h5').textContent;
                const quantity = qtyInput.value || '1'; // Default to '1' if empty
                selectedAppliances.push({
                    name: applianceName,
                    quantity: quantity,
                    constant :checkbox.checked
                });
            }
        });

        let hasAirConditioner = selectedAppliances.some(appliance => appliance.name === "AIR CONDITIONER");
        let hasTelevision = selectedAppliances.some(appliance => appliance.name === "TELEVISION");

        let has_ac = hasAirConditioner ? 1 : 0;
        let has_tv = hasTelevision ? 1 : 0;

        console.log("AC Present:", has_ac);
        console.log("TV Present:", has_tv);
        console.log("People:", people_val, "Children:", children_val, "Average Income:", avg_income, "Is Flat:", send_flat);

        fetch('http://localhost:3000/material', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applianceData: selectedAppliances,
                currentDate: cdate,
                endDate: edate,
                consumedUnit: unitValue,
                usageSlabs: [100, 400, 600, 800, 2000, 5000] // Request optimal usage for these unit slabs
            }),
        })
        .then(response => response.json())
        .then(data => {
            sugg = data.optimalUsage;
            units_1 = sugg['Slab 100 units'];
            units_2 = sugg['Slab 400 units'];
            units_3 = sugg['Slab 600 units'];
            units_4 = sugg['Slab 800 units'];
            units_5 = sugg['Slab 2000 units'];
            units_6 = sugg['Slab 5000 units'];
            console.log('Optimized Usage for Slabs:', units_1);

            fetch('http://localhost:3000/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applianceData: selectedAppliances,
                    currentDate: cdate,
                    endDate: edate,
                    param2: unitValue,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Total Consumption:', data.totalConsumption);
                s_sum = data.totalConsumption;

                fetch('http://localhost:3000/predict-unit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        num_rooms: no_room,
                        num_people: people_val,
                        is_ac: has_ac,
                        is_tv: has_tv,
                        is_flat: send_flat,
                        ave_monthly_income: avg_income,
                        num_children: children_val
                    })
                })
                .then(response => response.json())
                .then(data => {
                    f_url1 = data.imageUrl1;
                    p_sum = data.prediction;
                    console.log("Itha da p_sum : " , p_sum );


                    const static_sum = s_sum;
                    const predicted_sum = p_sum;
                    const final_url1 = f_url1;
                    /*const u1 = JSON.stringify(units_1);
                    const u2 = JSON.stringify(units_2);
                    const u3 = JSON.stringify(units_3);
                    const u4 = JSON.stringify(units_4);
                    const u5 = JSON.stringify(units_5);
                    const u6 = JSON.stringify(units_6);*/
                    //console.log(u1.toString());
                    function jsonToString(obj) {
                        let result = '';
                        for (const [key, value] of Object.entries(obj)) {
                            result += `${key}: ${value}\n`;  // Create a string format like "CEILING FAN: 0 hours and 7 minutes for 1 units"
                        }
                        return result;
                    }
                    const u1 = jsonToString(units_1);
                    const u2 = jsonToString(units_2);
                    const u3 = jsonToString(units_3);
                    const u4 = jsonToString(units_4);
                    const u5 = jsonToString(units_5);
                    const u6 = jsonToString(units_6);
                    console.log(u1);
                    console.log("Itha da predicted ku vanthathu :" , predicted_sum);
                    const url = `../html/result.html?static_sum=${encodeURIComponent(static_sum)}&predicted_sum=${encodeURIComponent(predicted_sum)}&final_url1=${encodeURIComponent(final_url1)}&u1=${encodeURIComponent(u1)}&u2=${encodeURIComponent(u2)}&u3=${encodeURIComponent(u3)}&u4=${encodeURIComponent(u4)}&u4=${encodeURIComponent(u4)}&u5=${encodeURIComponent(u5)}&u6=${encodeURIComponent(u6)}`;
                    window.location.href = url;
                }) 
            })
            .catch(error => console.log("Ula vantha prechana: ",error));
        })
        .catch(error => console.error('Inga tha Error:', error));
        })
});
