import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { getAddressForFid } from "frames.js"
import { getImage, hasMinted, lock, mint, unlock } from "./actions";

type State = {
  src: string
  id: string
};

const initialState: State = { id: "", src: "" };

export default async function Home({
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody);

  console.log(1)

  const { id, imgSrc } = await getImage();
  console.log(2)
  const reducer: FrameReducer<State> = (state, action) => {
    console.log(3)
    // if (frameMessage?.buttonIndex == 1 && state.src.length > 0) {
    //   return {
    //     src: state.src,
    //     id: state.id
    //   };
    // }
    // else {
    return {
      src: imgSrc,
      id: id
    };
    // }
  };

  console.log(4)
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  console.log(5)
  if (!previousFrame.prevState) {
    return (
      <div>
        <FrameContainer
          pathname="/frame"
          postUrl="/frame/post"
          state={state}
          previousFrame={previousFrame}
        >
          <FrameImage src="https://nicepfp.art/assets/welcome.png" aspectRatio="1:1">
          </FrameImage>
          <FrameButton>
            Generate nicepfp
          </FrameButton>
        </FrameContainer>
      </div >
    );
  }

  console.log(6)
  const address = await getAddressForFid({
    fid: frameMessage?.requesterFid ?? 1,
    options: { fallbackToCustodyAddress: true }
  });

  console.log(7)

  let alreadyMinted = await hasMinted(address)
  console.log(8)

  if (frameMessage?.buttonIndex == 1) {
    if (previousFrame.prevState.id.length > 0 && frameMessage.recastedCast) {
      await mint(address, previousFrame.prevState.id)
      alreadyMinted = true;
    }
  }

  console.log(9)

  if (alreadyMinted) {
    return (
      <div>
        <FrameContainer
          pathname="/frame"
          postUrl="/frame/post"
          state={state}
          previousFrame={previousFrame}
        >
          <FrameImage>
            <div tw="w-full h-full bg-white text-black justify-center items-center flex">
              You already minted your nicepfp! ❤️
            </div>
          </FrameImage>
          <FrameButton>
            Thanks!
          </FrameButton>
        </FrameContainer>
      </div >
    );
  }

  console.log(10)

  if (previousFrame.prevState.id)
    await unlock(previousFrame.prevState.id);

  console.log(11)
  await lock(state.id)

  console.log(12)
  return (
    <div>
      <FrameContainer
        pathname="/frame"
        postUrl="/frame/post"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={state.src} aspectRatio="1:1">
        </FrameImage>
        <FrameButton>
          {frameMessage?.recastedCast ? "Mint" : "Recast to mint"}
        </FrameButton>
        <FrameButton>
          Redraw
        </FrameButton>
      </FrameContainer>
    </div >
  );

}
