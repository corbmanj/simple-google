import React, { Component } from 'react'
import cheerio from 'cheerio'

import SearchResults from './SearchResults'
import response from '../static/sampleResponse2.js'
import '../static/SearchBox.css'


class SearchBox extends Component {
  constructor (props) {
      super(props)
      this.state = {
        linkDepth: 1,
        maxLinkDepth: 4,
      }
    }

  handleIndexOrSearch = (searchTerm = this.state.searchTerm) => {
    if (this.props.activeTab === 'index') {
      // do not reindex if site has already been indexed
      if (this.props.indexAlreadyExists(searchTerm)) {
        this.setState({ message: 'site already indexed' })
      } else {
        // todo: validate the url
        const that = this
        fetch(searchTerm, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain,application/json',
            'Accept': 'text/plain,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
          },
          mode: "no-cors"
        })
        // todo: having a lot of trouble getting around new Chromium CORB policy
        // for now implementing a placeholder response
          .then(res => {
            const parsedHTML = cheerio.load(response)
            let newIndex = {}
            let newWords = 0
            // find each text word on the page (not inside an html tag)
            // if it has not been indexed yet, add it to the index object
            // otherwise increment the instance of that word on the index object
            
            // major todo: Need to move this function to its own lib so it can be run asyncrhonously
            // and be called with the current link depth. Currently trying to recurse this function
            // gets stuck in a loop. Shouldn't be hard to do, but it's 2am and I'm going to sleep
            const allText = parsedHTML('html *').contents().map(function() {
              if (this.type === 'text') {
                parsedHTML(this).text().trim().toLowerCase().split(' ').forEach(word => {
                  if (word.length) {
                    if (newIndex[word]) {
                      newIndex[word]++
                    } else {
                      newWords++
                      newIndex[word] = 1
                    }
                  }
                })
                return parsedHTML(this).text().trim()
              } else { return '' }
            }).get().join(' ')

            // make a set of links to follow
            let linksToFollow = new Set()
            const linkNodes = parsedHTML('html').find('a')
            if (linkNodes.length > 0) {
              linkNodes.each((index, value) => {
                if (!that.props.indexedURLs[parsedHTML(value).attr('href')]) {
                  linksToFollow.add(parsedHTML(value).attr('href'))
                }
              })
            }
            console.log(`Indexed ${linkNodes.length} new pages and found ${newWords} new words`, allText, linksToFollow)
            this.setState({indexResults: {numLinkNodes: linkNodes.length, numNewWords: newWords} })
            that.props.updateIndex(searchTerm, newIndex)
          })
          .catch(err => new Error(err))
      }
    } else if (this.props.activeTab === 'search') {
      // console.log(searchTerm, this.props.indexedWords[searchTerm])
      let numResults = 1
      let resultsObj = []
      Object.keys(this.props.indexedURLs).forEach(url => {
        if (this.props.indexedURLs[url][searchTerm]) {
          numResults++
          resultsObj.push({[url]: this.props.indexedURLs[url][searchTerm]})
          console.log(resultsObj)
        }
      })
      this.setState({ searchResults: resultsObj })
    }
  }

  updateSearchTerm = (el) => {
    this.setState({searchTerm: el.target.value})
  }

  renderIndexOrSearchResults = () => {
    if (this.state.indexResults && !this.state.searchResults) {
      return (
        <div className='index-results'>
          <span>
            Indexed {this.state.indexResults.numLinkNodes} new pages and found {this.state.indexResults.numNewWords} words
          </span>
        </div>
      )
    } else if (this.state.searchResults) {
      return <SearchResults searchResults={this.state.searchResults} />
    }
  }

  render() {
    return (
      <div className="input">
        <input type='text' onChange={this.updateSearchTerm}/>
        <button onClick={(el) => this.handleIndexOrSearch()}>GO!</button>
        {this.renderIndexOrSearchResults()}
      </div>
    )
  }
}

// todo: add prop-types
export default SearchBox;
