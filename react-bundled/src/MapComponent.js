
import React, { Component } from 'react';
import MarkerComponent from './MarkerComponent';
import png from './img/Roomkit-map.svg';
import './MapComponent.css'

//
// MapComponent
//
class MapComponent extends Component {
    render() {
        return (
            <div className="map-container">
                <img src={png} alt="Map" />
                <MarkerComponent device="Workbench1" x="929px" y="510px" />
                <MarkerComponent device="Workbench2" x="785px" y="626px" />
                <MarkerComponent device="Workbench3" x="956px" y="714px" />
                <MarkerComponent device="Workbench4" x="1266px" y="516px" />
            </div>

        )
    }
}

export default MapComponent;
