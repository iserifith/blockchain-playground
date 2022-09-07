import React, { SyntheticEvent } from "react";
import {
  AccountStateContextInterface,
  useAccountStore,
} from "../../helpers/useAccountStore";
import {
  contractAddr,
  ChatroomEngineAbi,
  ChatroomFactoryAbi,
} from "../../../generated/ChatroomEngine.json";
import Router, { useRouter } from "next/router";
import truncateAddr from "../../helpers/truncateAddr";
import { ethers } from "ethers";
import { format, formatDistanceToNow } from "date-fns";
import Spinner from "../shared/Spinner";
import { Button, useButton } from "../shared/Button";
type Props = {};
const Chatroom = (props: Props) => {
  const router = useRouter();
  const [chatrooms, setChatrooms] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState("");

  const [pName, setPName] = React.useState("");
  const [pAddr, setPAddr] = React.useState(
    "0x143572A92a6bBC8A09fB52e2D96BEaA3D5d615ac"
  );

  const [current, setCurrent] = React.useState<any>({
    address: "",
    isParticipant: false,
    isOwner: false,
    messages: [],
  });

  const createButtonHook = useButton();
  const addPButtonHook = useButton();

  const { getContract, getWeb3Provider, connectWallet, accountState } =
    useAccountStore() as AccountStateContextInterface;

  React.useEffect(() => {
    if (!accountState?.connected) {
      router.push("/");
    } else {
      getChatrooms();
    }
  }, [accountState]);

  const getEngineContract = async (errorHandler?: Function) => {
    try {
      const provider = getWeb3Provider();
      const signer = provider.getSigner();

      const engine = getContract(signer, contractAddr, ChatroomEngineAbi);

      return engine;
    } catch (error) {
      if (errorHandler) errorHandler(error);
      alert(error);
    }
  };

  const getFactoryContract = async (addr: string, errorHandler?: Function) => {
    try {
      const provider = getWeb3Provider();
      const signer = provider.getSigner();
      const factory = getContract(signer, addr, ChatroomFactoryAbi);
      return factory;
    } catch (error) {
      if (errorHandler) errorHandler(error);
      alert(error);
    }
  };

  const getChatrooms = async () => {
    try {
      const e = await getEngineContract();
      const arr = await e.getAllChatrooms();
      setChatrooms(arr);
      e.on("NewChatroom", (_addr: string) => {
        if (chatrooms.findIndex((a) => a === _addr) === -1) {
          setChatrooms((prev) => [...prev, _addr]);
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  const createChatroom = async () => {
    createButtonHook.setIsDisabled(true);
    try {
      const e = await getEngineContract();
      const tx = await e.create({ value: ethers.utils.parseEther("0.0001") });
      await tx.wait(3);
    } catch (error) {
      alert(error);
    }
    createButtonHook.setIsDisabled(false);
  };

  const joinChatroom = async (addr: string) => {
    try {
      const c = await getFactoryContract(addr);
      const isP = await c.checkIsParticipant(accountState.walletAddress);
      if (isP) {
        const messages = await c.getAllMessages();
        const owner = await c.owner();
        setCurrent({
          isParticipant: true,
          isOwner: owner === accountState.walletAddress,
          address: addr,
          messages,
        });
      }
      c.on("NewParticipantAdded", (newParticipant: any) => {
        console.log(newParticipant, "p");
      });

      c.on("NewMessage", (newMessage: any) => {
        if (current.messages.findIndex((a: any) => a === newMessage) === -1) {
          setCurrent((prev: any) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
          }));
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  const sendMessage = async (e: any) => {
    try {
      if (e.key === "Enter" && message.length > 0) {
        const c = await getFactoryContract(current.address);
        const tx = await c.sendMessage(message);
        await tx.wait(3);
      }
    } catch (error) {
      alert(error);
    }
  };

  const addParticipant = async () => {
    addPButtonHook.setIsDisabled(true);
    if (!ethers.utils.isAddress(pAddr) && !pName)
      return alert("Invalid input.");

    try {
      if (!ethers.utils.isAddress(pAddr) && !pName) throw "Invalid Input";
      console.log(current);
      const c = await getFactoryContract(current.address);
      const tx = await c.addParticipant(pAddr, pName);
      await tx.wait(3);
    } catch (error) {
      alert(error);
    }
    addPButtonHook.setIsDisabled(false);
  };

  return (
    <div className="bg-sky-400">
      <div className="w-full bg-sky-300" />
      <div className="container mx-auto">
        <div className="py-6 h-screen">
          <div className="flex rounded shadow-lg h-full">
            <div className="w-1/3 flex flex-col p-4 shadow-lg">
              <div className="bg-sky-400 flex-1 overflow-auto">
                <Button
                  onClick={createChatroom}
                  isDisabled={createButtonHook.isDisabled}
                >
                  <Spinner isShowing={createButtonHook.isDisabled} />
                  Create Chatroom (0.0001 ETH)
                </Button>
                <div className="w-full my-4">
                  {chatrooms.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => joinChatroom(c)}
                      className={`w-full my-2 p-4 hover:bg-sky-300 ${
                        c === current.address ? "bg-sky-500" : "bg-sky-100"
                      } `}
                    >
                      {truncateAddr(c)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-2/3 bg-sky-100 flex flex-col">
              <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                <div className="flex items-center">
                  {current.isOwner && (
                    <>
                      <input
                        className="w-full border rounded px-2 py-2 outline-none"
                        type="text"
                        value={pAddr}
                        onChange={(e) => setPAddr(e.target.value)}
                        placeholder="Address"
                      />
                      <input
                        className="w-full border rounded px-2 py-2 outline-none"
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        placeholder="Name"
                      />
                      <Button
                        onClick={addParticipant}
                        isDisabled={addPButtonHook.isDisabled}
                        className="w-full border rounded px-2 py-2 shadow-xl mx-"
                      >
                        <Spinner isShowing={addPButtonHook.isDisabled} />
                        Add Participant
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div
                className="flex-1 overflow-auto"
                style={{ backgroundColor: "#DAD3CC" }}
              >
                <div className="py-2 px-3">
                  {current.messages.map((m: any, i: number) => (
                    <div
                      key={i}
                      className={`flex mb-2 ${
                        m[0][0] === accountState.walletAddress && "justify-end"
                      }`}
                    >
                      <div className="rounded py-2 px-3 bg-sky-100">
                        <p className="text-sm text-sky-900">
                          {m[0][1]} | {truncateAddr(m[0][0])}
                        </p>
                        <p className="text-sm mt-1">{m[2]}</p>
                        <p className="text-right text-gray-500 text-xs mt-1">
                          {format(
                            ethers.BigNumber.from(m[0][2]).toNumber() * 1000,
                            "dd-MMM-yyyy | hh:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-grey-lighter px-4 py-4 flex items-center">
                <div className="flex-1 mx-4">
                  <input
                    className="w-full border rounded px-2 py-2 outline-none"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={sendMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
