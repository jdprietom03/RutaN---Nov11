import { useEffect, useState } from "react";

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useGoogleAddress from "../context/useGoogleAddress";
const Map = ({ addresses }:any) => {

    console.log(addresses.length)

    if(addresses.length == 0) return <div></div>

    const data = useGoogleAddress(addresses[0]);
    
    const mapStyles = {
        height: "50vh",
        width: "100%"
    }

    const defaultCenter = {
        lat: data.lat, lng: data.lng
    }

    return (
        <>
            <LoadScript googleMapsApiKey='AIzaSyDw_AhVgO1Ajk9cladAYeyahNDxvDX1lGY' >
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={9}
                    center={defaultCenter}
                >
                   {
                          addresses.map((address:any, key:any) => {
                            const data = useGoogleAddress(address);
                            console.log(data);
                            return <Marker key={key} position={data} />
                          })
                   }
                </GoogleMap>
            </LoadScript>
        </>
    )
}

export default Map;


