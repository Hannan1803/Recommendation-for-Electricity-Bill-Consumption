document.addEventListener('DOMContentLoaded', () => {
    const s_res = document.querySelector('.s_res');
    const p_res = document.querySelector('.p_res');
    const c_res = document.querySelector('.c_res');
    const ml_image = document.querySelector('.ml_img');
    const unit1 = document.querySelector('.unit1');
    const unit2 = document.querySelector('.unit2');
    const unit3 = document.querySelector('.unit3');
    const unit4 = document.querySelector('.unit4');
    const unit5 = document.querySelector('.unit5');
    const unit6 = document.querySelector('.unit6');


    const params = new URLSearchParams(window.location.search);
    const static_sum = params.get('static_sum');
    const predicted_sum = params.get('predicted_sum');
    const final_url1 = params.get('final_url1');
    //const final_suggestions = params.get('final_suggestions')
    //console.log("This is from the front-end js : ", final_suggestions);
    const u1 = params.get('u1');
    const u2 = params.get('u2');
    const u3 = params.get('u3');
    const u4 = params.get('u4');
    const u5 = params.get('u5');
    const u6 = params.get('u6');

    console.log("This is from the front-end js : " , u1);

    console.log("Ivan tha static : ",static_sum);
    console.log("Ivan the predicted : ",predicted_sum);
    console.log(final_url1);

    s_res.innerHTML = `Unit calculated in a Static form : ${static_sum} kwh`;
    p_res.innerHTML = `Unit calculated using Machine learning Algorithm : ${predicted_sum} kwh`;

    if(parseInt(static_sum) > parseInt(predicted_sum)){
        c_res.innerHTML = "The Algorithm predicted units are lesser than static calculation";
        ml_image.src = final_url1;
    }
    else if(parseInt(static_sum) < parseInt(predicted_sum)){
        c_res.innerHTML = "The Static calculated units are lesser than Algorithm prediction";
        ml_image.src = final_url1;
    }

    unit1.innerHTML = "<h1>100 units slab :</h1> " + u1;
    unit2.innerHTML = "<h1>400 units slab :</h1> " + u2;
    unit3.innerHTML = "<h1>600 units slab :</h1> " + u3;
    unit4.innerHTML = "<h1>800 units slab :</h1> " + u4;
    unit5.innerHTML = "<h1>2000 units slab :</h1> " + u5;
    unit6.innerHTML = "<h1>5000 units slab :</h1> " + u6;


});