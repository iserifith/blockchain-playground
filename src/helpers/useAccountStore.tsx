import React, {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useReducer,
  PropsWithChildren,
  useRef,
} from "react";
import { ethers, Signer } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import {
  CHAIN_ID,
  INFURA_ENDPOINT,
  INFURA_ID,
  NETWORK_NAME,
} from "./constants";

enum ACCOUNT_ACTIONS {
  SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS",
  SET_WALLET_BALANCE = "SET_WALLET_BALANCE",
  SET_CONNECTED = "SET_CONNECTED",
  SET_NETWORK = "SET_NETWORK",
  SET_IS_CORRECT_NETWORK = "SET_IS_CORRECT_NETWORK",
}

type setWalletAddressAction = {
  type: typeof ACCOUNT_ACTIONS.SET_WALLET_ADDRESS;
  payload: string;
};

type setWalletBalanceAction = {
  type: typeof ACCOUNT_ACTIONS.SET_WALLET_BALANCE;
  payload: string;
};

type setConnectedAction = {
  type: typeof ACCOUNT_ACTIONS.SET_CONNECTED;
  payload: boolean;
};

type setNetworkAction = {
  type: typeof ACCOUNT_ACTIONS.SET_NETWORK;
  payload: string;
};

type setIsCorrectNetworkAction = {
  type: typeof ACCOUNT_ACTIONS.SET_IS_CORRECT_NETWORK;
  payload: boolean;
};

type AccountActions =
  | setWalletAddressAction
  | setWalletBalanceAction
  | setConnectedAction
  | setNetworkAction
  | setIsCorrectNetworkAction;

type AccountState = {
  walletAddress: string;
  walletBalance: string;
  connected: boolean;
  network: string;
  isCorrectNetwork: boolean;
};

type AccountReducer = Reducer<AccountState, AccountActions>;

const reducer: AccountReducer = (state, action) => {
  switch (action.type) {
    case ACCOUNT_ACTIONS.SET_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: action.payload,
      };
    case ACCOUNT_ACTIONS.SET_WALLET_BALANCE:
      return {
        ...state,
        walletBalance: action.payload,
      };
    case ACCOUNT_ACTIONS.SET_CONNECTED:
      return {
        ...state,
        connected: action.payload,
      };
    case ACCOUNT_ACTIONS.SET_NETWORK:
      return {
        ...state,
        network: action.payload,
      };
    case ACCOUNT_ACTIONS.SET_IS_CORRECT_NETWORK:
      return {
        ...state,
        isCorrectNetwork: action.payload,
      };
    default:
      return state;
  }
};

export interface AccountStateContextInterface {
  accountState: AccountState;
  dispatch: (action: AccountActions) => void;
  getJsonProvider: () => ethers.providers.JsonRpcProvider;
  getWeb3Provider: () => Web3Provider;
  getContract: (signer: Signer, address: string, abi: any) => any;
  connectWallet: () => Promise<void>;
}

const AccountStateContext = createContext<AccountStateContextInterface | null>(
  null
);

const web3modal = new Web3Modal({
  network: NETWORK_NAME,
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID,
        rpc: {
          [CHAIN_ID]: INFURA_ENDPOINT,
        },
      },
    },
  },
});

export const AccountStateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const providerRef = useRef<any | null>(null);

  const [accountState, dispatch] = useReducer(reducer, {
    walletAddress: "",
    walletBalance: "",
    connected: false,
    network: "",
    isCorrectNetwork: false,
  });

  const getJsonProvider = () => {
    return new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_ID);
  };

  const connectWallet = async () => {
    try {
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(addr);

      if (network.chainId === CHAIN_ID) {
        dispatch({
          type: ACCOUNT_ACTIONS.SET_IS_CORRECT_NETWORK,
          payload: true,
        });

        dispatch({
          type: ACCOUNT_ACTIONS.SET_CONNECTED,
          payload: true,
        });

        dispatch({
          type: ACCOUNT_ACTIONS.SET_NETWORK,
          payload: network.name,
        });

        dispatch({
          type: ACCOUNT_ACTIONS.SET_WALLET_BALANCE,
          payload: ethers.utils.formatEther(balance),
        });
      } else {
        throw new Error("Wrong Network.");
      }

      dispatch({
        type: ACCOUNT_ACTIONS.SET_WALLET_ADDRESS,
        payload: addr,
      });

      providerRef.current = provider;
    } catch (error) {
      console.log(error);
    }
  };

  const getWeb3Provider = () => {
    return providerRef?.current as Web3Provider;
  };

  const getContract = (signer: Signer, address: string, abi: any) => {
    const contract = new ethers.Contract(address, abi, signer);
    return contract;
  };

  return (
    <AccountStateContext.Provider
      value={{
        accountState,
        dispatch,
        getJsonProvider,
        getWeb3Provider,
        getContract,
        connectWallet,
      }}
    >
      {children}
    </AccountStateContext.Provider>
  );
};

export const useAccountStore = () => useContext(AccountStateContext);
export type AccountStoreDispatch = Dispatch<AccountActions>;
