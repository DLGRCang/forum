import React, { Component } from 'react'
import "./Header.css"
import { Input , message} from 'antd';
import PubSub from 'pubsub-js';
 
export default class Header extends Component {
    state = {
        loginItem:JSON.parse(localStorage.getItem("loginItem")),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    LoginClick = () =>{
        if(this.clickLogin(this.props)){
            localStorage.setItem("MenuKey","4")
            this.props.history.push("/my")
        }
    }

    inputOnKeyUp = (event) =>{
        const {keyCode,target} = event
        if(keyCode !== 13)return
        if(target.value === "") return message.warning("请填写搜索内容"); 
        //this.props.history.push("/index",{inputText:target.value})
        PubSub.publish('keyup',{inputText:target.value})
    }

    render() {
        const {loginItem} = this.state
        //console.log(loginItem)
        return (
            <div className="head">
                <div className="header dp">
                    <div className="hFirst">论坛</div>
                    <Input placeholder="请输入搜索内容" size="large" style={{width:"600px",borderRadius:"10px"}} onKeyUp={this.inputOnKeyUp}/>
                    <div className="hLast dp" onClick={this.LoginClick}>
                        <div>{loginItem === null ? '未登录':loginItem.forumUserName}</div>
                        <div>
                            <img src={loginItem===null ? '':this.imgUrl+loginItem.forumUserAvatar} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}
