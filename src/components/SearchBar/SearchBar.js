import React from "react"
import "./SearchBar.css"

class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query: ""
        }
        this.search = this.search.bind(this)
        this.handleTermChange = this.handleTermChange.bind(this)
    }

    search(event) {
        this.props.onSearch(this.state.query)
    }

    handleTermChange(event) {
        this.setState(
            {
                query: event.target.value
            }
        )
    }
    render() {
        return (
            <div className="SearchBar">
                <input 
                placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleTermChange}
                />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}

export default SearchBar