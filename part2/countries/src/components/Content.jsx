import React from "react";
import { useState, useEffect } from 'react'
import axios from 'axios'


const Content = ({ selectedCountry }) => {
    const key = import.meta.env.VITE_WEATHER_KEY
    const [weather, setWeather] = useState(null)

    const getHook = () => {
        if (selectedCountry !== null) {
            console.log(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital}&appid=${key}`)
            axios
                .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital}&appid=${key}`)
                .then(responseData => {
                    setWeather(responseData.data)
                    console.log(weather)
                })
        }
    }
    useEffect(getHook, [selectedCountry])

    return (
        <div>
            {selectedCountry !== null &&
                <div>
                    <h1>{selectedCountry.name.common}</h1>
                    <div>capital {selectedCountry.capital}</div>
                    <div>area {selectedCountry.area}</div>
                    <h2>languages</h2>
                    <ul>
                        {Object.values(selectedCountry.languages).map(lan => (
                            <li key={lan}>{lan}</li>
                        ))}
                    </ul>
                    <img src={selectedCountry.flags.png} alt={selectedCountry.flags.alt}></img>
                    {weather !== null &&
                        <div>
                            <h2>Weather in {selectedCountry.capital}</h2>
                            <div>temperature {(weather.main.temp - 273).toFixed(2)} Celcius</div>
                            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}></img>
                            <div>wind {weather.wind.speed} m/s</div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Content