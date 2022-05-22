import {
  Box,
  Stat,
  StatLabel,
  Image,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractJson from "../abi/Nicepfp.json";

const Mint = ({ tokenid }) => {
  const [uri, setUri] = useState("");
  const [img, setImg] = useState("");
  useEffect(() => {
    async function fetchData() {
      var provider = new ethers.providers.Web3Provider(window.ethereum);
      var contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractJson.abi,
        provider
      );
      var token = await contract.tokenByIndex(tokenid);
      setUri(await contract.tokenURI(token));
    }
    fetchData();
  }, [tokenid]);

  useEffect(() => {
    async function fetchData() {
      if (uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.animation_url) setImg(responseJson.animation_url);
            else setImg(responseJson.image);
          });
    }
    fetchData();
  }, [uri]);

  return (
    <Image
      src={img}
      alt=""
      borderRadius="full"
      boxSize="150px"
      fallbackSrc="https://via.placeholder.com/150"
    />
  );
};

export default function LatestMints() {
  const [supply, setSupply] = useState(0);

  useEffect(() => {
    async function fetchData() {
      var provider = new ethers.providers.Web3Provider(window.ethereum);
      var contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractJson.abi,
        provider
      );
      setSupply(ethers.BigNumber.from(await contract.totalSupply()).toNumber());
    }
    fetchData();
  }, []);

  return (
    <Box
      w="100%"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Stat>
        <StatLabel m={2} fontFamily="Spartan" fontWeight="bold">
          Latest mints
        </StatLabel>
        <Divider />
        <SimpleGrid minChildWidth="150px" padding="5" spacing="5">
          {[...Array(supply)].slice(0, 16).map((x, i, array) => (
            <Mint key={i} tokenid={array.length - 1 - i} />
          ))}
        </SimpleGrid>
      </Stat>
    </Box>
  );
}
