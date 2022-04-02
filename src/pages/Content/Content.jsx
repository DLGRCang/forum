import React, { Component } from 'react'
import "./Content.css"
import { Pagination , Empty, Button,Modal,message} from 'antd';
import PubSub from 'pubsub-js';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
export default class Content extends Component {
    state = {
        list:[],
        page:1,
        pathname:false,
        total:0,
        key:0,
        loginItem:JSON.parse(localStorage.getItem("loginItem")),
    }

    componentDidMount(){
        
        
        if(this.props.location.pathname === "/index"){
            this.setState({
                pathname:true
            })
            this.indexList(null)
        }else if(this.props.location.pathname === "/my"){
            
            this.menuClick =  PubSub.subscribe('menuClick',(msg,data)=>{
                //console.log(data)
                this.setState({
                    list:data.list,
                    key:data.key
                })
                //this.indexList(data.inputText)
            })
        }

        this.keyup =  PubSub.subscribe('keyup',(msg,data)=>{
            //console.log(data)
            this.indexList(data.inputText)
        })
        
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.keyup)
        PubSub.unsubscribe(this.menuClick)
    }

    indexList=(keyup)=>{
        this.get(`${this.api.listpageApi+"?type=1&keyup="+keyup}`,{
            page:this.state.page
        }).then(res=>{
            //console.log(res)
            if(res.status === 200){
                this.setState({
                    list:res.data.rows,
                    total:res.data.total
                })
            }
        })
    }

    contClick = (id,name,item) =>{
        if(this.state.key === 3){
            this.props.history.push(`/release`,{item})
        }else{
            if(this.clickLogin(this.props)){
                //localStorage.setItem("MenuKey","1")
                this.props.history.push(`/detail`,{id,name:name,key:this.state.key,item})
            }
            
        }
        
    }

    deleteClick = (e,id,index) =>{
        let that = this
        e.stopPropagation()
        const {key} = this.state
        let list = that.state.list
        let text = ""
        if(key === 1){
            text = "确定删除此条内容吗？"
        }
        if(key === 3){
            text = "确定删除此条草稿吗？"
        }
        confirm({
            title: '删除',
            icon: <ExclamationCircleOutlined />,
            content: text,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                
                if(key === 1){
                    that.deletes(`${that.api.removeApi+"?ids="+id}`).then(res=>{
                        //console.log(res)
                        if(res.status === 200){
                            message.success("删除成功")
                            
                            list.splice(index,1)
                            that.setState({
                                list
                            })
                        }
                    })
                }else if(key === 3){
                    that.deletes(`${that.api.removeApi+"?ids="+id}`).then(res=>{
                        //console.log(res)
                        if(res.status === 200){
                            message.success("删除成功")
 
                            list.splice(index,1)
                            that.setState({
                                list
                            })
                        }
                    })
                }
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    cancelCollection = (e,id,index) =>{
        e.stopPropagation()
        let list = this.state.list
        this.post(`${this.api.cancelCollectionApi}`,{
            forumUserId:this.state.loginItem.forumUserId,
            forumReleaseId:id
        }).then(res=>{
            console.log(res)
            if(res.status === 200){
                message.success('取消收藏成功');
                list.splice(index,1)
                            this.setState({
                                list
                            })
            }
        })
    }

    pageOnChange = (e) =>{
        this.setState({
            page:e
        })
        this.indexList()
    }
 
    addCont = () =>{
        this.props.history.push(`/release`)
    }

    render() {
        
        const {list,pathname,total,key} = this.state
        return (
                    <div>
                        <div style={{display: list.length === 0 ? 'none':'block'}}>
                            {
                                list.map((item,index)=>{
                                        return(
                                            
                                            <div key={index} onClick={()=> this.contClick(item.forumReleaseId,item.userName,item)} className="content border">
                                                <div className="cFirst">

                                                    <div className="limg" style={item.releaseCoverPhoto === "" ? {display:'none'}:{}}>
                                                        <img src={item.releaseCoverPhoto === "" ? '':this.imgUrl + item.releaseCoverPhoto} alt="图片失效" />
                                                    </div>
                                                    <div className="lcont" style={item.releaseCoverPhoto === "" ? {paddingLeft:'0'}:{}}>
                                                        <div>
                                                            <p style={{width:pathname ? '100%':'90%'}}>{item.releaseTitle}</p>
                                                            <p style={{display:pathname ? 'none':'block'}}>
                                                                <Button style={{display:key === 1 || key === 3 ? 'block':'none'}} type="link" danger="true" onClick={e => this.deleteClick(e,item.forumReleaseId,index)}>删除</Button>
                                                                <Button style={{display:key === 2 ? 'block':'none'}} type="link" danger="true" onClick={e => this.cancelCollection(e,item.forumReleaseId,index)}>取消收藏</Button>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span>发布人：{item.userName}</span>
                                                            <span>发布时间：{item.gmtCreate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                    
                                                <div className="cLast" style={item.releaseIntroduce === "" ? {display:'none'}:{}}>
                                                    {item.releaseIntroduce}
                                                </div>
                                                <div className="cLast" style={item.type === "2"&&item.typeFeedback !== "" ? {display:'block'}:{display:'none'}}>
                                                    未通过原因：<span style={{color:"red"}}>{item.typeFeedback}</span>
                                                </div>
                                            </div>
                                        )
                                })
                            }
                        </div>
                        <Empty
                            style={{display: list.length === 0 ? 'block':'none'}}
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                            height: 60,
                            }}
                            description={
                            <span>
                                暂无数据
                            </span>
                            }
                        >
                            {/* display:key === 1 ? 'block':'none', */}
                            <Button style={{margin:'0 auto'}} type="primary" onClick={this.addCont}>发布一个</Button>
                        </Empty>
                        <div className="pagination" style={!pathname ? {display:'none'}:{}}>
                            <Pagination total={total} defaultPageSize="20" onChange={this.pageOnChange}/>
                        </div>
                    </div>
                    
                
            
            
        )
    }
}
