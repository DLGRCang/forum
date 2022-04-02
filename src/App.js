import React, { Component } from 'react'
import "./App.css"
import Index from './pages/Index/Index'
import {Route,Switch,Redirect} from "react-router-dom"
import Login from './pages/Login/Login'
import My from './pages/My/My'
import ContentDetail from './pages/Content/ContentDetail/ContentDetail'
import Release from './pages/Release/Release'


export default class App extends Component {
  render() {

    return (
      
        <div className="App back">

              <Switch>
                <Route path="/index" component={Index}/>
                <Route path="/login" component={Login}/>
                <Route path="/my" component={My}/>
                <Route path="/detail" component={ContentDetail}/>
                <Route path="/release" component={Release}/>
                <Redirect to="/index"/>
              </Switch>

        </div>
      
    )
  }
}

