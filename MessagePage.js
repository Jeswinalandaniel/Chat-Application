import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../helper/uploadFile";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import moment from "moment";
const MessagePage = () => {
  const [isClicked, setIsClicked] = useState(false);

  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const user = useSelector((state) => state?.user);

  const [dataUser, setdataUser] = useState({
    name: "",
    email: "",
    online: false,
    profile_pic: "",
    _id: "",
  });

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef();

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    if (uploadPhoto) {
      setLoading(false);
      setIsClicked(false);
      setMessage((pre) => {
        return {
          ...pre,
          imageUrl: uploadPhoto?.url,
        };
      });
    }
  };

  const handleClearUploadImage = () => {
    setMessage((pre) => {
      return {
        ...pre,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    if (uploadVideo) {
      setLoading(false);
      setIsClicked(false);
      setMessage((pre) => {
        return {
          ...pre,
          videoUrl: uploadVideo?.url,
        };
      });
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((pre) => {
      return {
        ...pre,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((pre) => {
      return {
        ...pre,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params?.userId,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          text: message?.text,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        setdataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("messages : ", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="
    bg-no-repeat bg-cover
    "
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden ">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={45}
              height={45}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser.name}
            </h3>
            <p className="-my-1.5 text-sm">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/* all message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage &&
            allMessage.map((msg, index) => {
              return (
                <div
                  className={`p-0.5 rounded-2xl w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    user._id === msg.msgByUserId
                      ? "ml-auto bg-green-100/90"
                      : "bg-white/90"
                  }`}
                >
                  <div className="w-full">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className="w-full h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p className="mr-8 px-2">{msg?.text}</p>
                  <p className="text-xs ml-auto w-fit px-2">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
          {message.imageUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center rounded">
              <button
                onClick={handleClearUploadImage}
                className="w-fit m-2 top-0 right-0 hover:text-gray-50"
              >
                <IoClose size={30} />
              </button>
              <div className="bg-gray-50 p-2">
                <img
                  src={message?.imageUrl}
                  alt="uploadImage"
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                />
              </div>
            </div>
          )}
          {message.videoUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-50 flex justify-center items-center rounded">
              <button
                onClick={handleClearUploadVideo}
                className="w-fit m-2 absolute top-0 right-0 hover:text-gray-50"
              >
                <IoClose size={30} />
              </button>
              <div className="bg-gray-50 p-2">
                <video
                  src={message?.videoUrl}
                  className="aspect-square  w-full h-full max-w-sm m-2 object-scale-down"
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )}
          {loading && (
            <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
              <Loading />
            </div>
          )}
        </div>
      </section>
      {/* // send message */}
      <section className="h-16 bg-white flex items-center ">
        <div className="relative">
          <button
            onClick={handleClick}
            className="flex justify-center items-center w-10 h-10 rounded-full hover:text-white hover:bg-primary hover:cursor-pointer transition-all duration-200 ease-in-out ml-2"
          >
            <FaPlus size={18} />
          </button>
          <div className="absolute bottom-16 left-2 flex flex-col gap-2">
            <label
              htmlFor="uploadImage"
              className={`flex justify-center items-center border-2 border-primary w-[40px] h-[40px] rounded-full cursor-pointer shadow-lg bg-white transition-all duration-300 ${
                isClicked
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 translate-y-4 delay-0"
              }`}
            >
              <FaImage size={18} className="text-primary" />
            </label>

            <label
              htmlFor="uploadVideo"
              className={`flex justify-center items-center border-2 border-primary w-[40px] h-[40px] rounded-full cursor-pointer shadow-lg bg-white transition-all duration-300 ${
                isClicked
                  ? "opacity-100 translate-y-0 delay-150"
                  : "opacity-0 translate-y-4 delay-0"
              }`}
            >
              <FaVideo size={18} className="text-primary" />
            </label>
            <input
              type="file"
              id="uploadImage"
              onChange={handleUploadImage}
              className="hidden"
            />
            <input
              type="file"
              id="uploadVideo"
              onChange={handleUploadVideo}
              className="hidden"
            />
          </div>
        </div>
        {/* input box */}
        <form className="w-full h-full flex gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message... "
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-seconday">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
