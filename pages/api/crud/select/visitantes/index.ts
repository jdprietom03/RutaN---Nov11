// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Visitante } from '../../../../../types/types';
import executeQuery from './../../../db';

type Data = {
  data: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  executeQuery({query: 'SELECT v.*, ec.id_economia FROM Visitante v INNER JOIN VisitanteEconomia ec ON ec.id_visitante = v.id_visitante'}).then((results:any) => {
    res.status(200).json({ data: results })
    }
  ).catch((error:any) => {
      res.status(500).json({ data: error })
  } );

}
