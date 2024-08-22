import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation  } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

function DetailChapter() {
    const { storyId, chapterId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (storyId && chapterId) {
            axios.get(`http://localhost:3000/api/chapters/${chapterId}`)
                .then(response => {
                    const { title, content } = response.data;
                    setTitle(title);
                    setContent(content);
                })
                .catch(error => console.error(error));
        }
    }, [storyId, chapterId]);

    const from = new URLSearchParams(location.search).get('from');
    const handleBackClick = () => {
        if (from === 'edit') {
            navigate(`/stories/edit/${storyId}`);
        } else {
            navigate(`/stories/${storyId}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb
                items={[
                    { href: '/stories', label: 'Stories Management' },
                    { href: `/stories/edit/${storyId}`, label: 'Edit Story' },
                    { href: `/stories/${storyId}/chapters/edit/${chapterId}`, label: 'Detail Chapter' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Chapter Details</h1>
            <button
                onClick={handleBackClick}
                className="btn btn-sm bg-gray-100 text-black rounded-3xl"
            >
                Back
            </button>

            <div className="card shadow-xl w-full mt-5">
                <div className="card-body">
                    <form className="space-y-4">
                        <div>
                            <label className="block mb-2">
                                <strong>Title</strong>
                                <input
                                    type="text"
                                    value={title}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block mb-16">
                                <strong>Content</strong>
                                <ReactQuill
                                    value={content}
                                    readOnly
                                    theme="bubble" 
                                    className='h-44'
                                />
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DetailChapter;
