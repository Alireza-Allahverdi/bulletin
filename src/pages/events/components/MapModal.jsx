import { Icon } from '@iconify/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

function MapModal({ onPositionAccept, closeModal }) {

    const [defaultLocation, setDefaultLocation] = useState([35.7596, -79.0193])
    const [chosenLocation, setChosenLocation] = useState([])

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow
    });

    const MapComponent = () => {
        useMapEvents({
            click: (e) => {
                const {lat, lng} = e.latlng
                setChosenLocation([lat, lng])
            }
        })
        return null
    }

    const validateAndAccept = () => {
        if (chosenLocation.length === 0) {
            return toast.error("You must choose a location", {duration: 1500})
        }
        onPositionAccept(chosenLocation)
    }

    return (
        <div className="mapModalContiner">
            <div className="mapModalSelf">
                <MapContainer center={defaultLocation} zoom={11} scrollWheelZoom={false} style={{ width: "100%", height: "250px" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={chosenLocation.length !== 0 ? chosenLocation : [0,0]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    <MapComponent />
                </MapContainer>
                <div className="mapAction">
                    <button onClick={closeModal}><Icon icon="radix-icons:cross-circled" /></button>
                    <button onClick={validateAndAccept}><Icon icon="material-symbols:check-circle-outline-rounded" /></button>
                </div>
            </div>
        </div>
    )
}

export default MapModal