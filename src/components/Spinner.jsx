import React from "react";
import { FidgetSpinner } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <FidgetSpinner
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
        ballColors={["#ff0000", "#00ff00", "#0000ff"]}
        backgroundColor="#F4442E"
      />
      <p className="mt-5 text-lg">{message}</p>
    </div>
  );
};

export default Spinner;
