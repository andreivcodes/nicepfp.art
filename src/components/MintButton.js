import { Button, Box, Text, Code, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function MintButton() {
  const [currentAccount, setCurrentAccount] = useState('');
  const toast = useToast();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
        params: [{ chainId: '0x13881' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
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
            ],
          });
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <Box w="100%">
      {currentAccount === '' ? (
        <Button colorScheme="purple" w="100%" onClick={connectWallet}>
          Connect to Wallet
        </Button>
      ) : (
        <Button colorScheme="purple" w="100%">
          Mint
        </Button>
      )}
    </Box>
  );
}
