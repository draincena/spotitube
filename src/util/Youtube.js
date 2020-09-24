import gapi from "./GoogleApi"

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "CLIENT_ID"});
});

const Youtube = {
  authenticate() {
    console.log(gapi)
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  },

  loadClient() {
    gapi.client.setApiKey("API_KEY");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  },

  findTitles() {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(["hello"])
    //   }, 3000)
    // })

    // let musicTitles = []
    // setTimeout(
    //   () => {
    //     return ["hello"]
    //   }, 3000
    // )

    return new Promise((resolve, reject) => {
      let musicTitles = []
      gapi.client.youtube.channels.list({
        "part": "contentDetails",
        "mine": true
      }).then(function(response) {
        const likedId = response.result["items"][0]["contentDetails"]["relatedPlaylists"]["likes"]
        gapi.client.youtube.playlistItems.list({
          "part": "snippet",
          "playlistId": likedId,
          "maxResults": 20
          // Change to max: 30
        }).then(
          response => {
            const likedVideos = response.result["items"]
            const likedVideoIds = likedVideos.map(
              videoId => {
                return videoId["snippet"]["resourceId"]["videoId"]
              }
            )
            let promiseArray = []
            likedVideoIds.forEach(
              videoId => {
                promiseArray.push(
                  new Promise((resolve, reject) => {
                    resolve(
                      gapi.client.youtube.videos.list({
                        "part": "snippet",
                        "id": videoId
                      })
                    )
                  })
                )
              }
            )
            Promise.all(promiseArray).then(
              values => {
                values.forEach(
                  response => {
                    if (response.result["items"][0]["snippet"]["categoryId"] === "10") {
                      musicTitles.push(String(response.result["items"][0]["snippet"]["title"]))
                    }
                  }
                )
                resolve(musicTitles)
              }
            )
          }
        )
      },
      function(err) { console.error("Execute error", err); })
    })
  },
}

export default Youtube
