import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import React, { Component } from 'react';

class App extends Component {
  render() {
    return(
      <div className="App">
        <Map google={this.props.google} zoom={14}>
          <Marker onClick={this.onMarkerClick}
                  name={`Current location`} />
          
          <InfoWindow onClose={this.onInfoWindowClose}>
            {/* <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div> */}
          </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCXDfxEVTx9uiaCgGfber6z7r_uw41OvlM")
})(App)
