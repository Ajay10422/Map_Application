// App Imports
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Map Imports
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";

axios.defaults.withCredentials = true;

// Reset Leaflet's default icon URLs to resolve webpack issues
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Api Base URL
const baseURL = "https://localhost:3000";
// const baseURL = "https://192.168.2.33:3000";

//Drop Down Container
const DropDown = (prop) => {
  console.log("test", prop.addresses[0]);
  return (
    <ul className=" p-1 divide-y bg-white z-10 rounded-3xl shadow-lg mt-1">
      {prop.addresses.map((address) => {
        return (
          <li
            className=" p-2 flex border-none cursor-pointer first:rounded-t-3xl last:rounded-b-3xl hover:bg-[rgba(60,64,67,0.04)]"
            onClick={() => prop.selectCallBack(address)}
            key={address.id}
          >
            <div className=" ml-3 overflow-hidden p-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="12"
                viewBox="0 0 384 512"
                className=" fill-[#70757a]"
              >
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
              </svg>
              <p className=" ml-3 text-sm font-medium text-[#202124]">
                {address.value}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// Home Page Component
function HomePage() {
  console.log("Map");
  const [mapref, setmapref] = useState(null);

  // UI State
  const [autoFill, setautoFill] = useState([]);
  // const [mPosition, setmPositon] = useState({});
  const [toggle, settoggle] = useState(false);
  const [src, setsrc] = useState({});

  //ELEMENT
  const SearchTxt = document.getElementById("SearchTxt");
  const SourceTxt = document.getElementById("SourceTxt");
  const DestTxt = document.getElementById("DestTxt");

  const [focusEle, setfocusEle] = useState(null);
  // TimeOut
  const WAIT_INTERVAL = 2 * 1000;
  const ENTER_KEY = 13;

  //REF
  const srcMarker = useRef();
  const dstMarker = useRef();
  const polyline = useRef();

  // Plot Route
  const plotRoute = async (src, dst) => {
    console.log("dst", dst);
    try {
      var response = await axios.post(`${baseURL}/getRoute`, {
        src: src.id,
        dst: dst.id,
      });

      var WayPoints = [...response.data];

      if (srcMarker.current !== undefined) {
        mapref.removeLayer(srcMarker.current);
      }
      if (polyline.current !== undefined) {
        mapref.removeLayer(polyline.current);
      }
      if (dstMarker.current !== undefined) {
        mapref.removeLayer(dstMarker.current);
      }

      srcMarker.current = L.marker(WayPoints[0])
        .addTo(mapref)
        .bindPopup(src.value)
        .openPopup();
      dstMarker.current = L.marker(WayPoints[WayPoints.length - 1])
        .addTo(mapref)
        .bindPopup(dst.value)
        .openPopup();

      polyline.current = L.polyline(WayPoints, { color: "blue" }).addTo(mapref);

      // zoom the map to the polyline
      mapref.fitBounds(polyline.current.getBounds());
    } catch (error) {
      console.log(error);
    }
  };

  // Pin Location
  const pinLocation = async (address) => {
    // latlong
    try {
      var response = await axios.post(`${baseURL}/latlong`, {
        id: address.id,
      });

      if (srcMarker.current !== undefined) {
        mapref.removeLayer(srcMarker.current);
      }

      srcMarker.current = L.marker([response.data.x, response.data.y])
        .addTo(mapref)
        .bindPopup(address.value)
        .openPopup();
      // console.log([response.data.x, response.data.y]);
      // setmPositon({ ...response.data });
      mapref.setView([response.data.x, response.data.y]);
    } catch (error) {
      console.log(error);
    }
  };

  const onSelect = async (address) => {
    console.log(address.value, address.id);
    // console.log(focusEle);

    if (focusEle === "SearchTxt") {
      SearchTxt.value = address.value;
      setsrc({ ...address });
      pinLocation(address);
    } else if (focusEle === "SourceTxt") {
      SourceTxt.value = address.value;
      setsrc({ ...address });
      // pinLocation(address);
    } else if (focusEle === "DestTxt") {
      DestTxt.value = address.value;
      plotRoute(src, address);
    }

    setautoFill([]);
  };

  var timer = null;

  const triggerChange = async (event) => {
    if (event.target.value !== "") {
      try {
        var response = await axios.post(`${baseURL}/search`, {
          SearchText: event.target.value,
        });
        setautoFill(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error.response.data.error);
      }
    } else {
      setautoFill([]);
    }
  };

  const handleChange = async (event) => {
    console.log(`timer ${timer}`);
    clearTimeout(timer);
    timer = setTimeout(await triggerChange(event), WAIT_INTERVAL);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      triggerChange(e);
      // console.log("Key Down");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className=" relative w-full sm:h-screen overflow-hidden select-none">
      {/* SEARCH BAR CONTAINER top-20*/}
      <div className=" h-12 w-64 top-12 sm:w-96 z-10 sm:top-3 left-4 absolute select-none">
        {/* SEARCH BAR */}
        {!toggle && (
          <div className=" relative h-12 w-64 sm:w-96 flex z-10 rounded-3xl shadow-lg">
            <input
              id="SearchTxt"
              type="text"
              placeholder="Search MapMap"
              className=" focus:outline-none h-full w-full rounded-l-3xl pt-3 pb-3 pl-5 pr-3"
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              onChange={handleChange}
              onFocus={() => {
                setfocusEle("SearchTxt");
              }}
            />
            <div className=" bg-white flex items-center w-14">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                className=" h-6 w-6 fill-[#70757a] cursor-pointer"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
            <div
              className=" bg-white flex items-center w-14 rounded-r-3xl"
              onClick={() => {
                settoggle(!toggle);
                setTimeout(() => {
                  if (src.value !== undefined) {
                    document.getElementById("SourceTxt").value = src.value;
                  }
                }, 500);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                // className=" h-6 w-6 fill-[#1a73e8] cursor-pointer"
                className=" h-6 w-6 fill-[#6c63ff] cursor-pointer"
              >
                <path d="M227.7 11.7c15.6-15.6 40.9-15.6 56.6 0l216 216c15.6 15.6 15.6 40.9 0 56.6l-216 216c-15.6 15.6-40.9 15.6-56.6 0l-216-216c-15.6-15.6-15.6-40.9 0-56.6l216-216zm87.6 137c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8v56H224c-35.3 0-64 28.7-64 64v48c0 13.3 10.7 24 24 24s24-10.7 24-24V280c0-8.8 7.2-16 16-16h64v56c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l80-80c6.2-6.2 6.2-16.4 0-22.6l-80-80z" />
              </svg>
            </div>
          </div>
        )}

        {/* SERACH INPUT BOX */}
        {toggle && (
          <div className=" bg-white rounded-3xl select-none">
            {/* SOURCE INPUT */}
            <div className=" relative h-12 w-64 sm:w-96 flex z-10 rounded-3xl shadow-lg mt-1 select-none">
              <div className=" bg-white flex items-center justify-center w-14 rounded-l-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                  className=" h-6 w-6 fill-[#da574e]"
                >
                  <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                </svg>
              </div>
              <input
                id="SourceTxt"
                type="text"
                placeholder="Choose Starting Point.."
                className=" focus:outline-none h-full w-full rounded-r-3xl pt-3 pb-3 pr-3"
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={handleChange}
                onFocus={() => {
                  setfocusEle("SourceTxt");
                }}
              />
            </div>
            {/* ELLIPS */}
            <div className=" mt-1 z-10 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="4"
                viewBox="0 0 128 512"
                className=" h-6 w-6 fill-[#da574e] ml-3"
              >
                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
              </svg>
            </div>
            {/* DESTINATION INPUT */}
            <div className=" relative h-12 w-64 sm:w-96 flex z-10 rounded-3xl shadow-lg mt-1 select-none">
              <div className=" bg-white flex items-center justify-center w-14 rounded-l-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="12"
                  viewBox="0 0 384 512"
                  className=" h-6 w-6 fill-[#da574e] cursor-pointer"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
              </div>
              <input
                id="DestTxt"
                type="text"
                placeholder="Choose destination.."
                className=" focus:outline-none h-full w-full rounded-r-3xl pt-3 pb-3 pr-3"
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={handleChange}
                onFocus={() => {
                  setfocusEle("DestTxt");
                }}
              />
            </div>
            <div
              className=" bg-white rounded-full w-12 h-12 absolute flex items-center justify-center right-[-60px] top-2 shadow-lg cursor-pointer hover:bg-[#da574e]"
              onClick={() => {
                if (polyline.current !== undefined) {
                  mapref.removeLayer(polyline.current);
                }
                if (srcMarker.current !== undefined) {
                  mapref.removeLayer(srcMarker.current);
                }
                if (dstMarker.current !== undefined) {
                  mapref.removeLayer(dstMarker.current);
                }

                settoggle(!toggle);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="12"
                viewBox="0 0 384 512"
                className=" h-6 w-6"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
          </div>
        )}

        {/* DROP DOWN */}

        {autoFill.length !== 0 && (
          <DropDown addresses={autoFill} selectCallBack={onSelect} />
        )}
      </div>

      {/* MAP CONTAINER */}
      <MapContainer
        center={[43.955589, -78.861797]}
        zoom={20}
        className=" w-full h-screen z-0 relative"
        zoomControl={false}
        ref={setmapref}
        id="map"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default HomePage;
