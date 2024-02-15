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
  searchParams,
}: NextServerPageProps) {
  const newImg = await generateImageBase64();
  const initialState: State = { imgSrc: "https://ipfs.io/ipfs/" + newImg };

  const reducer: FrameReducer<State> = (state, action) => {
    return {
      imgSrc: "https://ipfs.io/ipfs/" + newImg
    };
  };

  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  return (
    <div>
      <FrameContainer
        pathname="/frame"
        postUrl="/frame/post"
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

      </FrameContainer>
    </div>
  );
}
