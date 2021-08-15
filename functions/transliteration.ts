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
  try {
    const resp = await fetch(`${URL}/.netlify/functions/${method}`, newReq);

    if (resp.status !== 200) {
      // const error = await resp.json();
      throw resp;
    }
    return await resp.json();
  } catch (error) {
    throw error;
  }
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    // Only allow POST
    if (event.httpMethod !== "POST") {
      throw { statusCode: 405, message: "Method Not Allowed" };
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
      statusCode: error.status || 400,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await error.json()),
    };
  }
};

export { handler };
