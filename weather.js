const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.msg');
const list = document.querySelector('.ajax-section .cities');

localStorage.setItem("apiKey" , EncryptStringAES("a62a8b2a49dffd24b17c052e8536faa8"));

form.addEventListener("submit" , (e) => {
    e.preventDefault();
    getWeatherDataFromApi();
})

const getWeatherDataFromApi = async() => {
    // alert("http request submitted");
    let tokenKey = DecryptStringAES(localStorage.getItem("apiKey"));
    let inputVal = input.value;
    let unitType = "metric";
    let lang = "tr";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${tokenKey}&units=${unitType}&lang=${lang}`;
    try{
        const response = await axios(url);
        const { main , weather , name , sys } = response.data;
        console.log(response.data);
        let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        //forEach  -> array + nodeList
        //map filter ve reduce -> array
        const cityListItem = list.querySelectorAll('.city');
        const cityListItemArray = Array.from(cityListItem);
        
        if(cityListItemArray.length > 0){
            const filteredArray = cityListItemArray.filter(cityCard => cityCard.querySelector('span').innerText == name);
            console.log(filteredArray.length);
            if(filteredArray.length > 0){
                msg.innerText =`You already know the weather of for ${name} , Please try another city!`;
                setTimeout(() => {
                    msg.innerText = "";
                },5000);
                form.reset();
                return

            }
        }


        const createdLi = document.createElement("li");
        createdLi.classList.add("city");
        const createdLiInnerHTML = 
        `<h2 class="city-name" data-name="${name} , ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>`;
    createdLi.innerHTML = createdLiInnerHTML;
    list.append(createdLi)
    }
    catch(error){
        msg.innerHTML = error
    }
    form.reset();
}