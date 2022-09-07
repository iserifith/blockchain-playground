import React from "react";
import dynamic from "next/dynamic";

const Screen = dynamic(() => import("../components/Wordle"), { ssr: false });

const Wordle = () => {
  return <Screen />;
};

export default Wordle;
