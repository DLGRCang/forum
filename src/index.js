import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom"
import './index.css';
import App from './App';
import {get,post,put,deletes} from "./utils/http"
import api from "./utils/api"

Component.prototype.get = get
Component.prototype.post = post
Component.prototype.put = put
Component.prototype.deletes = deletes
Component.prototype.api = api

Component.prototype.clickLogin = (url) =>{
  //console.log(url)
  if(localStorage.getItem("loginItem") === null){
    url.history.push("/login")
  }else{
    return true;
  }

} 

Component.prototype.imgUrl = "http://127.0.0.1:8888/forum/route/file/download/false/"



ReactDOM.render(

    <BrowserRouter><App /></BrowserRouter>
,
  document.getElementById('root')
);

