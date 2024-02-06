import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();
const kvDB: Record<string, string[]> = {};

export async function GET(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const { roomID } = options.params;
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  if (!kvDB[roomID]) {
    kvDB[roomID] = [];
  }
  const replyRoomInfo = () => {
    writer.write(`data: ${JSON.stringify(kvDB[roomID])}\n\n`);
  };

  emitter.on(`update:${roomID}`, replyRoomInfo);
  replyRoomInfo();
  req.signal.addEventListener("abort", () => {
    emitter.off(`update:${roomID}`, replyRoomInfo);
    writer.close();
  });

  const res = new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
  return res;
}

interface Body {
  msg: string;
}

export async function POST(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const { roomID } = options.params;
  const { msg } = (await req.json()) as Body;
  if (!kvDB[roomID]) {
    kvDB[roomID] = [];
  }
  kvDB[roomID].push(msg);
  emitter.emit(`update:${roomID}`);
  return NextResponse.json({
    success: true,
  });
}
