import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  // State to store menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [error, setError] = useState(null);  // State for error handling

  // Fetch menu items from the backend API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/restaurants/5/menu-items');
        
        if (!response.ok) {
          throw new Error("Failed to fetch menu items.");
        }
        
        const data = await response.json();
        
        // Debugging: Log fetched menu items
        console.log("Fetched menu items:", data);

        // Check if the response data is in expected format
        if (Array.isArray(data)) {
          setMenuItems(data); // Set the fetched menu items to state
        } else {
          setError("Menu items data is not an array.");
        }
      } catch (error) {
        setError(error.message);  // Set error state in case of an exception
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);  // Empty dependency array ensures the fetch runs only once when the component mounts

  // Handle item click and navigate to the select order page
  const handleClick = (item) => {
    navigate('/select-order', { state: { name: item.name, price: item.price, id: item.id } });
  };

  // Styling for the components
  const containerStyle = {
    backgroundColor: "#0f0f0f",
    padding: "40px 20px",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  };

  const itemButtonStyle = {
    backgroundColor: "#1e1e1e",
    border: "none",
    borderRadius: "10px",
    padding: "18px 24px",
    marginBottom: "15px",
    color: "#fff",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const itemButtonHoverStyle = {
    backgroundColor: "#2e2e2e",
  };

  const nameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
  };

  const detailsStyle = {
    fontSize: "14px",
    color: "#ccc",
    marginTop: "4px",
  };

  const descriptionStyle = {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "6px",
    fontStyle: "italic",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Our Menu</div>
      
      {/* Error message */}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

      {menuItems.length > 0 ? (
        menuItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...itemButtonStyle,
              ...(hoveredId === item.id ? itemButtonHoverStyle : {}),
            }}
            onClick={() => handleClick(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={nameStyle}>{item.name}</div>
            <div style={detailsStyle}>
              LKR {item.price.toFixed(2)} &bull; {item.rating || "No rating"}
            </div>
            <div style={descriptionStyle}>{item.description}</div>
          </button>
        ))
      ) : (
        <div style={{ textAlign: 'center', color: '#aaa' }}>No menu items available.</div>
      )}
    </div>
  );
};

export default Menu;
