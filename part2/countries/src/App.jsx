import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Filter from './components/filter'
import List from './components/List'
import Content from './components/Content'

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const getHook = () => {
    countriesService
      .getAll()
      .then(responseData => {
        setCountries(responseData)
      })
  }
  useEffect(getHook, [])

  const countryListHook = () => {
    const updatedFilteredCountries = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredCountries(updatedFilteredCountries)
    if (updatedFilteredCountries.length === 1) {
      setSelectedCountry(updatedFilteredCountries[0])
    } else {
      setSelectedCountry(null)
    }
  }
  useEffect(countryListHook, [filter, countries])

  const showCountry = (name) => {
    setSelectedCountry(countries.filter(country =>
      country.name.common.toLowerCase().includes(name.toLowerCase()))[0])
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <List filteredCountries={filteredCountries} showCountry={showCountry} />
      <Content selectedCountry={selectedCountry} />
    </div>
  )
}

export default App