import React, { useEffect, useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import _api from './api/_api'
// import MarkerClusterer from '@googlemaps/markerclustererplus';

function App(props) {
  const [regions, setRegions] = useState([])

  useEffect(() => {
    _api.get('').then((res) => {
      setRegions(res.data.regions)
    })
  })

  return (
    <div className="App">
      <Map google={props.google} zoom={4} centerAroundCurrentLocation={true}>

          {
            regions.map((point, i) => {
              return (
                <Marker
                  key={point.name} 
                  title={point.name} 
                  position={{lat: point.latitude, lng:point.longitude}}
                >
                </Marker>
              )
            })
          }

      </Map>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCXDfxEVTx9uiaCgGfber6z7r_uw41OvlM"),
})(App)
