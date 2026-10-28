import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
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

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const previousFrame = getPreviousFrame<State>(resolvedSearchParams);
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

  // eslint-disable-next-line react-hooks/rules-of-hooks -- useFramesReducer is a server-side function from frames.js, not a React hook
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

  // The fid, button and recast flag are decoded from the client-supplied
  // message bytes; only isValid says a hub verified the signature. Without it
  // anyone could post a forged message for any fid and have the mint worker
  // mint (and pay gas) on their behalf.
  if (!frameMessage?.isValid) {
    return (
      <FrameContainer
        pathname={`${process.env.NEXT_PUBLIC_HOST}/frame`}
        postUrl={`${process.env.NEXT_PUBLIC_HOST}/frame/post`}
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-white text-black justify-center items-center flex">
            Couldn&apos;t verify this request, please try again.
          </div>
        </FrameImage>
        <FrameButton>Try again</FrameButton>
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
