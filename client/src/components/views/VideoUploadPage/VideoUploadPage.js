import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
]

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props) {
  const user = useSelector(state => state.user);
  const [VideoTitle, setVideoTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Private, setPrivate] = useState(0)
  const [Category, setCategory] = useState("Film & Animation")
  const [FilePath, setFilePath] = useState("")
  const [Duration, setDuration] = useState("")
  const [ThumnailPath, setThumnailPath] = useState("")

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }

  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    axios.post('/api/videos/uploadfiles', formData, config)
    .then(response => {
      if (response.data.success) {

        let variable = {
          url: response.data.url,
          fileName: response.data.fileName
        }

        setFilePath(response.data.url)
        
        axios.post('/api/videos/thumbnail', variable)
        .then(response => {
          if (response.data.success) {
            setDuration(response.data.fileDuration)
            setThumnailPath(response.data.url)
          } else {
            alert('썸네일 생성에 실패 했습니다.')
          }
        })
      } else {
        alert('비디오 업로드를 실패하였습니다.')
      }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumnailPath,
    }

    axios.post('/api/videos/uploadVideo', variables)
    .then(response => {
      if (response.data.success) {
        message.success('성공적으로 업로드를 했습니다.')

        setTimeout(() => {
          props.history.push('/')
        }, 3000)
      } else {
        alert('비디오 업로드에 실패 하였습니다.')
      }
    })
  }

    return (
        <div style={{ maxWidth: '700px', margin:'2rem auto' }}>
          <div style={{ textAlign: 'center', marginBottom:'2rem' }}>
            <Title leve={2}>Upload Video</Title>
          </div>

          <Form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent:'space-between' }}>
                {/* Drop zone */}
                <Dropzone
                  onDrop={onDrop}
                  multiple={false}
                  maxSize={1000000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div style={{ width: '300px', height: '240px', border:'1px solid lightgray',  display: 'flex',
                    alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Icon type="plus" style={{ fontSize: '3rem'}} />
                    </div>
                  )}

                </Dropzone>
                {/* Thumnail image */}
                { ThumnailPath && 
                  <div>
                    <img src={`http://localhost:5000/${ThumnailPath}`} alt="thumnail" />
                  </div>
                }
            </div>
            <br />
            <br />
            <label>Title</label>
            <Input 
              onChange={onTitleChange}
              value={VideoTitle}
            />
            <br />
            <br />
            <label>Description</label>
            <TextArea 
              onChange={onDescriptionChange}
              value={Description}
            />
            <br />
            <br />

            <select onChange={onPrivateChange}>
              {PrivateOptions.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
              ))}
            </select>
            <br />
            <br />

            <select onChange={onCategoryChange}>
              {CategoryOptions.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
              ))}
            </select>
            <br />
            <br />

            <Button type="primary" size="large" onClick={onSubmit}>
              Submit
            </Button>
          </Form>
        </div>
    )
}

export default VideoUploadPage