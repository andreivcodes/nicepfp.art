import { Footer } from "@/components/footer";
import { InfoCards } from "@/components/info-cards";
import { Web3Provider } from "@/components/provider";
import { ShowcaseList } from "@/components/showcase-list";
import { Welcome } from "@/components/welcome";
import dynamic from "next/dynamic";

const Drawsheet = dynamic(() => import("./../components/drawsheet"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-8">
      <Web3Provider>
        <div className="w-full justify-center flex flex-col md:flex-row p-2 md:p-8">
          <div className="md:min-w-[530px] md:min-h-[634px]">
            <Drawsheet />
          </div>
          <Welcome />
        </div>
        <InfoCards />
        <ShowcaseList />
      </Web3Provider>
      <Footer />
    </main >
  );
}
