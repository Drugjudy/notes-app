import React, {useState, useEffect} from 'react'
import axios from 'axios'
import 'quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import {useHistory} from 'react-router-dom'

var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };
  
var formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
  ];


export default function EditNote({match}) {
    const [note, setNote] = useState({
        title: '',
        content: '',
        date: '',
        id: ''
    })
    const history = useHistory()

    useEffect(() =>{
        const getNote = async () =>{
            const token = localStorage.getItem('tokenStore')
            if(match.params.id){
                const res = await axios.get(`/api/notes/${match.params.id}`, {
                    headers: {Authorization: token}
                })
                setNote({
                    title: res.data.title,
                    content: res.data.content,
                    date: new Date(res.data.date).toLocaleDateString(),
                    id: res.data._id
                })
            }
        }
        getNote()
    },[match.params.id])

    const onChangeInput = e => {
        const {name, value} = e.target;
        setNote({...note, [name]:value})
    }


    const editNote = async e => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('tokenStore')
            if(token){
                const {title, content, date, id} = note;
                const newNote = {
                    title, content, date
                }

                await axios.put(`/api/notes/${id}`, newNote, {
                    headers: {Authorization: token}
                })
                
                return history.push('/')
            }
        } catch (err) {
            window.location.href = "/";
        }
    }

    return (
        <div className="create-note">
            <h2>Edit Note</h2>
            <form onSubmit={editNote} autoComplete="off">
                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" value={note.title} id="title"
                    name="title" required onChange={onChangeInput} />
                </div>
{/* 
                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" value={note.content} id="content"
                    name="content" required rows="10" onChange={onChangeInput} />
                </div> */}

                <div className="row">
  <label htmlFor="content">Content</label>
  {/* Replace the textarea with ReactQuill */}
  <ReactQuill
    theme="snow"
    modules={modules}
    formats={formats}
    placeholder="write your content ...."
    value={note.content}
    onChange={(value) => {
      // Update the note's content in the state
      setNote((prevNote) => ({
        ...prevNote,
        content: value,
      }));
    }}
    style={{ height: "220px" }}
  />
</div>

                <label htmlFor="date">Date: {note.date} </label>
                <div className="row">
                    <input type="date" id="date"
                    name="date" onChange={onChangeInput} />
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    )
}
