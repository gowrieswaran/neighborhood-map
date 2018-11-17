import React, { Component } from "react";

class Map extends Component {


   
  render() {
     var map = new window.google.maps.Map()
    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: "500px", width: "500px" }} />}
          mapElement={<div style={{ height: "100%" }} />}
        />
      </div>
    );
  }
}

export default Map;
