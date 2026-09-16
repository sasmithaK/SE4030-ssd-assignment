import React, { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import backNav from "./backNav.png";
import profile from "./profile.png";
import deliveryCart from "./deliveryCart.png";
import delivered from "./delivered.png";
import pending from "./pending.png";
import preparing from "./preparing.png";
import pendingAnimation from "./pendingAnimation.gif";
import preparingAnimation from "./preparingAnimation.gif";
import ondeliveryAnimation from "./ondeliveryAnimation.gif";
import deliveredAnimation from "./deliveredAnimation.gif";
import phone from "./phone.png";
import location from "./location.png";

const Status = () => {
  const stepperRef = useRef(null);

  const getStepHeaderIcon = (image, label) => (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="step-icon"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#e0e7ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={image}
          alt={label}
          style={{ width: "22px", height: "22px" }}
        />
      </div>
      <span style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>{label}</span>
    </div>
  );

  return (
    <div id="container" style={{ padding: "2rem" }}>
      <style>
        {`
        .p-stepper .p-stepper-header .p-stepper-number {
          display: none !important;
        }

        .p-stepper .p-stepper-header {
          border: none !important;
          box-shadow: none !important;
        }

        .p-stepper .p-stepper-panel {
          border: none !important;
        }

        .p-stepper .p-stepper-separator {
          border-top: none !important;
        }

        .p-stepper .p-stepper-header.p-highlight .step-icon {
          background-color: #0065FE !important;
        }

        .p-stepper .p-stepper-header.p-highlight ~ .p-stepper-header .step-icon {
          background-color: rgb(161, 190, 248) !important;
        }
        `}
      </style>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <p
          style={{ fontWeight: "bold", fontSize: "19px", marginRight: "auto" }}
        >
          Order Details
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p style={{ color: "gray", marginTop: "10px" }}>
            Good Morning <br />
            <span style={{ color: "black" }}>James Sullivan</span>
          </p>
          <img
            src={profile}
            alt="profilePic"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </div>

      {/* Back Navigation */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <img
          src={backNav}
          alt="backNav"
          style={{ height: "26px", width: "26px", marginRight: "8px" }}
        />
        <p style={{ margin: 0, fontWeight: "bold", color: "#0065FE" }}>Back</p>
      </div>

      {/* Header & Button */}
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold", margin: "0" }}>Order ID #5544333</p>
          <p style={{ fontSize: "15px" }}>
            Orders / <span style={{ color: "gray" }}>Order Details</span>
          </p>
        </div>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0065FE",
              borderRadius: "18px",
              color: "white",
              fontWeight: 300,
              textTransform: "none",
              fontSize: "12px",
              width: "160px",
              height: "37px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              "&:hover": {
                backgroundColor: "#0052cc",
              },
              "&:active": {
                backgroundColor: "#003f9e",
                transform: "scale(0.97)",
              },
            }}
          >
            <img
              src={deliveryCart}
              alt="deliveryIcon"
              style={{ width: "20px", height: "20px" }}
            />
            <span>ON DELIVERY</span>
          </Button>
        </Stack>
      </div>

      {/* Stepper */}
      <div style={{ padding: "2rem" }}>
        <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }}>
          <StepperPanel header={getStepHeaderIcon(pending, "Pending")}>
            <div className="flex flex-column">
              <div
                className="flex-auto flex justify-content-center align-items-center font-medium"
                style={{ height: "100px" }}
              >
                <img
                  src={pendingAnimation}
                  alt="Pending Animation"
                  style={{
                    width: "200px",
                    height: "200px",
                    marginTop: "140px",
                  }} // increase width & height as needed
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>

          <StepperPanel header={getStepHeaderIcon(preparing, "Preparing")}>
            <div className="flex flex-column">
              <div
                className="flex-auto flex justify-content-center align-items-center font-medium"
                style={{ height: "100px" }}
              >
                <img
                  src={preparingAnimation}
                  alt="preparing Animation"
                  style={{
                    width: "200px",
                    height: "200px",
                    marginTop: "140px",
                  }}
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>

          <StepperPanel header={getStepHeaderIcon(deliveryCart, "On Delivery")}>
            <div className="flex flex-column">
              <div
                className="flex-auto flex justify-content-center align-items-center font-medium"
                style={{ height: "100px" }}
              >
                <img
                  src={ondeliveryAnimation}
                  alt="delivery Animation"
                  style={{
                    width: "200px",
                    height: "200px",
                    marginTop: "140px",
                  }} // increase width & height as needed
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>

          <StepperPanel header={getStepHeaderIcon(delivered, "Delivered")}>
            <div className="flex flex-column">
              <div
                className="flex-auto flex justify-content-center align-items-center font-medium"
                style={{ height: "100px" }}
              >
                <img
                  src={deliveredAnimation}
                  alt="delivered Animation"
                  style={{
                    width: "200px",
                    height: "200px",
                    marginTop: "140px",
                  }} // increase width & height as needed
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-start">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
      {/* Delivery Person Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "16px",
          marginTop: "20px",
          backgroundColor: "#3F4953",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "830px",
          height: "110px",
          color: "#fff",
        }}
      >
        <img
          src={profile}
          alt=""
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        />

        <div style={{ minWidth: "120px" }}>
          <p style={{ color: "#737D87", fontSize: "14px", margin: 0 }}>
            Delivery Guy
          </p>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              margin: 0,
              color: "#D4DBDD",
            }}
          >
            Rainold Hawkins
          </p>
          <p style={{ color: "#737D87", fontSize: "14px", margin: 0 }}>
            ID 221443
          </p>
        </div>

        <div
          style={{
            border: "1px solid #838D97",
            padding: "12px",
            marginLeft: "146px",
            minWidth: "220px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "8px",
            backgroundColor: "#838D97",
          }}
        >
          <img
            src={phone}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <p style={{ margin: 0, fontWeight: "bold", color: "#D1D8E2" }}>
              Telephone
            </p>
            <p style={{ margin: 0, color: "#F6FCFC" }}>+94 747 2737 4488</p>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #838D97",
            padding: "12px",
            marginLeft: "16px",
            minWidth: "220px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderRadius: "8px",
            backgroundColor: "#838D97",
          }}
        >
          <img
            src={deliveryCart}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <p style={{ margin: 0, fontWeight: "bold", color: "#D1D8E2" }}>
              Delivery Time
            </p>
            <p style={{ margin: 0, color: "#F6FCFC" }}>12:24 AM</p>
          </div>
        </div>
      </div>

     {/* Customer Info */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    border: "1px solid gray",
    borderRadius: "10px",
    padding: "16px",
    marginTop: "40px",
    backgroundColor: "#3F4953",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "830px",
    height: "auto",
    color: "#fff",
  }}
>
  {/* Profile Section */}
  <img
    src={profile}
    alt=""
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginLeft: "10px",
      marginRight: "10px",
    }}
  />
  <div style={{ minWidth: "120px" }}>
    <p style={{ color: "#737D87", fontSize: "14px", margin: 0 }}>Customer</p>
    <p
      style={{
        fontWeight: "bold",
        fontSize: "16px",
        margin: 0,
        color: "#D4DBDD",
      }}
    >
      James Sullivan
    </p>
    <p style={{ color: "#737D87", fontSize: "14px", margin: 0 }}>ID 345672</p>
  </div>

  {/* Phone Section */}
  <div
    style={{
      border: "1px solid #838D97",
      padding: "12px",
      marginLeft: "146px",
      minWidth: "220px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderRadius: "8px",
      backgroundColor: "#838D97",
    }}
  >
    <img
      src={phone}
      alt=""
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
    <div>
      <p style={{ margin: 0, fontWeight: "bold", color: "#D1D8E2" }}>Phone</p>
      <p style={{ margin: 0, color: "#F6FCFC" }}>+94 773 7733 2233</p>
    </div>
  </div>

  {/* Address Section */}
  <div
    style={{
      border: "1px solid #838D97",
      padding: "12px",
      marginLeft: "16px",
      minWidth: "300px",
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      borderRadius: "8px",
      backgroundColor: "#838D97",
    }}
  >
    <img
      src={location}
      alt=""
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        objectFit: "cover",
        marginTop: "4px",
      }}
    />
    <div>
      <p style={{ margin: 0, fontWeight: "bold", color: "#D1D8E2" }}>
        Address
      </p>
      <p style={{ margin: 0, color: "#F6FCFC" }}>
        Long Horn St. Avenue 283773 United Kingdom
      </p>
    </div>
  </div>

  {/* Note Section */}
  <div
    style={{
      marginTop: "16px",
      width: "100%",
      paddingLeft: "10px",
    }}
  >
    <p style={{ margin: 0, fontWeight: "bold", color: "#D1D8E2" }}>Note</p>
    <p style={{ margin: 0, color: "#F6FCFC" }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
</div>

    </div>
  );
};

export default Status;
