"use client";
import { CreatorFormPage } from "@/ui/pages";
import TB from "../../assets/images/creator-form/TB.svg";
import ConnectWallet from "../../assets/images/creator-form/connectWallet.svg";
import { isMobile, isTablet } from "react-device-detect";
import ToastMessage from "@/ui/components/common/ToastMessage";
import { ToastContainer, toast } from "react-toastify";
import { TOAST_MESSAGE, truncateAddress } from "@/helpers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { map } from "lodash";
import { IconLogout } from "@tabler/icons-react";
import DetectNetwork from "@/ui/components/common/DetectNetwork";
import 'react-toastify/dist/ReactToastify.css'

export default function CreatorForm() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading: isLoadingConnect } = useConnect();

  const handleConnectWallet = () => {
    if ((isMobile || isTablet) && !window?.ethereum) {
      window.open(
        `https://metamask.app.link/dapp/${window.location.href}`,
        "_blank",
        "rel=noopener noreferrer"
      );
      return;
    }
    if (!window?.ethereum) {
      toast(
        <ToastMessage
          title="Connect Failed"
          status="error"
          className="text-white"
        >
          {TOAST_MESSAGE.wallet_not_found}
        </ToastMessage>
      );
      return;
    }

    map(connectors, (connector) => {
      connect({ connector });
    });
  };
  return (
    <>
      <DetectNetwork />
      <main className="creator-form-page">
        <div className="container">
          <div className="mb-9 flex justify-between	items-center">
            <img className="cursor-pointer" src={TB.src} alt="" />
            {address && activeConnector && isConnected ? (
              <button
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-full text-white"
                onClick={() => disconnect()}
              >
                {truncateAddress(address)} <IconLogout size={14} />
              </button>
            ) : (
              <img
                className="cursor-pointer"
                src={ConnectWallet.src}
                alt=""
                onClick={handleConnectWallet}
              />
            )}
          </div>
          <CreatorFormPage />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          limit={3}
          hideProgressBar
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
          className={"toast-container-custom"}
        />
      </main>
    </>
  );
}
