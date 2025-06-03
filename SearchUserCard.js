import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
const SearchUserCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-3 p-2 border border-transparent border-b-slate-200 hover:border-b-primary cursor-pointer"
    >
      <div>
        <Avatar
          width={40}
          height={40}
          name={user?.name}
          userId={user?._id}
          imageUrl={user?.profile_pic}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm">{user?.email}</p>
      </div>
    </Link>
  );
};

export default SearchUserCard;
