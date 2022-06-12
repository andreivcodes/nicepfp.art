import {
  Box,
  Flex,
  Stat,
  StatLabel,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Link,
  Center,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractJson from "../abi/Nicepfp.json";
import { useContractRead } from "wagmi";

const Mint = ({ id }) => {
  const [uri, setUri] = useState();
  const [img, setImg] = useState();
  const [tokenId, setTokenId] = useState();

  const getTokenId = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: contractJson.abi,
    },
    "tokenByIndex",
    {
      args: [id],
    }
  );

  useEffect(() => {
    if (getTokenId.data) {
      setTokenId(getTokenId.data);
    }
  }, [getTokenId]);

  const contractUriData = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: contractJson.abi,
    },
    "tokenURI",
    {
      args: [tokenId],
    }
  );

  useEffect(() => {
    if (contractUriData.data) {
      setUri(contractUriData.data);
    }
  }, [contractUriData]);

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
    <div>
      {img ? (
        <Image
          src={img}
          alt="one of the minted images"
          layout="fixed"
          width={150}
          height={150}
          placeholder="blur"
          blurDataURL={img}
          quality="30"
        />
      ) : (
        <Skeleton width={150} height={150} />
      )}
    </div>
  );
};

export default function LatestMints() {
  const [supply, setSupply] = useState();

  const { data } = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: contractJson.abi,
    },
    "totalSupply"
  );

  useEffect(() => {
    async function fetchData() {
      setSupply(ethers.BigNumber.from(data).toNumber());
    }
    fetchData();
  }, [data]);

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
          {supply} very nice pfps -{" "}
          <Link href="https://opensea.io/collection/nicepfp-art" isExternal>
            View OpenSea collection
            <ExternalLinkIcon mx="2px" />
          </Link>
        </StatLabel>
        <Divider />
        <SimpleGrid minChildWidth="150px" padding="5" spacing="5">
          {[...Array(supply)].map((x, i, array) => (
            <Center key={array.length - i - 1}>
              <Mint key={array.length - i - 1} id={array.length - i - 1} />
            </Center>
          ))}
        </SimpleGrid>
      </Stat>
    </Box>
  );
}
