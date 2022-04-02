import React, { Component } from 'react'
import "./ContentDetail.css"
import { Button , message,Modal} from 'antd'
import 'braft-editor/dist/output.css'
import { StarOutlined,StarFilled,ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;
export default class ContentDetail extends Component {
    state={
        loginItem:JSON.parse(localStorage.getItem("loginItem")),
        list:{}
    }
    componentDidMount(){
        const {id,name,key,item} = this.props.location.state
        if(key === 1){
            this.get(`${this.api.contGetApi+"/"+id}`,{
                forumReleaseId:id
            }).then(res=>{
                //console.log(res)
                if(res.status === 200){
                    let list = res.data
                    list.userName = name
                    this.setState({
                        list:list
                    })
                }
            })
        }else{
            //console.log(item)
            this.setState({
                list:item
            })
        }
        
    }

    typeClick = () =>{
        this.props.history.push(`/release`,{item:this.state.list})
    }

    collection = () =>{
        let list = this.state.list
        list.collectionId = this.state.loginItem.forumUserId 
        //console.log(list)
        this.post(`${this.api.collectionApi}`,list).then(res=>{
            //console.log(res)
            if(res.status === 200){
                message.success('收藏成功');
                list.isDelete = 1
                this.setState({
                    list
                })
            }
        })
    }

    cancelCollection = () =>{
        let list = this.state.list
        //console.log(list)
        this.post(`${this.api.cancelCollectionApi}`,{
            forumUserId:this.state.loginItem.forumUserId,
            forumReleaseId:list.forumReleaseId
        }).then(res=>{
            console.log(res)
            if(res.status === 200){
                message.success('取消收藏成功');
                list.isDelete = 0
                this.setState({
                    list
                })
            }
        })
    }

    deleteClick = () =>{
        let that = this
        confirm({
            title: '删除',
            icon: <ExclamationCircleOutlined />,
            content: "确定删除此条内容吗？",
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                    that.deletes(`${that.api.removeApi+"?ids="+that.state.list.forumReleaseId}`).then(res=>{
                        //console.log(res)
                        if(res.status === 200){
                            message.success("删除成功")
                            setTimeout(()=>{
                                that.props.history.goBack()
                            },500)
                        }
                    })
            },
            onCancel() {
              console.log('Cancel');
              
            },
          });
    }


    render() {
        const {list} = this.state
        const {key} = this.props.location.state
        return (
            <div className="detail">
                <h1 style={{display:list.type === "2" ? 'block':'none',color:'red'}}>未通过审核</h1>
                <div className="wtgyy" style={{display:list.type === "2" ? 'block':'none'}}>
                    <span>未通过原因：</span>
                    <span style={{color:'red'}}>{list.typeFeedback}</span>
                </div>
                <div className="cname">
                    <span>发布人：{list.userName}</span>
                    <span>发布时间：{list.gmtCreate}</span>
                </div>
                <h1>{list.releaseTitle}</h1>
                <div className="cont">
                    <div style={{display:list.releaseCoverPhoto === "" ? "none":"block"}}><img src={this.imgUrl + list.releaseCoverPhoto} alt="" /></div>
                    <div style={{width:list.releaseCoverPhoto === "" ? "100%":"83%"}}>{list.releaseIntroduce === "" ? '暂无简介':list.releaseIntroduce}</div>
                </div>
                <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html: list.releaseContent }} /> 

                <div className="detail_btn">
                    <div style={{display:key === 1 || key === 0 ? "block":"none"}}>
                        <p style={{display:list.isDelete === 0 ? "block":"none"}}><Button type="link" onClick={this.collection}><StarOutlined />收藏</Button></p>
                        <p style={{display:list.isDelete === 1 ? "block":"none"}}><Button type="link" onClick={this.cancelCollection}><StarFilled />取消收藏</Button></p>
                    </div>
                    <div style={{display:key === 2 ? "block":"none"}}>
                        
                        <p><Button type="link" onClick={this.cancelCollection}><StarFilled />取消收藏</Button></p>
                    </div>
                    
                </div>

                <Button type="primary" block style={{display:key !== 2 ? 'block':'none'}} onClick={this.typeClick} danger onClick={e => this.deleteClick()}>删除</Button>
                <div style={{display:list.type === "2" ? 'block':'none',marginTop:'10px'}}>
                    <Button type="dashed" block onClick={this.typeClick}>修改在发布</Button>
                </div>
            </div>
        )
    }
}
