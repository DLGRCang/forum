import "braft-editor/dist/index.css"
import React, { Component } from 'react'
import { Input , Button , message} from "antd"
import "./Release.css"
import ImgUpload from "../../components/ImgUpload/ImgUpload"
import BraftEditor from "braft-editor"


class Release extends Component {
    state = {
        editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
        outputHTML:"",
        title:"",
        fileImage:"",
        text:"",
        loginItem:JSON.parse(localStorage.getItem('loginItem'))
      }
    
      componentDidMount () {
        this.isLivinig = true
        // 3秒后更改编辑器内容
        //setTimeout(this.setEditorContentAsync, 3000)
        console.log(this.props.location.state)
        let list = this.props.location.state
        if(list !== undefined){
          this.setState({
            editorState:BraftEditor.createEditorState(list.item.releaseContent),
            title:list.item.releaseTitle,
            fileImage:list.item.releaseCoverPhoto,
            text:list.item.releaseIntroduce,
          })
        }
        
      }
    
      componentWillUnmount () {
        this.isLivinig = false
      }
    
      handleChange = (editorState) => {
        //console.log(editorState)
        this.setState({
          editorState: editorState,
          outputHTML: editorState.toHTML()
        })
      }
    
      setEditorContentAsync = () => {
        this.isLivinig && this.setState({
          editorState: BraftEditor.createEditorState('')
        })
      }

      titleChange = (e) =>{
        //console.log(e.target.value)
        this.setState({
          title:e.target.value
        })
      }

      addClick = (fileImage) =>{
        this.setState({
          fileImage
        })
      }

      textChange = (e) =>{
        //console.log(e.target.value)
        this.setState({
          text:e.target.value
        })
      }

      submit = () =>{
        //console.log(this.state)
        const {title,outputHTML,fileImage,text,loginItem} = this.state
        //console.log(outputHTML)
        if(title === "") return message.warning('请填写标题');
        if(outputHTML === ""||outputHTML === "<p></p>") return message.warning('请填写内容');
        this.post(`${this.api.forumReleaseApi}`,{
          releaseTitle:title,
          releaseContent:outputHTML,
          releaseCoverPhoto:fileImage,
          releaseIntroduce:text,
          forumUserId:loginItem.forumUserId
        }).then(res=>{
          //console.log(res)
          if(res.status === 200){
            message.success('提交成功');
          }else{
            message.error('提交失败');
          }
        })
      }

      draft = () =>{
        
        const {title,outputHTML,fileImage,text,loginItem} = this.state
        console.log(outputHTML)
        if(title === "") return message.warning('请填写标题');
        if(outputHTML === ""||outputHTML === "<p></p>") return message.warning('请填写内容');
        this.post(`${this.api.forumReleaseDraftApi}`,{
          releaseTitle:title,
          releaseContent:outputHTML,
          releaseCoverPhoto:fileImage,
          releaseIntroduce:text,
          forumUserId:loginItem.forumUserId
        }).then(res=>{
          //console.log(res)
          if(res.status === 200){
            message.success('提交成功');
          }else{
            message.error('提交失败');
          }
        })
      }

    render() {
        const { TextArea } = Input;
        const { editorState ,title , text,fileImage} = this.state
        return (
            <div className="release">
                <div className="title">
                    <p></p>
                    <p>标题</p>
                </div>
                <Input placeholder="请输入标题" className="rInpput" value={title}  onChange={this.titleChange}/>
                <div className="title">
                    <p></p>
                    <p>内容</p>
                </div>
                <div>
                    <div className="editor-wrapper">
                    <BraftEditor
                        value={editorState}
                        onChange={this.handleChange}
                    />
                    </div>
                    {/* <div dangerouslySetInnerHTML = {{ __html: this.state.outputHTML }} />  */}
                </div>
                <div className="title">
                    <p></p>
                    <p>封面图片</p>
                </div>
                <ImgUpload img={fileImage}  addClick={this.addClick}/>
                <div className="title">
                    <p></p>
                    <p>简介</p>
                </div>
                <TextArea rows={5} value={text} placeholder="请输入简介" onChange={this.textChange}/>
                <div className="btn">
                <Button type="primary" onClick={this.submit}>提 交</Button>
                <Button type="primary" onClick={this.draft}>添加草稿</Button>
                </div>
                
            </div>
        );
    }
}

export default Release;

