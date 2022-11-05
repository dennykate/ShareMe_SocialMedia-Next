import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { pinDetailQuery, pinDetailMorePinQuery } from "../utils/data";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    client.fetch(query).then((data) => {
      setPinDetail(data[0]);

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0]);

        client.fetch(query).then((data) => {
          setPins(data);
        });
      }
    });
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setComment("");
          setAddingComment(false);
          setTimeout(() => {
            fetchPinDetails();
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (!pinDetail) return <Spinner message="Loading Detail..." />;

  return (
    <>
      <div className="flex flex-col m-auto bg-white max-w-[1500px] rounded-[32px]">
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt="picture"
            className="rounded-t-3xl rounded-b-lg xl:w-[500px]"
          />
        </div>
        <div className="w-full flex-l sm:p-5 p-1 sm:mt-0 mt-5 xl:min-w-620">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                className="bg-white w-7 h-7 flex items-center justify-center opacity-85 hover:animate-bounce hover:opacity-100 hover:shadow-md
                rounded-full cursor-pointer text-xl text-dark"
                onClick={(e) => e.stopPropagation()}
              >
                <MdDownloadForOffline fontSize={35} />
              </a>
            </div>
            <a
              href={pinDetail?.destination}
              target="_blank"
              rel="noferrer"
              className="text-dark underline hover:no-underline"
            >
              {pinDetail?.destination.slice(8, 18)}...
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-4">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center cursor-pointer"
          >
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={pinDetail?.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold text-sm capitalize">
              {pinDetail?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="text-base mt-5">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div className="mt-5 flex gap-5 bg-white rounded-lg" key={index}>
                <img
                  src={comment?.postedBy?.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.postedBy?.userName}</p>
                  <p className="text-sm">{comment?.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3 items-center">
            <Link
              to={`user-profile/${pinDetail?.postedBy?._id}`}
              className="flex gap-2 items-center justify-center"
            >
              <img
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                src={user?.image}
                alt="user-profile"
              />
            </Link>
            <input
              type="text"
              placeholder="Add a comment"
              className="flex flex-1 bg-white rounded-2xl p-2 px-3 gap-2 border-gray-100 focus:border-gray-300 outline-none border-2 text-black"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 outline-none font-semibold text-base"
              onClick={addComment}
            >
              {addingComment ? "Posting a comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More Like This
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        pins?.length !== 0 && <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
