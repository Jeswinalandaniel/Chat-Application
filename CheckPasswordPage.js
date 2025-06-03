import React, { useEffect, useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../Redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BaseURL}/password`;
    try {
      const res = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(res.data.message);
      if (res.data.success) {
        dispatch(setToken(res?.data?.token));
        localStorage.setItem("token", res?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
          {/* <PiUserCircle size={80} /> */}
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="text-lg font-semibold mt-1">
            {location?.state?.name}
          </h2>
        </div>
        <h3>Welcom to Chat app !</h3>
        <form action="" className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary border-2 border-transparent text-lg px-4 py-1 text-white hover:text-primary hover:border-2 hover:border-primary hover:bg-transparent transition duration-300 rounded my-2 tracking-wider">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold transition duration-600"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
