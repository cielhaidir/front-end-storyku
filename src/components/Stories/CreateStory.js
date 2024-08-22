import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import Swal from 'sweetalert2'
import apiClient from '../../config/apiClient';

function CreateStory() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [synopsis, setsynopsis] = useState([]);
    const [status, setStatus] = useState('Draft');
    const [cover, setCover] = useState(null);
    const [categories, setCategories] = useState(['Fiction', 'Non-Fiction', 'Science', 'Fantasy']);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleTagChange = (e) => {
        setNewTag(e.target.value);
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ';') {
            e.preventDefault();
            addTag();
        }
        if (e.key === 'Backspace' && !newTag) {
            removeTag(tags[tags.length - 1]);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('synopsis', synopsis);
        formData.append('tags', tags.join(','));
        formData.append('status', status);
        if (cover) formData.append('storyCover', cover);

        apiClient.post('/stories', formData)
            .then(response => {
                localStorage.setItem('newStoryId', response.data.id);
                navigate('/stories/add-chapter');
            })
            .catch(error => console.error(error));
    };

    const handleCoverChange = (e) => {
        setCover(e.target.files[0]);
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to cancel adding the story without saving the data?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep editing'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/stories');
            }
        });
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb
                items={[
                    { href: '/stories', label: 'Stories Management' },
                    { href: '/stories/add', label: 'Add New Stories' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Add Stories</h1>
            <div className="card shadow-xl w-full mt-5">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
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
                                <label className="block mb-2">
                                    <strong>Writer Name</strong>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-2">
                                    <strong>Synopsis</strong>
                                    <textarea
                                        rows="5"
                                        className=" textarea textarea-bordered w-full "
                                        onChange={(e) => setsynopsis(e.target.value)}
                                        required
                                    ></textarea>
                                </label>
                            </div>
                            <div>
                                <label className="block mb-2">
                                    <strong>Category</strong>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>

                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <div className="flex flex-wrap items-center border border-gray-300 rounded-md px-2 py-0">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-orange-500 px-2 mr-2 rounded-full flex items-center text-white">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 text-white"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={handleTagChange}
                                        onKeyDown={handleKeyDown}
                                        className="flex-grow input input-unstyled focus:outline-none bg-transparent py-1"
                                        placeholder="Add tags and press 'Enter'"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">
                                    <strong>Cover Image</strong>
                                    <input
                                        type="file"
                                        onChange={handleCoverChange}
                                        className="file-input file-input-bordered w-full pr-12"
                                        aria-label="Upload story cover"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block mb-2">
                                    <strong>Status</strong>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn text-black rounded-3xl"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn bg-orange-500 text-white rounded-3xl">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateStory;
