"use client";
import { useStableFn } from "@/lib/hooks/use-stable-fn";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const createEventSource = (roomID: number, options: any = {}) => {
  const eventSource = new EventSource(`/api/room/${roomID}`);
  eventSource.onopen = (event) => {
    toast("建立连接");
    options.onOpen?.(event);
  };
  eventSource.onmessage = (event) => {
    options.onMessage?.(event);
  };
  eventSource.onerror = (event) => {
    toast("连接出错");
    options.onError?.(event);
  };
  return eventSource;
};

const sendMsg = (roomID: number, msg: string) => {
  fetch(`/api/room/${roomID}`, {
    method: "POST",
    body: JSON.stringify({ msg }),
  });
};

const noop = () => void 0;

const useEventSource = (roomID: number, options: any = {}) => {
  const onOpen = useStableFn(options.onOpen || noop);
  const onMessage = useStableFn(options.onMessage || noop);
  const onError = useStableFn(options.onError || noop);
  useEffect(() => {
    const eventSource = createEventSource(roomID, {
      onOpen,
      onMessage,
      onError,
    });
    return () => {
      eventSource.close();
    };
  }, [roomID, onOpen, onMessage, onError]);
};

export default function Room() {
  const [roomID, setRoomID] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  useEventSource(roomID, {
    onMessage(event: any) {
      setMessages(JSON.parse(event.data));
    },
  });
  return (
    <div className="flex-col p-9 max-w-sm items-center space-y-4">
      {messages.length > 0 ? (
        <ul>
          {messages.map((msg, index) => (
            <li className="space-y-8" key={index}>
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <div>No message</div>
      )}
      <Label htmlFor="msg">房间ID</Label>
      <Input
        type="number"
        id="roomID"
        placeholder="请更改房间ID"
        value={roomID}
        onChange={(e) => setRoomID(Number(e.target.value))}
      />
      <Label htmlFor="msg">消息</Label>
      <Input
        type="text"
        id="msg"
        placeholder="请输入消息"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button
        onClick={() => {
          sendMsg(roomID, msg);
          setMsg("");
        }}
      >
        发送
      </Button>
    </div>
  );
}
