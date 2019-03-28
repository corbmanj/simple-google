import React, { Component } from 'react'
import '../static/HeaderLinks.css'

class HeaderLinks extends Component {
  constructor (props) {
      super(props)
      this.state = {
      }
    }

  render() {
    const indexClass = `header-span ${this.props.activeTab === 'index' ? 'active' : ''}`
    const searchClass = `header-span ${this.props.activeTab === 'search' ? 'active' : ''}`
    return (
        <div>
        <header className="header">
            <span onClick={() => this.props.changeTab('index')} className={indexClass}>Index</span>
            <span onClick={() => this.props.changeTab('search')} className={searchClass}>Search</span>
        </header>
        </div>
    )
  }
}

// todo: add prop-types
export default HeaderLinks;
