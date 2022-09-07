import { useAlert } from "../../../helpers/useAlert";
import { Alert } from "./Alert";

export const AlertContainer = () => {
  const { message, status, isVisible } = useAlert();

  return <Alert isOpen={isVisible} message={message || ""} variant={status} />;
};
