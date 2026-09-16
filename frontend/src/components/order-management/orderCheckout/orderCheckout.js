import React, { useState, useEffect } from "react";
import profile from "./profile.png";
import logo from "./logo.png";
import backNav from "./backNav.png";
import cart from "./cart.png";
import Hamburger from "./Hamburger.jpeg";
import discount from "./discount.png";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrderCheckout = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/orders/customer/17');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, []);

  // Calculate subtotal from all order items
  const calculateSubtotal = () => {
    return orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((orderSum, item) => {
        return orderSum + (parseFloat(item.price) * item.qty);
      }, 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 200; // Fixed delivery fee
  const discountAmount = 350; // Example discount
  const total = subtotal + deliveryFee - discountAmount;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: " #F4F7FB"}}>
      <div
        id="headContainer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            height: "100px",
            width: "100px",
            marginLeft: "102px",
          }}
        />

        <div
          id="profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginRight: "58px",
            padding: "0px 30px",
          }}
        >
          <p style={{ margin: 0 }}>Jhon Doe</p>
          <img
            src={profile}
            alt="profile"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      <div style={{height:"800px"}}>
        <div
          id="backNav"
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "108px",
          }}
        >
          <img
            src={backNav}
            alt="backNav"
            style={{
              height: "26px",
              width: "26px",
            }}
          />
          <p style={{ margin: "0 0 0 8px" }}>Back</p>
        </div>

        <p
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginTop: "3px",
            marginLeft: "108px",
          }}
        >
          Group order checkout
        </p>

        {/* Main Section - Cart Left & Customer Details Right */}
        <div
          id="mycartContainer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginLeft: "108px",
          }}
        >
          {/* Left Section: Cart */}
          <div
            id="subContainer"
            style={{
              flex: "1",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              id="cartHead"
              style={{
                display: "flex",
                alignItems: "center",
                float: "left",
                marginRight: "648px",
                marginTop: "18px",
              }}
            >
              <img
                src={cart}
                alt="cart"
                style={{ height: "25px", width: "25px" }}
              />
              <p style={{ fontSize: "17px", margin: "0 0 0 8px" }}>My cart</p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{
                backgroundColor: "#0066FF",
                marginTop: "10px",
                marginBottom: "10px",
                padding: "7px 40px",
              }}
            >
              Confirm
            </button>

            <hr style={{ marginRight: "12px" }} />

            {/* Cart Items - Dynamically generated from orders */}
            {orders.flatMap(order =>
              order.orderItems.map((item, index) => (
                <div
                  key={`${order.id}-${item.id}`}
                  style={{ display: "flex", marginBottom: "20px" }}
                >
                  <img
                    src={Hamburger} // Using placeholder image
                    alt={item.name}
                    style={{
                      height: "140px",
                      width: "170px",
                      marginRight: "20px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "bold" }}>{item.name}</p>
                    <p style={{ color: "gray" }}>
                      Portion: {item.portion === 'regular' ? 'Regular' : 'Full'} | 
                      Qty: {item.qty} | 
                      Special Instructions: {item.specialInstructions || 'None'}
                    </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <p style={{ marginRight: "13px", fontWeight: "bold" }}>
                      {item.qty} × {parseFloat(item.price).toFixed(2)} LKR
                    </p>
                  </div>
                </div>
              ))
            )}

            <hr style={{ marginLeft: "185px", marginRight: "13px" }} />

            {/* Discount and Totals */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "0px",
              }}
            >
              <button
                type="button"
                className="btn btn-light"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #ccc",
                  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "14px 25px",
                  marginLeft: "185px",
                  marginTop: "45PX",
                }}
              >
                <img
                  src={discount}
                  alt="discount"
                  style={{ height: "20px", width: "20px" }}
                />
                Add discount
              </button>

              <div
                style={{
                  width: "300px",
                  backgroundColor: "white",
                  marginRight: "13px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0px 0 8px 0",
                  }}
                >
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} LKR</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    color: "#6c757d",
                  }}
                >
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(2)} LKR</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    color: "#6c757d",
                  }}
                >
                  <span>Discount</span>
                  <span>-{discountAmount.toFixed(2)} LKR</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "16px 0 0 0",
                    paddingTop: "8px",
                    fontWeight: "bold",
                    fontSize: "1.1em",
                  }}
                >
                  <span>Total</span>
                  <span>{total.toFixed(2)} LKR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Customer Details */}
          <div
            style={{
              alignSelf: "flex-start",
              marginTop: "50px",
              marginRight: "90px",
              marginLeft: "20px",
            }}
          >
            {/* Header Outside the Box */}
            <p style={{ fontSize: "20px", marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Total</span> <br />
              Payment
            </p>

            {/* Payment Card */}
            <div
              style={{
                width: "350px",
                padding: "40px 25px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0px 0 8px 0",
                }}
              >
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} LKR</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "8px 0",
                  color: "#6c757d",
                }}
              >
                <span>Delivery Fee</span>
                <span>{deliveryFee.toFixed(2)} LKR</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "8px 0",
                  color: "#dc3545",
                }}
              >
                <span>Discount</span>
                <span>-{discountAmount.toFixed(2)} LKR</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "16px 0 20px 0",
                  paddingTop: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                <span>Total</span>
                <span>{total.toFixed(2)} LKR</span>
              </div>

              {/* Bootstrap Button */}
              <button
                className="btn btn-primary w-100"
                style={{ marginTop: "20px" }}
              >
                Confirm & Pay
              </button>
            </div>

            {/* Description Outside the Box */}
            <p
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginTop: "18px",
                textAlign: "left",
                maxWidth: "300px",
              }}
            >
              By confirming your order, you agree to proceed with the payment.
              You will receive a receipt and order tracking details via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;