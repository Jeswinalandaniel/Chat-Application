import React, { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helper/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((pre) => {
      return {
        ...pre,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
    setUploadPhoto(null);
    e.preventDefault();
    e.stopPropagation();
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BaseURL}/register`;
    try {
      const res = await axios.post(URL, data);
      toast.success(res.data.message);
      if (res.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error : ", error);
    }
  };
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcom to Chat app !</h3>
        <form action="" className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your Name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password">Password :</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="bg-slate-100 px-2 py-1 focus:outline-primary w-full"
                value={data.password}
                onChange={handleOnChange}
                required
              />
              <button className="text-lg absolute top-1/2 right-2 transform -translate-y-1/2">
                {showPassword ? (
                  <IoEye
                    onClick={togglePasswordVisibility}
                    className="text-primary cursor-pointer"
                  />
                ) : (
                  <IoEyeOff
                    onClick={togglePasswordVisibility}
                    className="text-primary cursor-pointer"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Profile_pic :
              <div className="h-14 bg-slate-200 flex justify-center items-center rounded border hover:border-primar cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name || "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-500"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary border-2 border-transparent text-lg px-4 py-1 text-white hover:text-primary hover:border-2 hover:border-primary hover:bg-transparent transition duration-300 rounded my-2 tracking-wider">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have account ?{" "}
          <Link
            to={"/email"}
            className="hover:text-primary font-semibold transition duration-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
