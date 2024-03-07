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
import { getAddressForFid } from "frames.js";
import { getImage, hasMinted, lock, mint, unlock } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type State = {
  id: string;
  src: string;
};

const initialState: State = { id: "null", src: "null" };

export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody);

  const { id, imgSrc } = await getImage();

  const reducer: FrameReducer<State> = (state, action) => {
    const buttonIndex = action.postBody?.untrustedData.buttonIndex;
    if (buttonIndex == 1 && state.src != "null") {
      return {
        id: state.id,
        src: state.src,
      };
    } else {
      return {
        id: id,
        src: imgSrc,
      };
    }
  };

  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  if (previousFrame.prevState == null) {
    return (
      <FrameContainer
        pathname={`${process.env.NEXT_PUBLIC_HOST}/frame`}
        postUrl={`${process.env.NEXT_PUBLIC_HOST}/frame/post`}
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={`${process.env.NEXT_PUBLIC_HOST}/assets/welcome.png`} aspectRatio="1:1"></FrameImage>
        <FrameButton>Generate nicepfp</FrameButton>
      </FrameContainer>
    );
  }

  const address = await getAddressForFid({
    fid: frameMessage?.requesterFid ?? 1,
    options: { fallbackToCustodyAddress: true },
  });

  let alreadyMinted = await hasMinted(address);

  if (frameMessage?.buttonIndex == 1) {
    if (previousFrame.prevState.id != "null" && frameMessage.recastedCast) {
      await mint(address, previousFrame.prevState.id);
      alreadyMinted = true;
    }
  }

  if (alreadyMinted) {
    return (
      <FrameContainer
        pathname={`${process.env.NEXT_PUBLIC_HOST}/frame`}
        postUrl={`${process.env.NEXT_PUBLIC_HOST}/frame/post`}
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-white text-black justify-center items-center flex">
            You already minted your nicepfp! ❤️
          </div>
        </FrameImage>
        <FrameButton>Thanks!</FrameButton>
      </FrameContainer>
    );
  }

  if (previousFrame != null && previousFrame.prevState != null && previousFrame.prevState.id != "null")
    await unlock(previousFrame.prevState.id);

  if (state.id != "null") await lock(state.id);

  if (state.src != "null")
    return (
      <FrameContainer
        pathname={`${process.env.NEXT_PUBLIC_HOST}/frame`}
        postUrl={`${process.env.NEXT_PUBLIC_HOST}/frame/post`}
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={state.src} aspectRatio="1:1"></FrameImage>
        <FrameButton>{frameMessage?.recastedCast ? "Mint" : "Recast to mint"}</FrameButton>
        <FrameButton>Redraw</FrameButton>
      </FrameContainer>
    );

  return (
    <FrameContainer
      pathname={`${process.env.NEXT_PUBLIC_HOST}/frame`}
      postUrl={`${process.env.NEXT_PUBLIC_HOST}/frame/post`}
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-white text-black justify-center items-center flex">Oops, something went wrong 😑</div>
      </FrameImage>
    </FrameContainer>
  );
}
