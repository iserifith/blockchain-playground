import React from "react";
import dynamic from "next/dynamic";

const Screen = dynamic(() => import("../components/Home"), { ssr: false });

const Index = () => {
  return <Screen />;
};

export default Index;
