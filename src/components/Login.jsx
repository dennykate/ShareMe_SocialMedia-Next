import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    const decoded = jwt_decode(res.credential);
    const { name, sub: googleId, picture: imageUrl } = decoded;
    const user = { name, googleId, imageUrl };

    localStorage.setItem("user", JSON.stringify(user));

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client
      .createIfNotExists(doc)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-start flex-col items-center h-screen">
      <div className="relative h-full w-full">
        <video
          src={shareVideo}
          loop
          muted
          controls={false}
          autoPlay
          type="video/mp4"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
        <div className="p-5">
          <img src={logo} width="130px" alt="logo" />
        </div>
        <GoogleLogin
          onSuccess={(res) => onSuccess(res)}
          onError={() => console.log("Error")}
        />
      </div>
    </div>
  );
};

export default Login;
