import {Sentiment} from "../../utils/Sentiment";

const sentimentAnalisisApi = process.env.SENTIMENT_ANALISYS_API ?? "";

export default function SentimentAnalisysService(payload: Sentiment) {
  return fetch(sentimentAnalisisApi, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
}


