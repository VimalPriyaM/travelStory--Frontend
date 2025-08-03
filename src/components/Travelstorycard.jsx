import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { IoHeartSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineUpdate } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Travelstorycard({ stories, setStories }) {

  const [error, setError] = useState("");
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  const [expandedStory, setExpandedStory] = useState(null);
  const [editStoryInput, setEditStoryInput] = useState(null);



  const toggleFavourite = async (storyId, currentFavStatus) => {


    try {
      const res = await axios.put(
        `https://backend-travelstory.onrender.com/api/story/editfavorite/${storyId}`,
        { isfavourite: !currentFavStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStories(prevStories =>
        prevStories.map(story =>
          story._id === storyId ? { ...story, isfavourite: res.data.isfavourite } : story
        )
      );

    } catch (err) {
      console.error("Error updating favourite:", err);
    }
  };

  const deletestory = async (storyId) => {


    try {
      const response = await fetch(`https://backend-travelstory.onrender.com/api/story/deletestory/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete the story');
      }

      const result = await response.json();
      
      Swal.fire({
        icon:"success",
        text:"Story Deleted Successfully",
        timer:2000,
        showConfirmButton: false,
        timerProgressBar: true
      })
      setStories((prevStories) => prevStories.filter(story => story._id !== storyId));
      setExpandedStory(null);

    } catch (error) {
      console.log('Delete error:', error.message);
    }
    navigate('/home')
  };


  const updateStory = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Sending data", editStoryInput);

      const response = await axios.put(
        `https://backend-travelstory.onrender.com/api/story/editstory/${editStoryInput._id}`,
        {
    title: editStoryInput.title,
    description:editStoryInput.description,
    storyDetail:editStoryInput.storyDetail, 
    visitedDate:editStoryInput.visitedDate,
    visitedLocation:editStoryInput.visitedLocation

  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log("Story updated successfully", response.data);
      Swal.fire({
        icon:"success",
        text:"Story updated successfully",
        timer:2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      setExpandedStory(null); // close modal
    } catch (error) {
      console.error("Failed to update story", error);
      Swal.fire("Failed to Update Story", '', 'error');
    }
  };

  useEffect(() => {
    if (expandedStory) {
      setEditStoryInput({ ...expandedStory });
    }
  }, [expandedStory]);


  return (
    <>
      <div className="p-2 grid grid-cols-1  sm:grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {error && <p className="text-red-500 col-span-full">{error}</p>}

        {stories.length === 0 && !error ? (
          <p className="text-center col-span-full">Loading stories...</p>
        ) : (
          stories.map((story) => (
            <div
              key={story._id}
              onClick={() => setExpandedStory(story)}
              className="bg-white shadow-lg rounded-lg overflow-hidden  hover:shadow-xl border border-primary "
            >
              <div className="relative w-full h-32">
                <img
                  src={`https://backend-travelstory.onrender.com${story.image}`}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(story._id, story.isfavourite);
                  }}
                  className="absolute top-2 right-2 bg-white/30 p-2 rounded-md shadow"
                >
                  <IoHeartSharp className={story.isfavourite ? 'text-red-600' : 'text-white'} />
                </button>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-cyan-700 mb-2">{story.title}</h2>
                <p className="text-gray-600 mb-2">{story.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Visited:</strong> {new Date(story.visitedDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Location:</strong> {story.visitedLocation.join(", ")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
{expandedStory && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2"
    onClick={() => setExpandedStory(null)}
  >
    <div
      className="bg-white md:min-h-fit rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] lg:w-[600px] max-h-[90vh] overflow-y-auto relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top-right buttons */}
      <div className="absolute top-2 right-2 flex   sm:flex-row gap-2 sm:gap-3">
        <button
          className="flex items-center gap-2 px-2  py-2 rounded-md bg-cyan-200 text-primary hover:bg-cyan-600 hover:text-white transition text-sm"
          onClick={updateStory}
        >
          <MdOutlineUpdate className="text-md" />
          <span>UPDATE STORY</span>
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 hover:bg-red-300 transition text-sm"
          onClick={() => deletestory(expandedStory._id)}
        >
          <MdDeleteOutline className="text-red-600 text-md" />
          <span className="text-red-600">DELETE</span>
        </button>

        <button
          onClick={() => setExpandedStory(null)}
          className="text-gray-600 hover:text-black"
        >
          <IoIosClose className="size-6" />
        </button>
      </div>

      {/* Form Fields */}
      <input
        type="text"
        className="text-2xl font-bold text-cyan-700 mb-2 mt-12 w-full"
        value={editStoryInput?.title || ''}
        onChange={(e) => setEditStoryInput({ ...editStoryInput, title: e.target.value })}
      />

      <img
        src={`https://backend-travelstory.onrender.com${expandedStory.image}`}
        alt={expandedStory.title}
        className="w-full h-auto max-h-60 object-cover rounded-lg mb-4"
      />

      {/* Date and Location Inputs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <input
          type="date"
          className="text-sm text-slate-500 border border-gray-300 rounded px-2 py-1 w-full sm:w-auto"
          value={
            editStoryInput?.visitedDate
              ? new Date(editStoryInput.visitedDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => setEditStoryInput({ ...editStoryInput, visitedDate: e.target.value })}
        />

        <div className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 rounded px-2 py-1 w-full sm:w-auto">
          <GrMapLocation />
          <input
            type="text"
            placeholder="Visited Location"
            className="bg-transparent focus:outline-none text-sm w-full"
            value={editStoryInput?.visitedLocation || ''}
            onChange={(e) => setEditStoryInput({ ...editStoryInput, visitedLocation: e.target.value })}
          />
        </div>
      </div>

      <textarea
        className="w-full border border-gray-300 p-2 rounded mb-2 h-40"
        value={editStoryInput?.storyDetail || ''}
        onChange={(e) => setEditStoryInput({ ...editStoryInput, storyDetail: e.target.value })}
      />
    </div>
  </div>
)}

    </>
  );
}

export default Travelstorycard;
