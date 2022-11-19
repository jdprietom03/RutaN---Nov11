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
  const visitantes = req.body.filter((visitante:Visitante) => visitante.economias_creativas.length >= 3);

  const fs = require('fs');


  fs.writeFile('visitantes.json', JSON.stringify(visitantes), (err:Error) => {
    if (err) throw err;
    console.log('Visitantes guardados en visitantes.json');
  });

  res.status(200).json({ sizeOfFiltered: visitantes.length })
}
