import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
export const authEndpoint = 'https://accounts.spotify.com/authorize';
var Spotify = require('spotify-web-api-js');
// Replace with your app's client ID, redirect URI and desired scopes
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

var spotifyApi = new Spotify();
var index = 0;
let playlists = [];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";
class App extends Component {
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      spotifyApi.setAccessToken(_token);
      spotifyApi.getUserPlaylists()
      .then((response) => this.setState({playlists:response["items"]}));
      this.setState({
        token: _token
      });
    }
  }
render() {
  return (
    <div className="App">
      <header className="App-header">
      {this.state ?
        [
          this.state.playlists ?
          (
            <ol>
              {this.state.playlists.map(reptile => <li>{reptile.id}</li>)}
            </ol>
          )
          :
          ( console.log("outside"))
        ]
      :(
        <a
          className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      )}
      </header>
    </div>
  );
  }
}
export default App;
