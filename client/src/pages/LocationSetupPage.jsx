import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Map, Building } from 'lucide-react';

function LocationSetupPage({ setUser }) {
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState({
    country: '',
    state: '',
    city: ''
  });

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France'];
  const states = {
    'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    'India': ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat'],
    'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie']
  };

  const cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'],
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Windsor'],
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, location: locationData }));
    navigate('/home');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when parent changes
      ...(name === 'country' && { state: '', city: '' }),
      ...(name === 'state' && { city: '' })
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Where are you located?</h1>
          <p className="text-gray-600">Help us find communities in your area</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-2" />
                Country
              </label>
              <select
                name="country"
                value={locationData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Map className="inline w-4 h-4 mr-2" />
                State/Province
              </label>
              <select
                name="state"
                value={locationData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!locationData.country}
                required
              >
                <option value="">Select your state</option>
                {locationData.country && states[locationData.country]?.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-2" />
                City
              </label>
              <select
                name="city"
                value={locationData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!locationData.state}
                required
              >
                <option value="">Select your city</option>
                {locationData.state && cities[locationData.state]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Explore Communities
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LocationSetupPage;