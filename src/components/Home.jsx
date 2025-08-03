import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import { FaCirclePlus } from "react-icons/fa6";
import Travelstorycard from './Travelstorycard';

function Home() {
  const [isopen, setIsopen] = useState(false);
  const currentUserId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const [stories, setStories] = useState([]);
  const id=localStorage.getItem("userId")
  const [prevstry,setPrevstry] = useState([])

  const [storyinput, setStoryinput] = useState({
    title: "",
    description: "",
    storyDetail:"",
    visitedDate: "",
    visitedLocation: [],
    
    image: null,
    userId: currentUserId
  });

   useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`https://backend-travelstory.onrender.com/api/story/getstory/${id}`);
        setStories(response.data.data);
      } catch (err) {
        console.error("Error fetching stories", err);
      }
    };
    fetchStories();
  }, []);

  const handlechange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setStoryinput({ ...storyinput, image: files[0] }); // file upload
    } else {
      setStoryinput({ ...storyinput, [name]: value });
    }
  };

  const handlestorysubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedImagePath = "";


      if (storyinput.image) {
        const imageFormData = new FormData();
        imageFormData.append("image", storyinput.image);

        const imageResponse = await axios.post("https://backend-travelstory.onrender.com/api/story/imageupload", imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        


        if (imageResponse.data && imageResponse.data.ImageUploaded) {
          uploadedImagePath = imageResponse.data.ImageUploaded;
        } else {
          throw new Error("Image upload failed");
        }

      }

      // Step 2: Submit the story with image path
      const storyData = {
        title: storyinput.title,
        description: storyinput.description,
        storyDetail: storyinput.storyDetail,
        visitedDate: storyinput.visitedDate,
        visitedLocation: storyinput.visitedLocation,
        image: uploadedImagePath,
        userId: storyinput.userId
      };
      // console.log("Final storyData being sent:", storyData);
      const storyResponse = await axios.post(
        "https://backend-travelstory.onrender.com/api/story/create",
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

          },
        }
      );
      // console.log("Story created successfully", storyResponse.data);
      const storyId = storyResponse.data.story._id;
localStorage.setItem("createdStoryId", storyId);


      Swal.fire( {
        icon:"success",
        text:"Story Created Successfully",
        timer:2000 ,
        showConfirmButton: false,
        timerProgressBar: true
      });
      setStories((prev) => [storyResponse.data.story, ...prev]);
      setIsopen(false); // close modal
setStoryinput({
  title: "",
  description: "",
  storyDetail: "",
  visitedDate: "",
  visitedLocation: [],
  image: null,
  userId: currentUserId
});

    } catch (err) {
      console.error("Error in creating story", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      Swal.fire({
        text:"Story Creation failed",
        howConfirmButton: false,
        timerProgressBar: true
      });

    }
  };

  
  
 


  return (
    <div className='relative min-h-screen w-full'>
      <Navbar setStories={setStories} />

      <div className='container mx-auto py-10'>
        <div className='flex gap-8'>
          <div className='flex-1'>
            <div className='grid grid-cols-1 gap-4 m-4'>
              <Travelstorycard  stories={stories} setStories={setStories} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isopen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  max-h-[90vh] overflow-y-auto md:min-h-fit rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] lg:w-[600px] relative">

            {/* Close Button (Top Right) */}
            <button
              onClick={() => setIsopen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <form className='space-y-4 mt-4' onSubmit={handlestorysubmit} encType="multipart/form-data">
              <h4 className='text-2xl font-semibold text-gray-800'>Create New Story</h4>

              <input
                type='text'
                placeholder='Title'
                name='title'
                value={storyinput.title}
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />
              <input
                type='text'
                placeholder='Description'
                name='description'
                value={storyinput.description}
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />
               <input
                type='text'
                placeholder='Share your experience'
                name='storyDetail'
                value={storyinput.storyDetail}
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />
              <input
                type='file'
                accept="image/*"
                name='image'
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />
              <input
                type='date'
                name='visitedDate'
                value={storyinput.visitedDate}
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />
              <input
                type='text'
                placeholder='Visited Location'
                name='visitedLocation'
                value={storyinput.visitedLocation}
                onChange={handlechange}
                className='w-full border border-gray-300 p-3 rounded-lg'
              />

              <button type="submit" className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition">CREATE STORY</button>
              <button type="button" onClick={() => setIsopen(false)} className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition">CANCEL</button>
            </form>
          </div>
        </div>
      )}


      {/* Add Story Button */}
      <div className="bottom-6 right-6 z-40 fixed ">
        <button onClick={() => setIsopen(true)} className="text-cyan-600 text-5xl hover:text-cyan-800">
          <FaCirclePlus />
        </button>
      </div>
    </div>
  );
}

export default Home;
