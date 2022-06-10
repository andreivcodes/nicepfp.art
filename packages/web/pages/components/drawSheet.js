import {
  Box,
  Button,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import MintButton from "./mintButton";
import { setup, draw, startDrawing } from "../utils/sketch";
import dynamic from "next/dynamic";
const Sketch = dynamic(() => import("react-p5"), { ssr: false });

const isServer = () => typeof window === "undefined";

export default function DrawSheet() {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  return (
    <Box
      w="min"
      h="min"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue("white", "gray.700")}
    >
      {!isServer() && (
        <div>
          {isMobile ? (
            <Text fontWeight="thin" textAlign="center" fontFamily="Spartan">
              Can't draw on small screens, sorry. Try using nicepfp.art on
              desktop.
            </Text>
          ) : (
            <div>
              <Sketch setup={setup} draw={draw} />
              <Flex justifyContent="end">
                <Button
                  colorScheme="purple"
                  variant="outline"
                  mt={3}
                  fontFamily="Spartan"
                  fontSize="sm"
                  onClick={startDrawing}
                >
                  <RepeatIcon variant="outline" /> {"\xa0 Redraw"}
                </Button>
              </Flex>
            </div>
          )}

          <Flex
            h="100%"
            justifyContent="top"
            w="100%"
            flexDirection="column"
            mt={3}
          >
            <MintButton />
          </Flex>
        </div>
      )}
    </Box>
  );
}
