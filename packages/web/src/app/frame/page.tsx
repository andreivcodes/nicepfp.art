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
  imgSrc: string;
};




export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {

  const initialState: State = { imgSrc: `https://ipfs.io/ipfs/${await generateImageBase64()}` };

  const newImg = await generateImageBase64();

  const reducer: FrameReducer<State> = (state, action) => {
    return {
      imgSrc: `https://ipfs.io/ipfs/${newImg}`
    };
  };

  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state, dispatch] = useFramesReducer<State>(reducer, initialState, previousFrame);

  return (
    <div>
      <FrameContainer
        pathname="/frame"
        postUrl="/frame"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={state.imgSrc}
          aspectRatio="1:1"
        ></FrameImage>
        <FrameButton>
          Redraw
        </FrameButton>

        {/* <FrameButton action="mint" target="">
          Mint
        </FrameButton> */}
      </FrameContainer>
    </div>
  );
}
