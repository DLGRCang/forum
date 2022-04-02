import React, { Component } from 'react'
import Header from '../Header/Header'
import List from '../List/List'
import {Route} from "react-router-dom"
import "./Index.css"

export default class Index extends Component {
    
    render() {
        //console.log(this.props)
        return (
            <div className="index">
                <Route component={Header}/>
                <Route component={List}/>
            </div>
        )
    }
}
