import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoogleAddress = (address: any) => {
  const [map, setMap] = useState({ lat: 0, lng: 0 });
  const API = `https://maps.googleapis.com/maps/api/geocode/json?address=medellin%20${address.replaceAll(" ","%20").replaceAll("-","%2D").replaceAll("#","%23")}&key=AIzaSyDw_AhVgO1Ajk9cladAYeyahNDxvDX1lGY`;
  useEffect(() => {
    (async () => {
        const response = await axios.get(API);
        if(response.data.results.length > 0)
            setMap(response.data.results[0].geometry.location);
    })()
  }, []);
  return map;
};

export default useGoogleAddress;