import { Handler, HandlerEvent } from "@netlify/functions";
import { Text as Metagraphi } from "metagraphi";
import { Text as Umschrift } from "umschrift";
import { Text as Translitteration } from "hebraisk-translitteration";

type Data = {
  heb: string;
  method: string;
};

const chooseMethod = (method: string) => {
  switch (method) {
    case "metagraphi":
      return Metagraphi;
    case "umschrift":
      return Umschrift;
    case "translitteration":
      return Translitteration;
    default:
      throw new Error(`${method} is not a valid transliteration method`);
  }
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    // Only allow POST
    if (event.httpMethod !== "POST") {
      throw { statusCode: 405, body: "Method Not Allowed" };
    }

    const data: Data = JSON.parse(event.body);
    const text = chooseMethod(data.method.toLowerCase());
    const heb = new text(data.heb);

    const resp = {
      method: data.method,
      original: data.heb,
      transliteration: heb.transliterate(),
    };

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resp),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 400,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(error.message),
    };
  }
};

export { handler };
