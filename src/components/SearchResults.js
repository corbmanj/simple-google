import React, { Component } from 'react'
import '../static/HeaderLinks.css'

class SearchResults extends Component {
  constructor (props) {
      super(props)
      this.state = {
      }
    }

  render() {
    const resultsRows = this.props.searchResults.map((row, index) => {
      return (
        <div key={index}>
          <div>
            <a href={Object.keys(row)[0]}>{Object.keys(row)[0]}</a>
          </div>
          <div>Occurences: {row[Object.keys(row)[0]]}</div>
        </div>
      )
    })
    return (
        <div>
          <div>Found {this.props.searchResults.length} Results</div>
        { resultsRows }
        </div>
    )
  }
}

// todo: add prop-types
export default SearchResults;
