import React from "react"
import "./YoutubeButtons.css"

class YoutubeButtons extends React.Component {
    constructor(props) {
        super(props)
        this.authorize = this.authorize.bind(this)
        this.import = this.import.bind(this)
    }

    authorize(event) {
        this.props.onAuthorize()
    }

    import(event) {
        this.props.onImport()
    }

    render() {
        return (
            <div className="YoutubeButtons">
                <button onClick={this.authorize}>Sign-in to Youtube</button>
                <button onClick={this.import}>Import Youtube Music Preferences</button>
            </div>
        )
    }
}

export default YoutubeButtons