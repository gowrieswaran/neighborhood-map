import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ListMenu from "./components/ListMenu";
import escapeRegExp from "escape-string-regexp";

class App extends Component {
  state = {
    venues: [],
    markers: [],
    query: [],
    showVenue: [],
    hideMarkers: []
  };
  componentDidMount() {
    this.getVenues();
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAwUURbP3uQNwofohYQNkX3SCDGMkcpWeE&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const params = {
      client_id: "VDDKZJUOFFRHHMLU5CWB1C2QHYVMYMEDY4MCRQI3SIWGIUVC",
      client_secret: "UE3ILI4MYCSB1Y3NYK0AJGGCLDLX4PCUKRVP45HQQYVP3WZH",
      query: "tourist",
      near: "paris",
      limit: 20,
      v: "20180323"
    };

    axios
      .get(endPoint + new URLSearchParams(params))
      .then(response => {
        this.setState(
          {
            venues: response.data.response.groups[0].items,
            showVenue: response.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log(error);
        alert("Sorry!! FourSquare API data is not available ");
      });
  };
  initMap = () => {
    // Create Map
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 48.864716, lng: 2.349014 },
      zoom: 13,

      mapTypeControlOptions: {
        mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"]
      }
    });
    var styledMapType = new window.google.maps.StyledMapType(
      [
        {
          featureType: "water",
          stylers: [{ color: "#19a0d8" }]
        },
        {
          featureType: "administrative",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }, { weight: 6 }]
        },
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#e85113" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#efe9e4" }, { lightness: -40 }]
        },
        {
          featureType: "transit.station",
          stylers: [{ weight: 9 }, { hue: "#e85113" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ lightness: 100 }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ lightness: -100 }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#f0e4d3" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#efe9e4" }, { lightness: -25 }]
        }
      ],
      { name: "Styled Map" }
    );

    //Associate the styled map with the maptypeid
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");

    // Create a single latLng literal object.
    // Create Infowindow
    var infowindow = new window.google.maps.InfoWindow({ maxWidth: 200 });
    this.state.venues.forEach(myVenue => {
      var contentString = `<div class="infoWindow">
            <h2>${myVenue.venue.name}</h2>
            <h3>Address:${myVenue.venue.location.address}</h3>
            <h3>Category:${myVenue.venue.categories[0].name}</h3>
            <a href="https://en.wikipedia.org/wiki/${
              myVenue.venue.name
            }"><h4>Wikipedia-${myVenue.venue.name}<h4></a>
        </div>`;
      //Create Markers
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: myVenue.venue.name
      });
      this.state.markers.push(marker);

      //infowindow.open(map, marker);
      marker.addListener("click", () => {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 750);

        //Set Content to display on Infowindow
        infowindow.setContent(contentString);

        //Open Infowindow
        infowindow.open(map, marker);
      });
    });
  };
  updateQuery = query => {
    let displayLocations;
    this.setState({ query: query });
    this.state.markers.map(marker => marker.setVisible(true));
    if (query) {
      const match = new RegExp(escapeRegExp(query), "i");
      displayLocations = this.state.venues.filter(myVenue =>
        match.test(myVenue.venue.name)
      );
      this.setState({ venues: displayLocations });
      let hideMarkers = this.state.markers.filter(marker =>
        displayLocations.every(myVenue => myVenue.venue.name !== marker.title)
      );
      hideMarkers.forEach(marker => marker.setVisible(false));
      this.setState({ hideMarkers });
    } else {
      this.setState({ venues: this.state.showVenue });
      this.state.markers.forEach(marker => marker.setVisible(true));
    }
  };

  render() {
    return (
      <main>
        <ListMenu
          venues={this.state.venues}
          getVenues={this.getVenues}
          markers={this.state.markers}
          query={this.state.query}
          updateQuery={query => this.updateQuery(query)}
        />
        <div id="map" tabIndex="0" role="application" aria-label="map" />
      </main>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  script.onerror = () => document.write("Unable to load Google Maps");
  index.parentNode.insertBefore(script, index);
}

export default App;
