import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
  userQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = ({ owerId }) => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    console.log(userId);
    let query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text == "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        console.log(data);
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        console.log(data);
        setPins(data);
      });
    }
  }, [userId, text]);

  if (!user) return <Spinner message={"Loading profile..."} />;

  const logOut = () => {
    localStorage.clear();

    googleLogout();
    navigate("/login");
  };

  return (
    <div className="relative pb-2 flex justify-center items-center w-full">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="random-image"
              className="w-full h-[250px] sm:h-370 2xl:h-510 object-cover shadow-lg"
            />
            <img
              src={user?.image}
              alt="profile"
              className="w-20 h-20 rounded-full shadow-2xl -mt-10 object-cover"
            />
            <h1 className="font-bold text-2xl mt-3 text-center">
              {user?.userName}
            </h1>
            {owerId === user._id && (
              <div className="absolute top-1 right-1 p-2 z-1 bg-white rounded-full cursor-pointer opacity-90 hover:opacity-100">
                <AiOutlineLogout color="red" fontSize={21} onClick={logOut} />
              </div>
            )}
          </div>
          <div className="text-center my-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn == "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn == "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {pins.length > 0 ? (
            <div className="p-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center items-center w-full font-bold text-xl mt-5">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
