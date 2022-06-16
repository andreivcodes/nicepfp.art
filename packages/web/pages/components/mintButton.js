import { Button, Box, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { captureFrame } from "./../utils/sketch";
import contractJson from "../abi/Nicepfp.json";
import { ethers } from "ethers";
import { startDrawing } from "../utils/sketch";

import { useAccount, useConnect, useContractWrite, useNetwork } from "wagmi";

export default function MintButton() {
  const { data: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { activeChain, chains, isLoading, pendingChainId, switchNetwork } =
    useNetwork();

  const [path, setPath] = useState();
  const [signature, setSignature] = useState();

  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  const contractMint = useContractWrite(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: contractJson.abi,
    },
    "safeMint",
    {
      args: [account ? account.address : null, path, signature],
      onSuccess() {
        toast({
          title: "Minted",
          description: `Successfuly minted a pfp.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        startDrawing();
      },
      onError() {
        setLoading(false);
        startDrawing();
      },
    }
  );

  useEffect(() => {
    if (activeChain && activeChain.id != 137) {
      console.log(chains);
      if (
        chains.find((chian) => {
          return chian.id === 137;
        })
      ) {
        switchNetwork(137);
        setLoading(false);
      } else {
        toast({
          title: "Wrong network",
          description: `Can not find Polygon in your networks list.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setLoading(true);
      }
    }
  }, [activeChain]);

  useEffect(() => {
    if (path && signature) contractMint.write();
  }, [path, signature]);

  return (
    <Box w="100%">
      {!account ? (
        connectors.map((x) => (
          <Button
            mt="0.5rem"
            colorScheme="purple"
            w="100%"
            onClick={() => connect(x)}
          >
            Connect {x.name}
          </Button>
        ))
      ) : loading === false ? (
        <Button
          colorScheme="purple"
          w="100%"
          onClick={() => {
            if (activeChain && activeChain.id != 137) {
              toast({
                title: "Wrong network",
                description: `Please switch to Polygon.`,
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
              return;
            }

            var file = dataURLtoFile(captureFrame(), "file.png");

            setLoading(true);
            const body = new FormData();
            body.append("file", file);
            fetch("/api/getipfs", {
              method: "POST",
              headers: new Headers({
                Authorization: process.env.NEXT_PUBLIC_AUTH_ROLE,
              }),
              body,
            })
              .then((response) => response.json())
              .then(async (data) => {
                setPath(data.path);
                setSignature(data.signature);
              });
          }}
          fontFamily="Spartan"
          fontSize="sm"
        >
          Mint
        </Button>
      ) : (
        <Button
          colorScheme="purple"
          w="100%"
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
