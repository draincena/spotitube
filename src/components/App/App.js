import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import YoutubeButtons from '../YoutubeButtons/YoutubeButtons'
import Spotify from '../../util/Spotify'
import Youtube from '../../util/Youtube'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      playlist: {
        playlistName: "Playlist Name",
        playlistTracks: []
      },
      accessToken: ""
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
    this.authorizeGoogle = this.authorizeGoogle.bind(this)
    this.importYoutubePreferences = this.importYoutubePreferences.bind(this)
  }

  addTrack(track) {
    let tracks = this.state.playlist.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.key === track.key)) {
      return;
    }

    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    for (let i = 0; i < this.state.playlist.playlistTracks.length; i++) {
      if (track.key === this.state.playlist.playlistTracks[i].key) {
        if (this.state.playlist.playlistTracks.length === 1) {
          this.setState(
            {
              playlist: {
                playlistName: this.state.playlist.playlistName,
                playlistTracks: []
              }
            }
          )
        } else {
          let newPlaylistTracks = this.state.playlist.playlistTracks
          newPlaylistTracks.splice(i, 1)
            this.setState (
              {
                playlist: {
                  playlistName: this.state.playlist.playlistName,
                  playlistTracks: newPlaylistTracks
                }
              }
            )
        }
        return
      }
    }
  }

  updatePlaylistName(playlistName) {
    this.setState(
      {
        playlist: {
          playlistName: playlistName,
          playlistTracks: this.state.playlist.playlistTracks
        }
      }
    )
  }

  savePlaylist() {
    let trackURIs = this.state.playlist.playlistTracks.map(
      track => {
        return track.uri
      }
    )
    Spotify.savePlaylist(this.state.playlist.playlistName, trackURIs).then(
      () => {
        this.setState(
          {
            playlist: {
              playlistName: "Playlist Name",
              playlistTracks: []
            }
          }
        )
      }
    )
  }

  search(query) {
    console.log(`Searching for: ${query}.`)
    Spotify.search(query).then(
      tracks => {
        this.setState(
          {
            searchResults: tracks
          }
        )
      }
    )
  }

  authorizeGoogle() {
    async function asyncCall() {
      await Spotify.getAccessToken()
    }
    const accessToken = asyncCall()
    this.setState(
      {accessToken: accessToken},
      () => {
        Youtube.authenticate().then(
          Youtube.loadClient()
        )
      }
    )
  }

  async importYoutubePreferences() {
    let importedPlaylist = []
    const youtubeTitles = await Youtube.findTitles()
    let promiseArray = []
    youtubeTitles.forEach(
      title => {
        promiseArray.push(
          new Promise((resolve, reject) => {
            resolve(Spotify.search(title))
          })
        )
      }
    )
    await Promise.all(promiseArray).then(
      queries => {
        queries.forEach(
          tracks => {
            if (tracks.length > 0) {
              importedPlaylist.push(tracks[0])
            }
          }
        )
      }
    )
    this.setState(
      {
        playlist: {
          playlistName: this.state.playlist.playlistName,
          playlistTracks: importedPlaylist
        }
      }
    )
  }

  render() {
    return (
      <div>
        <h1>Spot<span className="highlight">i</span>tube</h1>
          <div className="App">
            <SearchBar 
              onSearch={this.search} 
            />
            <div className="App-playlist">
              <SearchResults 
                searchResults={this.state.searchResults} 
                onAdd={this.addTrack}
              />
              <YoutubeButtons
                onAuthorize={this.authorizeGoogle}
                onImport={this.importYoutubePreferences}
              />
              <Playlist 
                playlist={this.state.playlist}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
      </div>
    )
  }  
}

export default App;
