import gapi from "./GoogleApi"

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "88350370043-s2f8s01g7rm32oagm2ld6l283coa1ru5.apps.googleusercontent.com"});
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
    gapi.client.setApiKey("AIzaSyBUhxhxj4usFzH_yP-py1kfzs1aZ6jg31s");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  },

  findTitles() {
    let musicTitles = []
    setTimeout(
      () => {
        return ["hello"]
      }, 3000
    )
  //   gapi.client.youtube.channels.list({
  //     "part": "contentDetails",
  //     "mine": true
  //   }).then(function(response) {
  //     const likedId = response.result["items"][0]["contentDetails"]["relatedPlaylists"]["likes"]
  //     gapi.client.youtube.playlistItems.list({
  //       "part": "snippet",
  //       "playlistId": likedId,
  //       "maxResults": 5
  //       // Change to max: 30
  //     }).then(
  //       response => {
  //         const likedVideos = response.result["items"]
  //         const likedVideoIds = likedVideos.map(
  //           videoId => {
  //             return videoId["snippet"]["resourceId"]["videoId"]
  //           }
  //         )
  //         async function asyncCall() {
  //           await function() {
  //             likedVideoIds.forEach(
  //               videoId => {
  //                 gapi.client.youtube.videos.list({
  //                   "part": "snippet",
  //                   "id": videoId
  //                 }).then(
  //                   response => {
  //                     if (response.result["items"][0]["snippet"]["categoryId"] === "10") {
  //                       musicTitles.push(String(response.result["items"][0]["snippet"]["title"]))
  //                     }
  //                   }
  //                 )
  //               }
  //             )
  //           };
  //           return musicTitles;
  //         }
  //         // return asyncCall()
  //         return []
  //       }
  //     )
  //   },

  //   function(err) { console.error("Execute error", err); })

  },
}

export default Youtube