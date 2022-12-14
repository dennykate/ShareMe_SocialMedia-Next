import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { image, _id, postedBy, destination, save } }) => {
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const userInfo = fetchUser();

  const alredySaved = !!save?.filter(
    (item) => item?.postedBy?._id === userInfo?.googleId
  ).length;

  const savePin = (id) => {
    if (!alredySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: userInfo?.googleId,
            postedBy: {
              _type: "potedBy",
              _ref: userInfo?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2 mb-4">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto overflow-hidden hover:shadow-lg rounded-lg transition-all duration-200 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="post"
          className="w-full rounded-lg"
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full p-1 pr-2 pb-2 flex flex-col justify-between"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  className="bg-white w-7 h-7 flex items-center justify-center opacity-75 hover:opacity-100 hover:shadow-md
                rounded-full cursor-pointer text-xl text-dark"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alredySaved ? (
                <button
                  type="button"
                  className="px-4 py-1 
             bg-red-500 opacity-70 hover:opacity-100 text-sm text-white font-bold rounded-3xl hover:shadow-lg outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="px-4 py-1 
             bg-red-500 opacity-70 hover:opacity-100 text-sm text-white font-bold rounded-3xl hover:shadow-lg outline-none"
                >
                  Save
                </button>
              )}
            </div>

            <div className="w-full flex justify-between items-center gap-2">
              {destination && (
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={destination}
                  rel="noreferrer"
                  target="_blank"
                  className="bg-white flex items-center
              gap-2 text-black p-1 px-3 rounded-full opacity-75 hover:opacity-100 hover:shadow-md cursor-pointer text-sm"
                >
                  <BsFillArrowUpRightCircleFill fontSize={15} />
                  {destination.slice(8, 18)}...
                </a>
              )}

              {postedBy?._id === userInfo?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="p-2
                bg-white opacity-70 hover:opacity-100 text-dark font-bold rounded-3xl hover:shadow-lg outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-6 h-6 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold text-sm capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
