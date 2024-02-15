import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { generateImageBase64 } from "./actions";

type State = {
  pageIndex: number;
};

const initialState: State = { pageIndex: 0 };

const reducer: FrameReducer<State> = (state, action) => {

  return {
    pageIndex: 0
  };
};


export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const imageSrc = await generateImageBase64();

  return (
    <div>
      <FrameContainer
        pathname="/frame"
        postUrl="/frame"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={`https://ipfs.io/ipfs/${imageSrc}`}
          aspectRatio="1:1"
        ></FrameImage>
        <FrameButton>Redraw</FrameButton>

        {/* <FrameButton action="mint" target="">
          Mint
        </FrameButton> */}
      </FrameContainer>
    </div>
  );
}
