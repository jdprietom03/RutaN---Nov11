
export interface UbicacionGeografica {
    id_ubicacion?:number;
    Entidad: string;
    Actividad: string;
    Direccion: string;
}

export interface EconomiaCreativa{
    id_economia?: number;
    id_visitante?: number;
    nombre: string;
    fecha_fundacion: string;
    servicios: string[];
    productos: string[];
    direcciones: UbicacionGeografica[];
    tematicas: string[];
}

export interface VisitanteEntity{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    edad: number;
    id_ubicacion_geografica: string;
}

export interface Visitante {
    id_visitante?:number;
    id_ubicacion?:number;
    id_economia?:number;
    nombre: string;
    apellido: string;
    email: string;
    sexo: string;
    fecha_nacimiento: string;
    telefono: string;
    ubicacion_geografica: UbicacionGeografica;
    economias_creativas: EconomiaCreativa[];
    datetime: string;
    tematicas: string[];
}

export interface Coordinate {
    lat: number;
    lng: number;
    name: string;
}
