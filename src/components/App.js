import React, { Component } from 'react'
import HeaderLinks from './HeaderLinks'
import SearchBox from './SearchBox'
import '../static/App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // todo: turn stings into constants
      activeTab: 'index',
      linkDepth: 1,
      indexedURLs: {}
    }
  }

  changeTab = (newActiveTab) => {
    if (newActiveTab !== this.state.activeTab) {
      this.setState({ activeTab: newActiveTab })
    }
  }

  indexAlreadyExists = (newIndex) => {
    return !!this.state.indexedURLs[newIndex]
  }

  updateIndex = (newIndexURL, newIndexedWords) => {
    this.setState(prevState => {
      let stateCopy = Object.assign({}, prevState)
      stateCopy.indexedURLs[newIndexURL] = newIndexedWords
      return stateCopy
    })
  }

  incrementLinkDepth = () => {
    this.setState(prevState => {
      let stateCopy = Object.assign({}, prevState)
      stateCopy.linkDepth++
      return stateCopy
    })
  }

  render() {
    return (
      <div className="App">
        <HeaderLinks
          changeTab={this.changeTab}
          activeTab={this.state.activeTab}
        />
        <SearchBox 
          activeTab={this.state.activeTab}
          indexedURLs={this.state.indexedURLs}
          linkDepth={this.state.linkDepth}
          indexAlreadyExists={this.indexAlreadyExists}
          updateIndex={this.updateIndex}
          incrementLinkDepth={this.incrementLinkDepth}
        />
      </div>
    )
  }
}

export default App
