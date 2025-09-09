/**
 * Loader component or module.
 */
import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className={"w-full p-5 flex items-center justify-center"}>
      <ClipLoader color="#0680c0" size={32} />
    </div>
  );
};

export default Loader;
