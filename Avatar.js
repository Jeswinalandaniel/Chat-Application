import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  // const bgColor = [
  //   "bg-slate-200",
  //   "bg-teal-200",
  //   "bg-red-200",
  //   "bg-green-200",
  //   "bg-cyan-200",
  //   "bg-purple-200",
  // ];

  // const randomNumber = Math.floor(Math.random() * 6);

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      style={{ width: width + "px", height: height + "px" }}
      className={`text-slate-800 rounded-full font-bold relative`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full w-full h-full object-fill"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center border text-lg bg-slate-200`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}
      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-1 -right-0 z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
