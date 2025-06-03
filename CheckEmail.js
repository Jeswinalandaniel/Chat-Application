import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CheckEmail = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

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
    const URL = `${process.env.REACT_APP_BaseURL}/email`;
    try {
      const res = await axios.post(URL, data);
      toast.success(res.data.message);
      if (res.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: res?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error : ", error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <PiUserCircle size={80} />
        </div>
        <h3>Welcom to Chat app !</h3>
        <form action="" className="grid gap-4 mt-3" onSubmit={handleSubmit}>
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

          <button className="bg-primary border-2 border-transparent text-lg px-4 py-1 text-white hover:text-primary hover:border-2 hover:border-primary hover:bg-transparent transition duration-300 rounded my-2 tracking-wider">
            Let's Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?
          <Link
            to={"/register"}
            className="hover:text-primary font-semibold transition duration-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
