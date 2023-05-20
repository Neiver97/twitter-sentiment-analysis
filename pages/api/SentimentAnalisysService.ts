import {SentimentRequest} from "@/utils/SentimentRequest";

const sentimentAnalisisApi = process.env.SENTIMENT_ANALISYS_API ?? "";

export default function SentimentAnalisysService(payload: SentimentRequest) {
  return fetch(sentimentAnalisisApi, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => {
  });
}


