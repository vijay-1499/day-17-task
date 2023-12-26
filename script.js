const create_element_groups = (tag_name, attributes = {}, content='') => {
    const _element = document.createElement(tag_name);
    _element.innerHTML = content;
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
        _element.setAttribute(attrName,attrValue)
    })
    return _element;
}







const countires_list = fetch('https://restcountries.com/v3.1/all')
countires_list.then((response)=>response.json())
.then((data)=> display_countries(data))


const weather_api_key = '170247ca112d65f3dc37cbe88e997f1d'; // Replace with your OpenWeatherMap API key
const weather_api_url = 'https://api.openweathermap.org/data/2.5/weather';

const content = create_element_groups('div', { 'class': 'row', 'id': 'country-container' });
const countryCards = [];

function display_countries(data) {
    data.forEach((country) => {
        const countryCard = create_element_groups('div', { 'class': 'col-sm-6 col-md-4 col-lg-4 col-xl-4', 'id': 'col-container' }, getCountry(country));
        content.append(countryCard);
        countryCards.push(countryCard);
    });
}


const getCountry=country=>{
    // console.log(country);
    return`
    
    <div class="card h-100" >
        <div class="card-header">
            <h5 class="card-title  py-2">${country.name.common}</h5>
        </div>
        <div class="body-con ">
            <div class="img-con mb-4">
            <img src="${country.flags.png}" class="card-img-top" alt="country-flag-image">
            </div>
            <div class="card-body">
                <div class="card-text">
                    <span class="card-text">Capital: ${country.capital}</span><br>
                    <span class="card-text">Region: ${country.region}</span><br>
                    <span class="card-text">Country-Code: ${country.altSpellings[0]}</span><br>
                    <div class="m-4" id="button">
                        <button type="submit" class="btn btn-primary fetch-weather mb-3" data-country="${country.name.common}">Click for Weather</button> <hr>
                        <div class="span-3 text-center" py-2"  id="${country.name.common}-weather"> </div>
                    </div>
                </div>
            </div>

        </div>
  </div>
    `
}
// Add an event listener for the "Fetch Weather" buttons
document.addEventListener('click',  (name)=> {
    if (name.target && name.target.classList.contains('fetch-weather')) {
        const countryName = name.target.getAttribute('data-country');
        fetchWeatherData(countryName);
    }
});

function fetchWeatherData(countryName) {
    const weatherApiUrl = `${weather_api_url}?q=${countryName}&appid=${weather_api_key}&units=metric`;

    fetch(weatherApiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Process and display weather data
            weather_content(countryName, data);
    
        })
        .catch((error) => {
            weather_content(countryName, { error: "Temperature not updated" });
        });
}
function weather_content(countryName, weatherData) {
    const weatherDiv = document.getElementById(`${countryName}-weather`);

    if (weatherDiv) {
        if (weatherData && weatherData.main) {
            weatherDiv.innerHTML = `
            <p><img src="clouds.png" style="height: 30px;width: 20px;">Temperature: ${Math.round(weatherData.main.temp)}°C</p>
            <p><img src="wind.png" style="height: 20px;"> wind: ${weatherData.wind.speed}km/h</p>
            <p><img src="humidity.png" style="height: 20px;"> humidity: ${weatherData.main.humidity}%</p>
            <p>Description: ${weatherData.weather[0].description}</p>
            `;
        } else if (weatherData.error) {
            weatherDiv.textContent = weatherData.error;
        } else {
            weatherDiv.textContent = "An error occurred while fetching weather data.";
        }
    }
}



const serach_bar = create_element_groups('input',{'type':'serach','id':'search-bar','placeholder':'search countires','class':'form-control'})
const serach_button = create_element_groups('button',{},'<img src="search.png" alt="">')
const input_div = create_element_groups('div',{'class':'input-box'})
input_div.append(serach_bar,serach_button)
const heading = create_element_groups('h1',{'id':'title','class':'text-center'},'World Countries')
const row_div = create_element_groups('div',{'class':'heading'})
row_div.append(heading,input_div);
const boot_container = create_element_groups('div', { 'class': 'container'});
boot_container.append(row_div,content)

const main_container = create_element_groups('div',{'id':'main-container'})
main_container.append(boot_container);
document.body.append(main_container);


const search = document.querySelector("#search-bar")

search.addEventListener('input', () => {
    const searchText = search.value.toLowerCase();
    countryCards.forEach((card) => {
        const countryName = card.querySelector('.card-title').textContent.toLowerCase();
        if (countryName.includes(searchText)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});