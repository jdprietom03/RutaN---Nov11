// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Visitante } from '../../types/types';

type Data = {
  sizeOfFiltered: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const address = req.body.address;
    
    const googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyDw_AhVgO1Ajk9cladAYeyahNDxvDX1lGY'
    });
    
    googleMapsClient.geocode({
        address: address
    }, function(err:any, response:any) {
        if (!err) {
            console.log(response.json.results[0].geometry.location);
        }
    });

    res.status(200).json({ sizeOfFiltered: address})
}
