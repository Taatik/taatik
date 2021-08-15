import { Handler, HandlerEvent } from "@netlify/functions";
import { Text } from "metagraphi";
import { version } from "metagraphi/package.json";
import { Req, Resp } from "./utils";

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") {
      throw { statusCode: 405, message: "Method Not Allowed" };
    }

    const req: Req = JSON.parse(event.body);
    const heb = new Text(req.heb);

    const resp: Resp = {
      package: req.package,
      version: version,
      original: req.heb,
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
      statusCode: 500,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export { handler };
