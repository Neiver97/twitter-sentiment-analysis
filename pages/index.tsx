import type {NextPage} from "next";
import {useRef, useState} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import SentimentAnalisysService from "./api/SentimentAnalisysService";
import {Sentiment} from "@/utils/Sentiment";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState("");
  const [textoGenerado, setTextoGenerado] = useState<String>("");
  
  const bioRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({behavior: "smooth"});
    }
  };
  
  const evaluarSentimiento = (e: any) => {
    e.preventDefault();
    setTextoGenerado("");
    setLoading(true);
    
    let payload = new Sentiment();
    payload.sentimentText = texto;
    
    SentimentAnalisysService(payload).then(response => {
      if (response.status === 200) {
        response.text().then(body => {
          setTextoGenerado(body)
        });
      }
    })
    
    scrollToBios();
    setLoading(false);
  };
  
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-1 sm:mt-1">
        <div className="max-w-xl w-full">
          <div className="flex mt-1 items-center space-x-3">
            <p className="text-left font-medium text-xl ">
              Write your feelings.
            </p>
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
            }
          />
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => evaluarSentimiento(e)}
            >
              Evaluate my feelings
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large"/>
            </button>
          )}
        </div>
        <div className="space-y-10 my-10">
          {textoGenerado && (
            <>
              <div>
                <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                  Your feelings were...
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {textoGenerado}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Home;
