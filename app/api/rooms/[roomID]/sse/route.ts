import { type NextRequest } from "next/server";

export const GET = (request: NextRequest, params: { roomID: string }) => {
  const { roomID } = params;
  const { headers } = request;
  const accept = headers.get("accept");
  const contentType =
    accept === "text/event-stream" ? "text/event-stream" : "application/json";
  const body =
    accept === "text/event-stream" ? "data: Hello, world\n\n" : { roomID };
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": contentType,
    },
  });
};
