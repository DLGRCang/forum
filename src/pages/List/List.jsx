import React, { Component } from 'react'
import Content from '../Content/Content'
import {Route} from "react-router-dom"


export default class List extends Component {
    render() {
        //console.log(this)
        return (
            <div style={{padding:'100px 0 50px',width:'100%'}}>
                <Route component={Content}/>
            </div>
        )
    }
}
