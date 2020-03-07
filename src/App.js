import React, { Component } from "react";
import logo from "./logo.svg";
import * as $ from "jquery";
import "./App.css";
export const authEndpoint = 'https://accounts.spotify.com/authorize';
var Spotify = require('spotify-web-api-js');



// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "fc234cc105d4466184c315ff51fd5b16";
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
function handleClick(current, e) {
  console.log('The button was clicked',e);
  spotifyApi.getPlaylistTracks(e)
  .then((response) => current.setState({playlist_tracks:response["items"]}));
}
class App extends Component {
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      spotifyApi.setAccessToken(_token);
      // spotifyApi.getPlaylistTracks('5ujyl8wg80iaDfYKsrZmIJ')

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
            <div>
              <ol>
                {this.state.playlists.map(playlist => <button onClick={() => handleClick(this,playlist.id)}>{playlist.name}</button>)}
              </ol>
            </div>
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
      <div>
        {
          this.state ? [
            [this.state.playlist_tracks ?
                  (
                    <iframe id='spotify-player' src={`https://open.spotify.com/embed/track/${this.state.playlist_tracks[Math.floor(Math.random() * this.state.playlist_tracks.length)]["track"]["id"]}`} style={{display:'hidden!important'}} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                  )
                  :
                  (
                    console.log("top")
                  )
            ]
          ]
        :
          console.log('yeep')
        }
      </div>
    </div>
  );
  }
}
export default App;
