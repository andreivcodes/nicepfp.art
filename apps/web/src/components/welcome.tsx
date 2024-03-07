export const Welcome = () => {
  return (
    <div className="flex max-w-xl flex-col p-8 md:items-end">
      <div className="flex flex-col items-center self-end md:items-end">
        <p className="text-3xl font-extrabold text-gray-800 md:text-7xl">Welcome to </p>
        <p className="bg-purple-200 text-[36px] font-extralight text-purple-800 md:text-[96px]">nicepfp.art</p>
      </div>
      <p className="mt-8 text-start text-xl font-light text-gray-700 md:text-end">
        I needed a nice profile picture for my Twitter, so I made this. Simple. Free. Unlimited. Forever.
      </p>
    </div>
  );
};
