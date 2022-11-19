
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

    const { nombre, apellido, email, telefono, direccion } = JSON.parse(req.body);

    executeQuery({query: `UPDATE UbicacionGeografica SET Direccion = '${direccion.direccion}' WHERE id_ubicacion = ${direccion.id}`}).then((results:any) => {
        console.log(results)
        }
    );

    executeQuery({query: `UPDATE Visitante SET nombre = '${nombre}', apellido = '${apellido}', email = '${email}', telefono = '${telefono}' WHERE id_visitante = ${id}`}).then((results:any) => {
        console.log(results)
        res.status(200).json({ data: results })
    }

    ).catch((error:any) => {
        res.status(500).json({ data: error })
    }
    );

}