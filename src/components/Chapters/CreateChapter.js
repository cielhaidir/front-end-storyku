import React, { useState } from 'react';
import apiClient from '../../config/apiClient';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import ReactQuill from 'react-quill';
import { FaLongArrowAltLeft } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css';

function AddChapter() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [storyId, setStoryId] = useState(localStorage.getItem('newStoryId'));
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!storyId) {
            console.error("No story ID found");
            return;
        }

        apiClient.post(`/stories/${storyId}/chapters`, {
            title,
            content
        })
            .then(() => {
                localStorage.removeItem('newStoryId');
                navigate('/stories/edit/' + storyId);
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
                    { href: '/stories/add', label: 'Add New Stories' },
                    { href: '/stories/add-chapter', label: 'Add Chapter' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Add Chapter</h1>
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

export default AddChapter;
