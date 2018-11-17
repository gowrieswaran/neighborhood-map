import React, { Component } from "react";
import "../App.css";
import { slide as Menu } from "react-burger-menu";

class ListMenu extends Component {
  showList = venueName => {
    this.props.markers.forEach(marker => {
      if (marker.title === venueName) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  clearQuery = () => {
    alert(this.props.markers.length);
  };

  render() {
    return (
      <Menu
        className="bm-menu"
        right
        noOverlay
        isOpen
        aria-label="menu"
        role="menu"
      >
        <h1>Locate your Favourite spot in Paris</h1>
        <div className="list">
          <input
            className="search-location"
            type="search"
            placeholder="Search Locations"
            value={this.props.query}
            onChange={event => this.props.updateQuery(event.target.value)}
          />

          <ol aria-label="List of venues">
            {this.props.venues.map(myVenues => (
              <li
                tabIndex="0"
                role="button"
                key={myVenues.venue.id}
                onClick={() => {
                  this.showList(myVenues.venue.name);
                }}
              >
                {myVenues.venue.name}
              </li>
            ))}
          </ol>
        </div>
      </Menu>
    );
  }
}
export default ListMenu;
