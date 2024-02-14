export const Welcome = () => {
  return (
    <div className="max-w-xl flex flex-col md:items-end p-8">
      <div className="flex flex-col self-end items-center md:items-end">
        <p className="text-3xl font-extrabold text-gray-800 md:text-7xl">
          Welcome to{" "}
        </p>
        <p className="bg-purple-200 text-[36px] font-extralight text-purple-800 md:text-[96px]">
          nicepfp.art
        </p>
      </div>
      <p className="text-start md:text-end mt-8 text-xl font-light text-gray-700">
        I needed a nice profile picture for my Twitter, so I made this.
        Simple. Free. Unlimited. Forever.
      </p>
    </div>
  );
};
