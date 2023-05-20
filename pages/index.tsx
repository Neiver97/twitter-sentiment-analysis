import type {NextPage} from "next";
import {useRef, useState} from "react";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import SentimentAnalisysService from "./api/SentimentAnalisysService";
import {SentimentRequest} from "@/utils/SentimentRequest";
import {SentimentResponse} from "@/utils/SentimentResponse";
import Image from "next/image";
import {NEGATIVE, NEUTRAL, POSITIVE} from "@/utils/SENTIMENTS";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [texto, setTexto] = useState("");
  const [textoGenerado, setTextoGenerado] = useState<boolean>(false);
  const [srcSentiment, setSrcSentiment] = useState<String>("");
  const [sentiment, setSentiment] = useState<SentimentResponse>(new SentimentResponse());
  
  const bioRef = useRef<null | HTMLDivElement>(null);
  
  const evaluarSentimiento = (e: any) => {
    e.preventDefault();
    setTextoGenerado(false);
    setSrcSentiment("");
    setSentiment(new SentimentResponse());
    setLoading(true);
    setError(false);
    
    let payload = new SentimentRequest();
    payload.text = texto;
    
    SentimentAnalisysService(payload).then(response => {
      if (response && response.status === 200) {
        response.json().then(body => {
          let sentimentResponse: SentimentResponse = body
          if (sentimentResponse) {
            setTextoGenerado(true)
            setSentiment(sentimentResponse)
            
            if (sentimentResponse.positivePercentage) {
              sentimentResponse.positivePercentage = sentimentResponse.positivePercentage * 100;
            }
            
            if (sentimentResponse.negativePercentage) {
              sentimentResponse.negativePercentage = sentimentResponse.negativePercentage * 100;
            }
            
            if (sentimentResponse.neutralPercentage) {
              sentimentResponse.neutralPercentage = sentimentResponse.neutralPercentage * 100;
            }
            
            if (sentimentResponse.sentiment == POSITIVE) {
              setSrcSentiment("/positivo.png")
            } else if (sentimentResponse.sentiment == NEGATIVE) {
              setSrcSentiment("/negativo.png")
            } else if (sentimentResponse.sentiment == NEUTRAL) {
              setSrcSentiment("/neutro.png")
            }
          }
        });
      } else {
        setError(true)
      }
    }).finally(() => setLoading(false))
  };
  
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header/>
      <main className="flex flex-1 w-full flex-col px-8 mt-1 sm:mt-1">
        <div className="flex flex-col justify-center items-center text-center">
          <div className="max-w-xl w-full mt-5">
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
                "Express yourself..."
              }
            />
            {!loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                onClick={(e) => evaluarSentimiento(e)}>
                Evaluate my feelings
              </button>
            )}
            {loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled>
                <LoadingDots color="white" style="large"/>
              </button>
            )}
            {error && (
              <p className="text-red-600">There was a problem evaluating your feelings</p>
            )}
          </div>
          <div className="mt-5">
            {textoGenerado && (
              <>
                <div>
                  <h2 className="sm:text-4xl text-3xl font-light text-slate-900 mx-auto">
                    Your feelings were...
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-x-10 my-10 items-center justify-center">
                  <div>
                    {srcSentiment && (
                      <Image src={srcSentiment} alt={''} width={100} height={100}/>
                    )}
                  </div>
                  <div>
                    <p className="text-100 font-bold text-green-500">{sentiment.positivePercentage}%</p>
                  </div>
                  <div>
                    <p className="text-100 font-bold text-red-500">{sentiment.negativePercentage}%</p>
                  </div>
                  <div>
                    <p className="text-100 font-bold text-gray-400">{sentiment.neutralPercentage}%</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
