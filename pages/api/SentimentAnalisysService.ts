import {SentimentRequest} from "@/utils/SentimentRequest";

const sentimentAnalisisApi = process.env.SENTIMENT_ANALISYS_API ?? "";

export default function SentimentAnalisysService(payload: SentimentRequest) {
  return fetch(sentimentAnalisisApi, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => {
  });
}


