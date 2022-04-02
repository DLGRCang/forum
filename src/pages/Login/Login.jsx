import React, { Component } from 'react'
import "./Login.css"
import { Input , Form, Button, message} from 'antd';
import {MehTwoTone,BugTwoTone} from '@ant-design/icons';
import md5 from 'js-md5';

export default class Login extends Component {
    
       
    onFinish = (values) => {
        
        const key = 'updatable';
        if(values.username === undefined) return message.warning('请输入账号');
        if(values.password === undefined) return message.warning('请输入密码');

        let password = md5(md5(md5(values.password)))
        message.loading({ content: '登录中请稍后...', key });
        this.post(`${this.api.login}`,{username:values.username,password:password}).then(res=>{
            if(res.status === 200){
                localStorage.setItem('token',res.data.data)
                
                    this.post(`${this.api.fromUserListApi+'?token='+res.data.data}`).then(resa=>{
                        //console.log(resa)
                        if(resa.status === 200){
                            localStorage.setItem('loginItem',JSON.stringify(resa.data))
                            setTimeout(() => {
                                message.success({ content: '登录成功!', key, duration: 1 });
                                this.props.history.goBack()
                            }, 1000);
                        }
                    })
                    
                
                
            }
            //console.log(res.data.data)
        })
        
        
    }

      

    render() {
        
        return (
            <div className="Login">
                <div className="login_box">
                    <div className="login_box_top">
                        <p>FORUM</p>
                        <p>成迈信息有限公司</p>
                    </div>
                    <div className="login_box_bot">
                        
                        <Form
                            name="form"
                            //initialValues={{ remember: false }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinish}
                            autoComplete="off"
                            >
                            <Form.Item
                            name="username"
                            >
                                <Input size="large" className="bot_input" placeholder="请输入账号" prefix={<MehTwoTone />} />
                            </Form.Item>

                            <Form.Item
                            name="password"
                            >
                                <Input.Password size="large" className="bot_input" placeholder="请输入账号" prefix={<BugTwoTone />} />
                            </Form.Item>

                            {/* <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>记住我</Checkbox>
                            </Form.Item> */}

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                            </Form>
                    </div>
                </div>
            </div>
        )
    }
}
