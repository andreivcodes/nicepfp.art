import { Button, Box, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { captureFrame } from "./../utils/sketch";
import contractJson from "../abi/Nicepfp.json";
import { ethers } from "ethers";
import { startDrawing } from "../utils/sketch";

export default function MintButton() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    await switchNetworkMumbai();
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: "Error",
          description: `Make sure you have Metamask`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await switchNetworkMumbai();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);

      toast({
        title: "Connected",
        description: `Connected as ${accounts[0]}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const switchNetworkMumbai = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7a69",
                chainName: "Localhost node",
                rpcUrls: ["https://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "Matic",
                  symbol: "Matic",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const mint = async () => {
    var file = dataURLtoFile(captureFrame(), "file.png");

    setLoading(true);
    const body = new FormData();
    body.append("file", file);
    fetch("/api/getipfs", {
      method: "POST",
      body,
    })
      .then((response) => response.json())
      .then(async (data) => {
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        var signer = provider.getSigner();
        var contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          contractJson.abi,
          provider
        );

        var tx = await contract
          .connect(signer)
          .safeMint(signer.getAddress(), data.path, data.signature);

        await tx.wait(1);

        toast({
          title: "Minted",
          description: `Successfuly minted a pfp.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        startDrawing();
      });
  };

  return (
    <Box w="100%">
      {currentAccount === "" ? (
        <Button colorScheme="purple" w="100%" onClick={connectWallet}>
          Connect to Wallet
        </Button>
      ) : loading === false ? (
        <Button
          colorScheme="purple"
          w="100%"
          onClick={mint}
          fontFamily="Spartan"
          fontSize="sm"
        >
          Mint
        </Button>
      ) : (
        <Button
          colorScheme="purple"
          w="100%"
          onClick={mint}
          fontFamily="Spartan"
          fontSize="sm"
          disabled
        >
          Working on it...
        </Button>
      )}
    </Box>
  );
}
