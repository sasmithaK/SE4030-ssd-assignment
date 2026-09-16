import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantCards = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRestaurant({
      ...newRestaurant,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/restaurants', newRestaurant);
      setRestaurants([...restaurants, response.data]);
      setNewRestaurant({ name: '', address: '', available: true });
    } catch (error) {
      console.error('Failed to add restaurant', error);
    }
  };

  const handleViewMenuClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Restaurants</h1>
      
      {/* Centered Add Restaurant Form with more spacing */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6 text-center">Add New Restaurant</h2>
          <form onSubmit={handleAddRestaurant} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newRestaurant.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={newRestaurant.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                name="available"
                checked={newRestaurant.available}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="block text-sm text-gray-700">Available</label>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Restaurant
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">{restaurant.address}</p>
              <div className="flex items-center mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${restaurant.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <button
                onClick={() => handleViewMenuClick(restaurant._id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCards;