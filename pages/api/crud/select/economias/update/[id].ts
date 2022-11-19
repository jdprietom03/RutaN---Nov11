
import type { NextApiRequest, NextApiResponse } from 'next'
import { Visitante } from '../../../../../../types/types';
import executeQuery from './../../../../db';

type Data = {
  data: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { id } = req.query;
    //Update

    const { nombre } = JSON.parse(req.body);

    executeQuery({query: `UPDATE EconomiaCreativa SET nombre = '${nombre}' WHERE id_economia = ${id}`}).then((results:any) => {
        console.log(results)
        res.status(200).json({ data: results })
    }

    ).catch((error:any) => {
        res.status(500).json({ data: error })
    }
    );

}