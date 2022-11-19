import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { Coordinate, EconomiaCreativa, UbicacionGeografica, Visitante } from '../types/types'
import MapCard from './map'
import Location from "./../icons/location";
import Feet from "./../icons/feet";
import House from "./../icons/house";
import { generarUbicacionGeografica, nearest10ToTematica, nearestToVisitante } from '../utils/generator'

const VisitanteCard = ({dataVisitante}:any) => {

  const [visitante, best, economia, economy_address] = dataVisitante
  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false)

  const handleHover = () => {
    setShowPopUp(true)
  }

  const handleHide = () => {
    setShowPopUp(false)
  }

  const handleHoverEdit = () => {
    setShowPopUpEdit(true)
  }

  const handleHideEdit = () => {
    setShowPopUpEdit(false)
  }
 
    return (
        <div className="list-card">
            <div className="card-body">
                <span className="card-title" onClick={handleHover}>{visitante.nombre} {visitante.apellido}</span><br></br>
                <span className="card-title" onClick={handleHover}>Donde estoy: {visitante.ubicacion_geografica.Direccion}</span>
                <span className="card-title"><button onClick={handleHoverEdit}>Editar</button></span>
            </div>
            { showPopUp && <PopUp best={best} economia={economia} economy_address={economy_address} hidePopUp={handleHide} visitante={visitante}/> }
            { showPopUpEdit && <PopUpToEdit hidePopUp={handleHideEdit} visitante={visitante}/> }
        </div>
    )
}

const EconomiaCard = ({dataEconomia}:any) => {
  const { nombre } = dataEconomia
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false)
  const handleHoverEdit = () => {
    setShowPopUpEdit(true)
  }

  const handleHideEdit = () => {
    setShowPopUpEdit(false)
  }
 
    return (
        <div className="list-card">
            <div className="card-body">
                <span className="card-title"> ECC: {nombre}</span><br></br>
                <span className="card-title"><button onClick={handleHoverEdit}>Editar</button></span>
            </div>

            { showPopUpEdit && <PopUpToEditEconomia hidePopUp={handleHideEdit} economia={dataEconomia}/> }
        </div>
    )
}

const PopUp = ({ best, economia, economy_address, hidePopUp, visitante }:any) => {
  visitante.economias_creativas.direcciones = []
  
  for(let j = 0; j < visitante.economias_creativas.length; j++)
  for(let i = 0; i < Math.random() * 4 + 1; i++) visitante.economias_creativas[j].direcciones.push(generarUbicacionGeografica());

  const deleteVisitor = (id:number) => {
    fetch(`http://localhost:3000/api/crud/select/visitantes/${id}`, {
    method: 'DELETE',
    })
    .then(res => console.log(res))
  }

  if( !economia ){
    return (
      <div className="popup-card">
        <div className="popup-card-body">
          <span className='card-action'><button className='delete' onClick={() => deleteVisitor(visitante.id_visitante)}>Eliminar</button><button onClick={hidePopUp}>Cerrar</button> </span>

          <span className="card-title">No hay economias creativas cerca</span>
          <span className="card-title">Nombre: {visitante.nombre} {visitante.apellido}</span>
          <span className="card-title">Donde estoy: {visitante.ubicacion_geografica.Direccion}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="popup-card">
      <div className="popup-card-body">
        <span className='card-action'><button className='delete' onClick={() => deleteVisitor(visitante.id_visitante)}>Eliminar</button><button onClick={hidePopUp}>Cerrar</button> </span>
        <div className="card-body-front">
          <span className="card-title"><House /> Economía de tu interés más cercana</span>
          <span className="card-name">Economia de nombre: {economia.nombre}</span>
         <span className="card-footer">
         <span className="card-address"><Location />{economy_address.Direccion}</span>
          <span className="card-distance">Te queda a {best} unidades <Feet /></span>
         </span>

          <MapCard addresses={nearestToVisitante(visitante)}/>
        </div>
      </div>
    </div>
  )
}

const PopUpToEditEconomia = ({ hidePopUp, economia }:any) => {
  const [nombre, setNombre] = useState<string>(economia.nombre)

  const updateECC = (id:number) => {
    const body = { nombre }; 
    
    fetch(`http://localhost:3000/api/crud/select/economias/update/${id}`, {
    method: 'POST',
      body: JSON.stringify(body)
    }) 
    .then(res => console.log(res))
  }

  return ( 
    <div className="popup-card">
      <div className="popup-card-body">
        <span className='card-action'><button className='delete' onClick={() => updateECC(economia.id_economia)}>Actualizar</button><button onClick={hidePopUp}>Cerrar</button> </span>
        <div className="card-body-front">
          <span className="card-title"><House /> Editar</span>
          <span className="card-name form-input">Nombre: <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /></span>
        </div>
      </div>
    </div>
  )
}

const PopUpToEdit = ({ hidePopUp, visitante }:any) => {
  console.log(visitante)
  const [nombre, setNombre] = useState<string>(visitante.nombre)
  const [apellido, setApellido] = useState<string>(visitante.apellido)
  const [direccion, setDireccion] = useState<string>(visitante.ubicacion_geografica.Direccion)
  const [email, setEmail] = useState<string>(visitante.email)
  const [telefono, setTelefono] = useState<string>(visitante.telefono)

  const updateVisitor = (id:number) => {
    const body = { nombre, apellido, 
      direccion: {
        direccion: direccion,
        id: visitante.ubicacion_geografica.id_ubicacion
      }, email, telefono }; 
      console.log(body)
    fetch(`http://localhost:3000/api/crud/select/visitantes/update/${id}`, {
    method: 'POST',
      body: JSON.stringify(body)
    }) 
    .then(res => console.log(res))
  }

  return (
    <div className="popup-card">
      <div className="popup-card-body">
        <span className='card-action'><button className='delete' onClick={() => updateVisitor(visitante.id_visitante)}>Actualizar</button><button onClick={hidePopUp}>Cerrar</button> </span>
        <div className="card-body-front">
          <span className="card-title"><House /> Editar</span>
          <span className="card-name form-input">Nombre: <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /></span>
          <span className="card-name form-input">Apellido: <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} /></span>
          <span className="card-name form-input">Dirección: <input type="address" value={direccion} onChange={(e) => setDireccion(e.target.value)} /></span>
          <span className="card-name form-input">Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></span>
          <span className="card-name form-input">Telefono: <input type="phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} /></span>
        </div>
      </div>
    </div>
  )
}

function Home({ loadAddresses }:any) {
  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [ubicaciones, setUbicaciones] = useState<UbicacionGeografica[]>([])
  const [economias, setEconomias] = useState<EconomiaCreativa[]>([])
  const [answer, setAnswer] = useState<number>(0)
  const [mappedData, setMappedData] = useState<any>([])

  useEffect(() => {  
    // const visitors = generarVisitantes(numberOfVisitors);
    fetch('api/crud/select/visitantes/').then(res => res.json()).then(data => {
      const visitors = [...data.data];
      setVisitantes(visitors)
    })  

    fetch('api/crud/select/ubicaciones').then(res => res.json()).then(data => {
      const ubicaciones = [...data.data];
      setUbicaciones(ubicaciones)
    })

    fetch('api/crud/select/economias').then(res => res.json()).then(data => {
      const economias = [...data.data];
      setEconomias(economias)
    })
  }, [])

  useEffect(() => {
    const copyVisitantes = [...visitantes]

    for(let i = 0; i < copyVisitantes.length; i++) {
      copyVisitantes[i].ubicacion_geografica = ubicaciones.find((ubicacion) => ubicacion.id_ubicacion == copyVisitantes[i].id_ubicacion) || ubicaciones[0];
      copyVisitantes[i].economias_creativas = economias.filter((economia) => economia.id_economia == copyVisitantes[i].id_economia) || economias[0];
    }

    const copyEconomias = [...economias]
    for(let i = 0; i < copyEconomias.length; i++) {
      copyEconomias[i].direcciones = ubicaciones.filter((ubicacion) => ubicacion.id_ubicacion == copyEconomias[i].id_ubicacion);
    }

    setVisitantes(copyVisitantes)
    setEconomias(copyEconomias)
    loadAddresses && loadAddresses(copyVisitantes)
    setMappedData(nearest10ToTematica(copyVisitantes))
  }, [ubicaciones])

  return (
    <div className={styles.container}>
      <div className='visitorsContainer'>
        <h3>Visitantes</h3>
        {mappedData.map((visitante:any, key:any) =>{
          return (
          <li key={key}>
            <VisitanteCard dataVisitante={visitante}/>
          </li>
          )
        })
        }
        <h3>ECC</h3>
        {economias.map((economia:any, key:any) =>{
          return (
          <li key={key}>
            <EconomiaCard dataEconomia={economia}/>
          </li>
          )
        })
        }
      </div>
    </div>
  )
}


export default function App(){
  const [addresses, setAddresses] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  useEffect(() => {
    if(addresses.length > 0){
      const data = JSON.parse(localStorage.getItem('addresses') || '[]');
      const newAddresses = [...data];
      localStorage.setItem('addresses', JSON.stringify(newAddresses));
    }
  }, [addresses])

  const loadAddresses = (visitantes: Visitante[]) => {
      const addressesResponse = visitantes.map((visitante) => visitante.ubicacion_geografica.Direccion);
      setAddresses(addressesResponse);
      localStorage.setItem("addresses", JSON.stringify(addressesResponse));
  }

  return (
    <div>
      <Home {...{loadAddresses}}/>
      {/* <MapCard addresses={addresses}/> */}
    </div>
  )
}