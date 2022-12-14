import React from "react";
import Masonry from "react-masonry-css";

import Pin from "./Pin";

const breackpoints = {
  default: 4,
  3000: 6,
  2000: 3,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry
      className="flex animate-slide-fwd pb-5"
      breakpointCols={breackpoints}
    >
      {pins?.map((pin) => (
        <Pin pin={pin} key={pin._id} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
