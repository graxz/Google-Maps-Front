import React, { useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Marker = ({children}) => children;

export default function App() {

  const mapRef = useRef();
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState(null)

  const url = "https://testenodejspleno.herokuapp.com"
  const {data, error} = useSWR(url, { fetcher })
  const regions = data && !error ? data.regions : []
  const points = regions.map(region => ({
    type: "Feature",
    properties: { cluster: false, regionId: region.id, regionName: region.name, category: region.category },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(region.longitude),
        parseFloat(region.latitude)
      ]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  return (
    <div style={{ height: "100vh", width: "100%"}}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyCXDfxEVTx9uiaCgGfber6z7r_uw41OvlM" }}
      defaultCenter={{ lat: -23.5489, lng: -46.6388 }}
      defaultZoom={10}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({map}) => {
        mapRef.current = map
      }}
      onChange={({ zoom, bounds }) => {
        setZoom(zoom);
        setBounds([
          bounds.nw.lng,
          bounds.se.lat,
          bounds.se.lng,
          bounds.nw.lat
        ]);
      }}
    >

      {clusters.map(cluster => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount
        } = cluster.properties;

        if (isCluster) {
          const size = 10 + (pointCount / points.length) * 65

          return (
            <Marker
              key={`cluster-${cluster.id}`}
              lat={latitude}
              lng={longitude}
            >
              <div
                className="cluster-marker"
                style={{
                  display: "flex",
                  padding: "5px",
                  opacity: "0.8",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  backgroundColor: "lightpink",
                  borderRadius: "50%",
                  width: `${size}px`,
                  height: `${size}px`
                }}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.setZoom(expansionZoom);
                  mapRef.current.panTo({ lat: latitude, lng: longitude });
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`region-${cluster.properties.regionName}`}
            lat={latitude}
            lng={longitude}
          >
            <img src="/point.png" alt="regions" />
          </Marker>
        );        
      })}

    </GoogleMapReact>
  </div>
  );
}
