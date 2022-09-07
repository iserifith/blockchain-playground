import React from "react";
import dynamic from "next/dynamic";

const Screen = dynamic(() => import("../../components/Chatroom"), {
  ssr: false,
});

const Chatroom = () => <Screen />;

export default Chatroom;
