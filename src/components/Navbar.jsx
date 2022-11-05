import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="w-full flex justify-start items-center px-2 bg-white border-none outline-none focus-within:shadow-md rounded-md">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full p-2 bg-white outline-none"
          onFocus={() => navigate("/search")}
        />
      </div>

      <div className="flex gap-5 items-center">
        <Link to={`user-profile/${user._id}`}>
          <img
            src={user?.image}
            alt="profile"
            className="w-10 h-9 rounded-full cursor-pointer hidden md:block object-cover"
          />
        </Link>
        <Link
          to="create-pin"
          className="bg-black text-white flex justify-center items-center w-12 h-12 md:w-14 md:h-12 cursor-pointer rounded-lg"
        >
          <IoMdAdd fontSize={25} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
