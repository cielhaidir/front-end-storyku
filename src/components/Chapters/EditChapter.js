import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import ReactQuill from 'react-quill';
import { FaLongArrowAltLeft } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 

function EditChapter() {
    const { storyId, chapterId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/chapters/${chapterId}`)
            .then(response => {
                const { title, content } = response.data;
                setTitle(title);
                setContent(content);
            })
            .catch(error => console.error(error));
    }, [chapterId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:3000/api/chapters/${chapterId}`, {
            title,
            content
        })
            .then(() => {
                navigate(`/stories/edit/${storyId}`);
            })
            .catch(error => console.error(error));
    };

    const handleBackClick = () => {
        navigate(`/stories/edit/${storyId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb
                items={[
                    { href: '/stories', label: 'Stories Management' },
                    { href: `/stories/edit/${storyId}`, label: 'Edit Story' },
                    { href: `/stories/${storyId}/chapters/edit/${chapterId}`, label: 'Edit Chapter' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Edit Chapter</h1>
            <button
                onClick={handleBackClick}
                className="btn btn-sm bg-gray-100 text-black rounded-3xl"
            >
                <FaLongArrowAltLeft /> Back
            </button>

            <div className="card shadow-xl w-full mt-5">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2">
                                <strong>Title</strong>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block mb-16">
                                <strong>Story</strong>
                                <ReactQuill
                                    value={content}
                                    onChange={setContent}
                                    row="50"
                                    className='h-44'
                                    theme="snow"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="btn bg-orange-500 text-white rounded-3xl">
                                Save Chapter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditChapter;
