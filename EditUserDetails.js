import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { FaCameraRotate } from "react-icons/fa6";
import uploadFile from "../helper/uploadFile";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/userSlice";
import axios from "axios";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const uploadPhotoRef = useRef();

  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((pre) => {
      return {
        ...pre,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BaseURL}/update-user`;
    try {
      const cleanData = {
        name: data.name,
        profile_pic: data.profile_pic,
      };

      const res = await axios.post(URL, cleanData, { withCredentials: true });

      if (res.data.success) {
        toast.success(res?.data?.message);
        dispatch(setUser(res?.data?.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    setData((pre) => {
      return {
        ...pre,
        ...user,
      };
    });
  }, [user]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-slate-50 p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold my-2 w-full text-center">
          Profile Details
        </h2>
        <p className="text-sm font-semibold">Edit user details</p>
        <form className="grid gap-3 my-3" onSubmit={handleSubmit}>
          <div className="flex justify-center items-center relative">
            <button
              onClick={handleOpenUploadPhoto}
              className="border shadow-md rounded-full p-1 cursor-pointer"
            >
              <span>
                <Avatar
                  width={80}
                  height={80}
                  imageUrl={data?.profile_pic}
                  name={data?.name}
                />
              </span>
            </button>
            <input
              type="file"
              className="hidden"
              onChange={handleUploadPhoto}
              ref={uploadPhotoRef}
            />
            <span className="absolute bottom-0 right-32 border p-1 rounded-full flex items-center justify-center shadow-md bg-white z-10">
              <FaCameraRotate size={20} />
            </span>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-5">
            <label htmlFor="name" className="font-semibold tracking-wide">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={data?.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-b-2 border-slate-700 bg-transparent rounded-md"
            />
          </div>
          <div className="flex gap-2 w-fit ml-auto mt-4">
            <button
              onClick={onClose}
              className="bg-red-400 text-white px-4 py-1 hover:text-red-400 hover:bg-white border hover:border-red-400 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-1 hover:text-primary hover:bg-white border hover:border-primary rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
