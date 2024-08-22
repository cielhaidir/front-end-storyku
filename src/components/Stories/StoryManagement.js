import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GrFilter } from "react-icons/gr";
import { FaSearch, FaEye } from "react-icons/fa";
import { FaPen, FaRegTrashCan } from "react-icons/fa6";;

function StoryManagement() {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:3000/api/stories')
      .then(response => {
        setStories(response.data);
        const uniqueCategories = [...new Set(response.data.map(story => story.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error(error));
  }, []);

  const deleteStory = (id) => {
    axios.delete(`http://localhost:3000/api/stories/${id}`)
      .then(() => {
        setStories(stories.filter(story => story.id !== id));
      })
      .catch(error => console.error(error));
  };

  const applyFilters = () => {
    setFilterCategory(selectedCategory);
    setFilterStatus(selectedStatus);

    document.getElementById('my_modal_1').close();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredStories = stories.filter(story => {
    const matchesSearchTerm = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || story.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? story.category === filterCategory : true;
    const matchesStatus = filterStatus ? story.status === filterStatus : true;

    return matchesSearchTerm && matchesCategory && matchesStatus;
  });

  const currentItems = filteredStories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteStory = (storyId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this story!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/stories/${storyId}`)
          .then(() => {
            axios.get('http://localhost:3000/api/stories')
            .then(response => setStories(response.data));
            Swal.fire(
              'Deleted!',
              'Your story has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error(error);
            Swal.fire(
              'Error!',
              'There was an error deleting the story.',
              'error'
            );
          });
      }
    });
  };

  return (
    <div>

      <div className="grid grid-cols-1 grid-rows-1 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
        </div>

        <div className="card w-full shadow-xl rounded-xl">
          <div className="card-body px-0">
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center mb-4 p-5">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-500" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by Writers/Title"
                    className="input input-md bg-gray-200 pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-col lg:flex-row">
                  <button className="btn bg-white rounded-3xl" onClick={() => document.getElementById('my_modal_1').showModal()}><GrFilter /></button>
                  <div className="divider divider-horizontal"></div>
                  <Link to="/stories/add" className="btn bg-orange-500 rounded-3xl text-white">
                    + Add Story
                  </Link>
                </div>
              </div>

              <table className="table">
                <thead className='font-bold text-black text-base'>
                  <tr className='border-b-1 border-slate-300'>
                    <th className='ps-5'>No</th>
                    <th>Title</th>
                    <th>Writers</th>
                    <th>Category</th>
                    <th>Keyword</th>
                    <th>Status</th>
                    <th className='pe-10'></th>
                  </tr>
                </thead>
                <tbody className='bg-slate-50'>
                  {currentItems.map((story, index) => (
                    <tr key={story.id} className='border-t-1 border-slate-300'>
                      <td className='text-center'>{index + 1}</td>
                      <td>{story.title}</td>
                      <td>{story.author}</td>
                      <td>{story.category}</td>
                      <td>
                        {story.tags.map((tag, i) => (
                          <span className='badge bg-slate-200 p-5' key={i}>
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td>
                        {story.status === 'Draft' ? (
                          <span className='badge bg-yellow-100 text-orange-500 p-5'>
                            {story.status}
                          </span>
                        ) : (
                          <span className='badge bg-green-100 text-green-500 p-5'>
                            {story.status}
                          </span>
                        )}
                      </td>
                      <td className='text-start'>
                        <div className='flex space-x-2'>
                          <Link className='btn btn-sm btn-outline' to={`/stories/${story.id}`}><FaEye /></Link>
                          <Link className='btn btn-sm  btn-outline btn-warning' to={`/stories/edit/${story.id}`}><FaPen /></Link>
                          <button className='btn btn-sm btn-outline btn-error' onClick={() => handleDeleteStory(story.id)}><FaRegTrashCan /></button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4 px-5">
                <div className="text-sm">
                  Menampilkan {indexOfLastItem > filteredStories.length ? filteredStories.length : indexOfLastItem} dari {filteredStories.length} data
                </div>
                <div className="flex space-x-2">
                  {currentPage > 1 && (
                    <button
                      className="btn bg-orange-300"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  )}

                  <button
                    className="btn btn-active bg-orange-500"
                  >
                    {currentPage}
                  </button>

                  {currentPage < totalPages && (
                    <button
                      className="btn bg-orange-300"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Filter</h3>
          <div className="grid grid-cols-1 grid-rows-1 gap-4 mt-5">
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text"><strong>Category</strong></span>
                </div>
                <select
                  className="select select-bordered w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option disabled value="">Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text"><strong>Status</strong></span>
                </div>
                <select
                  className="select select-bordered w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option disabled value="">Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </label>
            </div>
          </div>
          <div className="modal-action flex justify-between">

            <button
              className="btn rounded-3xl btn-outline"
              onClick={() => {
                setSelectedCategory('');
                setSelectedStatus('');
              }}
            >
              Reset
            </button>
            <div>
              <button
                className="btn rounded-3xl btn-outline mr-2"
                onClick={() => document.getElementById('my_modal_1').close()}
              >
                Cancel
              </button>
              <button
                className="btn rounded-3xl bg-orange-500"
                onClick={applyFilters}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default StoryManagement;
