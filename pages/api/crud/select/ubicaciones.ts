// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Visitante } from '../../../../types/types';
import executeQuery from './../../db';

type Data = {
  data: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  executeQuery({query: 'SELECT * FROM UbicacionGeografica'}).then((results:any) => {

      res.status(200).json({ data: results })
    }
  ).catch((error:any) => {
      res.status(500).json({ data: error })
  } );

}
