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
import { getImage, hasMinted, mint, unlock } from "./actions";

type State = {
  i: boolean;
  m: boolean;
  src: string;
  id: string;
};

const initialState: State = { i: true, m: false, src: "", id: "" };

export default async function Home({
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody);

  const address = await getAddressForFid({
    fid: frameMessage?.requesterFid ?? 1,
    options: { fallbackToCustodyAddress: true }
  });

  let alreadyMinted = await hasMinted(address)

  if (frameMessage?.buttonIndex == 1 && previousFrame.prevState?.i == false) {
    if (previousFrame.prevState.id.length > 5)
      await mint(address, previousFrame.prevState.id)
    alreadyMinted = true;
  }

  const { id, imgSrc } = await getImage();

  const reducer: FrameReducer<State> = (state, action) => {
    return {
      i: false,
      m: alreadyMinted,
      src: imgSrc,
      id: id
    };
  };


  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  if (previousFrame.prevState)
    await unlock(previousFrame.prevState.id);

  if (state.m) {
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
              You minted your nicepfp!
            </div>
          </FrameImage>
          <FrameButton>
            Thanks!
          </FrameButton>
        </FrameContainer>
      </div >
    );
  }
  else {
    return (
      <div>
        <FrameContainer
          pathname="/frame"
          postUrl="/frame/post"
          state={state}
          previousFrame={previousFrame}
        >
          {state.i ?
            <FrameImage
              aspectRatio="1:1"
              src="https://nicepfp.art/assets/welcome.png">
            </FrameImage>
            :
            <FrameImage
              src={state.src}
              aspectRatio="1:1"
            />
          }


          {state.i ?
            <FrameButton>
              Generate nicepfp
            </FrameButton>
            :
            null
          }

          {state.i ?
            null
            :
            <FrameButton>
              Mint
            </FrameButton>
          }

          {state.i ?
            null
            :
            <FrameButton>
              Redraw
            </FrameButton>
          }

        </FrameContainer>
      </div >
    );
  }
}
