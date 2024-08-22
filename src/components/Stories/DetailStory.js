import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import apiClient from '../../config/apiClient';

function DetailStory() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [coverImage, setCoverImage] = useState(null);
    const [status, setStatus] = useState('Draft');
    const [categories, setCategories] = useState([]);
    const [chapters, setChapters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/stories/${id}`)
            .then(response => {
                const { title, author, synopsis, category, tags, status, story_cover, chapters } = response.data;
                setTitle(title);
                setAuthor(author);
                setSynopsis(synopsis);
                setCategory(category);
                setTags(tags);
                setStatus(status);
                setChapters(chapters || []);
                if (story_cover) {
                    setCoverImage(`http://localhost:3000/uploads/${story_cover}`);
                  }
            })
            .catch(error => console.error(error));

        apiClient.get('/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error(error));
    }, [id]);

    const handleDetailChapter = (chapterId) => {
        navigate(`/stories/${id}/chapters/${chapterId}?from=details`);
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb
                items={[
                    { href: '/stories', label: 'Stories Management' },
                    { href: `/stories/detail/${id}`, label: 'Story Details' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Story Details</h1>
            <div className="card shadow-xl w-full mt-5">
                <div className="card-body">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Writer Name</label>
                                <input
                                    type="text"
                                    value={author}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Synopsis</label>
                            <textarea
                                rows="5"
                                value={synopsis}
                                readOnly
                                className="textarea textarea-bordered w-full bg-gray-100"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <div className="flex flex-wrap items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-100">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-orange-500 px-2 mr-2 rounded-full flex items-center text-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                {coverImage && (
                                    <img
                                        src={coverImage}
                                        alt="Cover"
                                        className="w-full h-64 object-cover rounded"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <input
                                    type="text"
                                    value={status}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Chapters</h2>
                            <table className="table-auto w-full mb-6">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Chapter Title</th>
                                        <th className="px-4 py-2">Last Updated</th>
                                        <th style={{ width: '20%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chapters.map((chapter, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{chapter.title}</td>
                                            <td className="border px-4 py-2">{new Date(chapter.last_updated).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-dark"
                                                        onClick={() => handleDetailChapter(chapter.id)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailStory;
