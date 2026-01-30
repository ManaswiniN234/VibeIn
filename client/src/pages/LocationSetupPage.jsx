import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Map, Building } from 'lucide-react';
import { authAPI } from '../services/api';

function LocationSetupPage({ setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
      'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie']
  };

  const cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'],
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Windsor'],
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Delhi': ['New Delhi', 'Delhi', 'East Delhi', 'South Delhi', 'West Delhi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Solapur'],
    'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Bijapur'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy', 'Tirunelveli'],
    'Telugu': ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Nellore'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Nellore', 'Guntur', 'Tirupati'],
    'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Jamnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Allahabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol'],
    'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Panipat', 'Rohtak'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kottayam', 'Malappuram'],
    'Assam': ['Guwahati', 'Dispur', 'Silchar', 'Dibrugarh', 'Nagaon'],
    'Jharkhand': ['Ranchi', 'Dhanbad', 'Giridih', 'Jamshedpur', 'Hazaribagh'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Ponda', 'Bicholim'],
    'Uttarakhand': ['Dehradun', 'Nainital', 'Haldwani', 'Rishikesh', 'Almora'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Kangra', 'Kullu'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!locationData.country || !locationData.state || !locationData.city) {
      setError('All location fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.updateLocation(locationData);

      if (response.success) {
        setUser(response.user);
        navigate('/home');
      } else {
        setError(response.message || 'Failed to update location');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

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
                disabled={loading}
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
                disabled={!locationData.country || loading}
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
                disabled={!locationData.state || loading}
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Location...' : 'Explore Communities'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LocationSetupPage;