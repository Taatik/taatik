import { Handler, HandlerEvent } from "@netlify/functions";
import { Req, Resp } from "./utils";
import fetch from "node-fetch";
const { URL } = process.env;

const constructReq = (req: Req) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  };
};

const getResp = async (req: Req): Promise<Resp> => {
  const method = req.package.toLowerCase();
  const newReq = constructReq(req);
  const resp = await fetch(`${URL}/.netlify/functions/${method}`, newReq);
  const json = await resp.json();
  return resp.ok ? json : Promise.reject(json);
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") {
      throw await Promise.reject({
        message: `${event.httpMethod} Not Allowed`,
      });
    }

    const req: Req = JSON.parse(event.body);
    const resp: Resp = await getResp(req);

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resp),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(error),
    };
  }
};

export { handler };

//[Symbol(Response internals)]: {
//   url: 'https://adoring-swartz-a2dd0c.netlify.app/.netlify/functions/umschrift',
//   status: 404,
//   statusText: 'Not Found',
//   headers: Headers { [Symbol(map)]: [Object: null prototype] },
//   counter: 0
// }
