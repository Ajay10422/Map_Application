import React from "react";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import LandingPage from "./ui/LandingPage";
import HomePage from "./ui/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/MapMap",
    element: <HomePage />,
  },
]);

function App() {
  function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // https://www.openstreetmap.org/?mlat=43.94423&mlon=-78.89527#map=17/43.94423/-78.89527

      status.textContent = "";
      // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.href = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function locationError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          status.textContent = "User denied the request for geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          status.textContent = "Location information is currently unavailable.";
          break;
        case error.TIMEOUT:
          status.textContent = "Request for user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          status.textContent = "An unknown error occurred.";
          break;
        default:
          status.textContent = "An unknown error occurred.";
          break;
      }
    }

    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, locationError);
    }
  }

  return <RouterProvider router={router} />;
}

export default App;
