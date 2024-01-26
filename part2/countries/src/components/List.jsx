import React from "react";

const List = ({ filteredCountries, showCountry }) => {
    return (
        <div>
            {
                filteredCountries.length <= 10 ?
                    filteredCountries.map(country => (
                        <div key={country.name.common}>{country.name.common} <button onClick={() => showCountry(country.name.common)}>show</button>
                        </div>))
                    : <div>Too many matches, specify another filter</div>
            }
        </div>
    )
}

export default List