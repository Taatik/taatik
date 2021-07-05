import { Handler, HandlerEvent } from "@netlify/functions";
import { Text as Metagraphi } from "metagraphi";
import { version as metagraphiVersion } from "metagraphi/package.json";
import { Text as Umschrift } from "umschrift";
import { version as umschriftVersion } from "umschrift/package.json";
import { Text as Translitteration } from "hebraisk-translitteration";
import { version as translitterationVersion } from "hebraisk-translitteration/package.json";

type Data = {
  heb: string;
  method: string;
};

const chooseMethod = (method: string) => {
  switch (method) {
    case "metagraphi":
      return {
        package: Metagraphi,
        version: metagraphiVersion,
      };
    case "umschrift":
      return {
        package: Umschrift,
        version: umschriftVersion,
      };
    case "translitteration":
      return {
        package: Translitteration,
        version: translitterationVersion,
      };
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
    const method = chooseMethod(data.method.toLowerCase());
    const text = new method.package(data.heb);

    const resp = {
      method: `${method.package}`,
      methodVersion: method.version,
      original: data.heb,
      transliteration: text.transliterate(),
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
