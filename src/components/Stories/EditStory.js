import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import Swal from 'sweetalert2'
import apiClient from '../../config/apiClient';

function EditStory() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState('Draft');
  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/stories/${id}`)
      .then(response => {
        const { title, author, synopsis, category, tags, status, chapter, story_cover } = response.data;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedStory = {
      title,
      author,
      synopsis,
      category,
      tags,
      status,
    };

    const formData = new FormData();
    formData.append('title', updatedStory.title);
    formData.append('author', updatedStory.author);
    formData.append('synopsis', updatedStory.synopsis);
    formData.append('category', updatedStory.category);
    formData.append('tags', tags.join(','));
    formData.append('status', updatedStory.status);

    if (coverImage) {
      formData.append('storyCover', coverImage);
    }
    apiClient.put(`/stories/${id}`, formData)
      .then(() => {
        navigate('/stories');
      })
      .catch(error => console.error(error));
  };

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

  const handleCoverChange = (e) => {
    setCoverImage(e.target.files[0]);
  };


  const handleAddChapter = () => {
    localStorage.setItem('newStoryId', id);
    navigate(`/stories/add-chapter`);
  };


  const handleEditChapter = (chapterId) => {
    navigate(`/stories/${id}/chapters/edit/${chapterId}`);
  };

  const handleDeleteChapter = (chapterId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient.delete(`/chapters/${chapterId}`)
          .then(() => {
            setChapters(chapters.filter(chapter => chapter.id !== chapterId));
            Swal.fire(
              'Deleted!',
              'Your chapter has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error(error);
            Swal.fire(
              'Error!',
              'There was an error deleting the chapter.',
              'error'
            );
          });
      }
    });
  };
  const handleDetailChapter = (chapterId) => {
    navigate(`/stories/${id}/chapters/${chapterId}?from=edit`);
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel editing the story without saving the data?",
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
          { href: `/stories/edit/${id}`, label: 'Edit Story' }
        ]}
      />
      <h1 className="text-2xl font-bold mb-4">Edit Story</h1>
      <div className="card shadow-xl w-full mt-5">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Writer Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Synopsis</label>
              <textarea
                rows="5"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
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
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  type="file"
                  onChange={handleCoverChange}
                  className="file-input file-input-bordered w-full"
                  aria-label="Upload story cover"
                />
                {coverImage && (
    <div className="mt-4">
      <img src={coverImage} alt="Story Cover" className="w-40 h-auto" />
    </div>
  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>


            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="btn bg-orange-500 text-white rounded-3xl"
                onClick={handleAddChapter}
              >
                Add New Chapter
              </button>
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
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-dark "
                            onClick={() => handleDetailChapter(chapter.id)}
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm bg-orange-500 text-white"
                            onClick={() => handleEditChapter(chapter.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-error text-white"
                            onClick={() => handleDeleteChapter(chapter.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStory;
