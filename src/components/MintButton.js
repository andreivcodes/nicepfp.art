import { Button, Box, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { captureFrame } from './../sketch';
import { create } from 'ipfs-http-client';
import contractJson from './../abi/Nicepfp.json';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x08677Af0A7F54fE2a190bb1F75DE682fe596317e';

export default function MintButton() {
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization:
        'Basic ' +
        process.env.REACT_INFURA_IPFS_PROJECT_ID +
        ':' +
        process.env.REACT_INFURA_IPFS_PROJECT_SECRET,
    },
  });

  const [currentAccount, setCurrentAccount] = useState('');
  const toast = useToast();

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    await switchNetworkMumbai();
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found authorized account:', account);
      setCurrentAccount(account);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get Metamask!');
        return;
      }

      await switchNetworkMumbai();

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);

      toast({
        title: 'Connected',
        description: `Connected as ${accounts[0]}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetworkMumbai = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '31337' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            /*   params: [
              {
                chainId: '0x13881',
                chainName: 'Mumbai',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'Matic',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
              },
            ], */
            params: [
              {
                chainId: '31337',
                chainName: 'Localhost node',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'Matic',
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
    var arr = dataurl.split(','),
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
    var file = dataURLtoFile(captureFrame(), 'file.png');
    const imageIPFS = await client.add(file);
    let jsonObj = {
      name: `nicepfp`,
      description: `A very nice pfp created using nicepfp.art`,
      animation_url: `https://ipfs.io/ipfs/${imageIPFS.path}`,
    };
    const jsonIPFS = await client.add(JSON.stringify(jsonObj));

    var provider = new ethers.providers.Web3Provider(window.ethereum);
    var signer = provider.getSigner();
    var contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractJson.abi,
      signer
    );

    contract
      .safeMint(signer.getAddress(), `https://ipfs.io/ipfs/` + jsonIPFS.path)
      .call();

    console.log(jsonIPFS.path);
  };

  return (
    <Box w="100%">
      {currentAccount === '' ? (
        <Button colorScheme="purple" w="100%" onClick={connectWallet}>
          Connect to Wallet
        </Button>
      ) : (
        <Button
          colorScheme="purple"
          w="100%"
          onClick={mint}
          fontFamily="Spartan"
          fontSize="sm"
        >
          Mint
        </Button>
      )}
    </Box>
  );
}
