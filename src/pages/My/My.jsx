import React, { Component } from 'react'
import "./My.css"
import Content from '../Content/Content'
import { Menu, Dropdown , Button ,Form, Input , message} from 'antd';
import { UnorderedListOutlined , PlusOutlined} from '@ant-design/icons'
import { Route } from 'react-router-dom';
import md5 from 'js-md5';
import PubSub from 'pubsub-js';

const { SubMenu } = Menu;

export default class My extends Component {
    state={
        loginItem:JSON.parse(localStorage.getItem("loginItem")),
        passUpdateTrue:false,
        page:1,
        MenuKey:localStorage.getItem("MenuKey")
    }

    release = () =>{
        //console.log(this.props)
        this.props.history.push("/release")
    }

    updatePassword = () =>{
        this.setState({
            passUpdateTrue:true
        })
    }
    passUpdateClick = (e) =>{
        let id = e.target.id
        if(id !== "inner") return;

        this.setState({
            passUpdateTrue:false
        })
    }

    onFinish = (values) => {
        
        if(values.newPassword !== values.new2Password){
            message.warning('新密码不一致');
        }else{

            this.put(`${this.api.updataPassApi}`,
            {
                oldPassword:md5(md5(md5(values.oldPassword))),
                newPassword:md5(md5(md5(values.newPassword)))
            }
            ).then(res=>{
                //console.log(res)
                if(res.status === 200){
                    message.success("更改成功")
                    this.SignOut()
                }
            })
        }
    }

    SignOut = () =>{
        localStorage.clear()
        setTimeout(()=>{
            this.props.history.replace(`/index`)
        },500)
        
    }

    homeOut = () =>{
        this.props.history.replace(`/index`)
    }

    handleClick = (e) => {
        localStorage.setItem("MenuKey",e.key)
        if(e.key === "4"||e.key === "5"||e.key === "6"){
           this.key1Relece(e.key) 
        }else if(e.key === "2"){
            this.key2Relece()
        }else if(e.key === "3"){
            this.key3Relece()
        }
    };

    componentDidMount(){
        //console.log(this.state.MenuKey)
        if(this.state.MenuKey === "4"||this.state.MenuKey === "5"||this.state.MenuKey === "6"){
            this.key1Relece(this.state.MenuKey)
        }else if(this.state.MenuKey === "2"){
            this.key2Relece()
        }else if(this.state.MenuKey === "3"){
            this.key3Relece()
        }
        
    }

    key1Relece = (e) =>{
        let type = "1"
        if(e === "4")type = "1"
        if(e === "5")type = "0"
        if(e === "6")type = "2"
        this.get(`${this.api.myListApi}`,{
            forumUserId:this.state.loginItem.forumUserId,
            type:type
        }).then(res=>{
            //console.log(res)
            if(res.status === 200){
                PubSub.publish('menuClick',{list:res.data,key:1})  
            }
        })
    }

    key2Relece = () =>{
        this.get(`${this.api.myCollectionApi}`,{
            forumUserId:this.state.loginItem.forumUserId
        }).then(res=>{
            //console.log(res)
            if(res.status === 200){
                PubSub.publish('menuClick',{list:res.data,key:2})
            }
        })
    }

    key3Relece = () =>{
        this.get(`${this.api.myDraftApi}`,{
            forumUserId:this.state.loginItem.forumUserId
        }).then(res=>{
            //console.log(res)
            if(res.status === 200){
                PubSub.publish('menuClick',{list:res.data,key:3})
            }
        })
    }
    
    
    render() {
        const {loginItem,passUpdateTrue,MenuKey} = this.state
        //console.log(loginItem)
        const menu = (
            <Menu>
              <Menu.Item key="0">
                <Button type="link" onClick={this.homeOut}>首页</Button>
              </Menu.Item>
              <Menu.Item key="1">
                <Button type="link" onClick={this.updatePassword}>更改密码</Button>
              </Menu.Item>
              <Menu.Item key="2">
                <Button type="link" onClick={this.SignOut}>退出登录</Button>
              </Menu.Item>
            </Menu>
          );
        return (
            <div className="my">
                <div className="my_box">
                    <div className="my_box_top">
                        <div className="my_box_top_tx">
                            <img src={this.imgUrl+loginItem.forumUserAvatar} alt="" />
                            <div>
                                <Button type="primary" shape="circle" className="buttonTx" onClick={this.release}><PlusOutlined /></Button>
                                <Menu
                                        onClick={this.handleClick}
                                        style={{ width: "100%"}}
                                        defaultSelectedKeys={[MenuKey]}
                                        defaultOpenKeys={['1']}
                                        mode="inline"
                                    >
                                        <SubMenu key="1" title="我的发布">
                                            <Menu.Item key="4">发布成功</Menu.Item>
                                            <Menu.Item key="5">审核中</Menu.Item>
                                            <Menu.Item key="6">未通过审核</Menu.Item>
                                        </SubMenu>
                                 
                                        <Menu.Item key="2">我的收藏</Menu.Item>
                                        <Menu.Item key="3">草稿</Menu.Item>
                                    </Menu>
                            </div>
                            
                        </div>
                        <div className="my_box_top_box">
                            <div className="my_box_top_box_top dp">
                                <span></span>
                                <span>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <a href="/#" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <UnorderedListOutlined style={{fontSize:"20px"}}/>
                                        </a>
                                    </Dropdown>
                                </span>
                            </div>
                            <div className="my_box_top_box_bot">
                                <div>
                                    <p>{loginItem.forumUserName}</p>
                                    <p>内蒙古成迈信息有限公司</p>
                                </div>
                                <div>
                                    {/* <Button type="link">我的发布</Button>
                                    <Button type="link">我的收藏（20）</Button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my_box_bot">
                        <div className="my_box_bot_list">
                            <Route component={Content}/>
                        </div>
                    </div>
                </div>
                <div className="passUpdate" style={{display:passUpdateTrue ? 'block':'none'}} onClick={this.passUpdateClick}>
                    <div className="passUpdateNei" id="inner">
                        <div className="passUpdateFrom">
                            <Form
                                name="updatePasswordVO"
                                ref={this.fromRef}
                                initialValues={{ remember: true }}
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinish}
                                >
                                <Form.Item
                                    label="旧密码"
                                    name="oldPassword"
                                    rules={[{ required: true, message: '请输入旧密码!' }]}
                                >
                                    <Input placeholder="请输入旧密码"/>
                                </Form.Item>

                                <Form.Item
                                    label="新密码"
                                    name="newPassword"
                                    rules={[{ required: true, message: '请输入新密码!' }]}
                                >
                                    <Input placeholder="请输入新密码"/>
                                </Form.Item>

                                <Form.Item
                                    label="新密码"
                                    name="new2Password"
                                    rules={[{ required: true, message: '请重新输入新密码!' }]}
                                >
                                    <Input placeholder="请重新输入新密码"/>
                                </Form.Item>

                                <Form.Item style={{textAlign:'center'}}>
                                    <Button type="primary" htmlType="submit">
                                            修改
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
