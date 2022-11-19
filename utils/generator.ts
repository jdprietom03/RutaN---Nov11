import { UbicacionGeografica, Visitante } from "../types/types";
import ubicaciones from "./../data/ubicaciones.json";
import apellidos from "./../data/apellidos.json";
import nombres from "./../data/nombres.json";

const ubicaciones_data =  ubicaciones.sort(() => 0.5 - Math.random());
const apellidos_data = apellidos.sort(() => 0.5 - Math.random());
const nombres_data = nombres.sort(() => 0.5 - Math.random());

export const generarUbicacionGeografica = ():UbicacionGeografica => {
   
    const ubicacionGeografica: UbicacionGeografica = {
        ...randomPlace()
    }    
    return ubicacionGeografica;
}

const randomPlace = ():UbicacionGeografica => {
    const randomPlace:UbicacionGeografica = ubicaciones_data[Math.floor(Math.random() * ubicaciones_data.length)];
    
    return randomPlace;
}

const generarVisitante = ():Visitante => {
    const nombre = nombres_data[Math.floor(Math.random() * nombres_data.length)].Nombre;
    const apellido = apellidos_data[Math.floor(Math.random() * apellidos_data.length)].Apellido;
    //random date between 18 and 80 years
    const bornDate =  new Date(new Date().setFullYear(new Date().getFullYear() - Math.floor(Math.random() * 62) - 18));

    const visitante = {
        nombre,
        apellido,
        fecha_nacimiento: bornDate.toISOString().split('T')[0],
        email: `${nombre}.${apellido}.${bornDate.getFullYear}@gmail.com`,
        telefono: `+57${Math.floor(Math.random() * 1000000000)}`,
        ubicacion_geografica: generarUbicacionGeografica(),
        economias_creativas: generarEconomiasCreativas(),
        datetime: new Date().toISOString(),
        sexo: Math.random() > 0.5 ? 'M' : 'F',
        tematicas: getTematicas()
    }

    return visitante;
}

const generarEconomiasCreativas = () => {
    const economias_creativas = [];
    const cantidad_economias_creativas = Math.floor(Math.random() * ubicaciones.length) % 10;

    for(let i = 0; i < cantidad_economias_creativas; i++){
        const date =  new Date(new Date().setFullYear(new Date().getFullYear() - Math.floor(Math.random() * 62) - 18));
        const economia_creativa = {
            nombre: ubicaciones_data[i].Actividad,
            fecha_fundacion: date.toISOString().split('T')[0],
            servicios: getServices(),
            productos: getProducts(),
            direcciones: getDirecciones(),
            tematicas: getTematicas()
        }
        economias_creativas.push(economia_creativa);
    }

    return economias_creativas;
}

const getServices = () => {
    const services = [];
    const cantidad_servicios = Math.floor(Math.random() * ubicaciones.length) % 10;
    
    for(let i = 0; i < cantidad_servicios; i++){
        services.push(`Servicio ${i}`);
    }

    return services;
}

const getProducts = () => {
    const products = [];
    const cantidad_productos = Math.floor(Math.random() * ubicaciones.length) % 10;

    for(let i = 0; i < cantidad_productos; i++){
        products.push(`Producto ${i}`);
    }

    return products;
}

const getDirecciones = () => {
    const direcciones = [];
    const cantidad_direcciones = Math.floor(Math.random() * ubicaciones.length) % 10;
    
    for(let i = 0; i < cantidad_direcciones; i++){
        direcciones.push(randomPlace());
    }

    return direcciones;
}

const getTematicas = () => {
    const tematicas = [];
    const cantidad_tematicas = Math.floor(Math.random() * ubicaciones.length) % 10;

    for(let i = 0; i < cantidad_tematicas; i++){
        tematicas.push(`Tematica ${i}`);
    }

    return tematicas;

}

const generarVisitantes = (cantidad:number):Visitante[] => {
    const visitantes = [];

    for(let i = 0; i < 7; i++){
        const visitante = generarVisitante();
        visitantes.push(visitante);

        console.log(`INSERT INTO Visitante (nombre, apellido, fecha_nacimiento, email, telefono, id_ubicacion, datetime, sexo, tematicas) VALUES ('${visitante.nombre}', '${visitante.apellido}', '${visitante.fecha_nacimiento}', '${visitante.email}', '${visitante.telefono}', '${i + 1}', '${visitante.datetime}', '${visitante.sexo}', '${JSON.stringify(visitante.tematicas)}');`);
        
    }

    return visitantes;
}

const manhattanDistance = (lat1:number, lon1:number, lat2:number, lon2:number) => {
  
    return Math.abs(lat1 - lat2) + Math.abs(lon1 - lon2);
    
};

const parseDir = (B:UbicacionGeografica) => {
    let lat2 = 0;
    let lon2 = 0;
    let i;

    for(i = 0; i < B.Direccion.length; i++){
        if(B.Direccion[i] >= '0' && B.Direccion[i] <= '9'){
            lat2 = lat2*10 + (parseInt(B.Direccion[i]));
        }else if(lat2 != 0) break;
    }
    
    for(let j = i+1; j < B.Direccion.length; j++){
        if(B.Direccion[j] >= '0' && B.Direccion[j] <= '9'){
            lon2 = lon2*10 + parseInt(B.Direccion[j]);
        }else if(lon2 != 0) break;
    }

    return [lat2, lon2];
}

const getCoords = (A:UbicacionGeografica, B:UbicacionGeografica) => {
    let [lat1, lon1] = parseDir(A);

    if(A.Direccion.split(' ')[0] != B.Direccion.split(' ')[0]){
        [lat1, lon1] = [lon1, lat1];
    }

    return [lat1, lon1, ...parseDir(B)];
}

export const nearestToTematica = (visitante: Visitante) => {
    const tematica = visitante.tematicas[0];
    const ubicaciones = visitante.economias_creativas.filter(ec => ec.tematicas.includes(tematica));

    const origin = visitante.ubicacion_geografica;


    let best = 1e9;
    let economia_creativa = ubicaciones[0];
    let origen = origin;
    for(let i = 0; i < ubicaciones.length; i++){
        for(let j = 0; j < ubicaciones[i].direcciones.length; j++){
            const [lat1, lon1, lat2, lon2] = getCoords(origin, ubicaciones[i].direcciones[j]);
            const distance = manhattanDistance(lat1, lon1, lat2, lon2);
            if([lat1, lon1, lat2, lon2].includes(0)) continue;

            if(distance < best){
                best = distance;
                economia_creativa = ubicaciones[i];
                origen = ubicaciones[i].direcciones[j];
            }
        }

    }

    return [best, economia_creativa, origen];
        
}

export const nearestToVisitante = (visitante: Visitante) => {
    const tematica = visitante.tematicas[0];
    // const ubicaciones = visitante.economias_creativas.filter(ec => ec.tematicas.includes(tematica));
    const ubicaciones = visitante.economias_creativas;

    const origin = visitante.ubicacion_geografica;
    let response = [];

    for(let i = 0; i < ubicaciones.length; i++){
        for(let j = 0; j < ubicaciones[i].direcciones.length; j++){
            const [lat1, lon1, lat2, lon2] = getCoords(origin, ubicaciones[i].direcciones[j]);
            const distance = manhattanDistance(lat1, lon1, lat2, lon2);
            //if([lat1, lon1, lat2, lon2].includes(0)) continue;
            response.push([ distance, ubicaciones[i].direcciones[j].Direccion])
        }

    }

    response = response.sort((a:any, b:any) => a[0] - b[0]).map( el => el[1]);

    const data = response.slice(0, 5);

    console.log(data.length, response.length)

    return data;
        
}


export const nearest10ToTematica = (visitantes: Visitante[]) => {

    const candidates = [];
    for(let i = 0; i < visitantes.length; i++){
        candidates.push([visitantes[i], nearestToTematica(visitantes[i])].flat());
    }

    candidates.sort((a:any, b:any) => a[1] - b[1]);
    
    return candidates;
}