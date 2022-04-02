import React from 'react'
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  
  class Avatar extends React.Component {
    state = {
      loading: false,
      imageUrl:""
    };
    
  
    handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
          
        );
        this.props.addClick(info.file.response.data)
      }
      
      //console.log(info.file.response.data)
    };

  
    render() {
      console.log(this.props.img)
      const { loading, imageUrl } = this.state;
      
      const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      );
      let token = {
        token:localStorage.getItem('token')
      }
 
      return (
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          method="post"
          headers={token}
          action="http://127.0.0.1:8888/forum/app/file/uploadimage"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {}
          {this.props.img !== "" ? <img src={this.props.img === "" ? imageUrl : this.imgUrl+this.props.img} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      );
    }
  }

export default Avatar;