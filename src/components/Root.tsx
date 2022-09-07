import React from "react";
import { AccountStateProvider } from "../helpers/useAccountStore";

const Root: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <AccountStateProvider>{children}</AccountStateProvider>;
};

export default Root;
