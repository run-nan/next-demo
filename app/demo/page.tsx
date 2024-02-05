"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const createEventSource = (roomID: string, options: any = {}) => {
  const eventSource = new EventSource(`/api/rooms/${roomID}/sse`);
  eventSource.onopen = (event) => {
    toast("建立连接");
    options.onOpen?.(event);
  };
  eventSource.onmessage = (event) => {
    toast(event.data);
    options.onMessage?.(event);
  };
  eventSource.onerror = (event) => {
    toast("连接出错");
    options.onError?.(event);
  };
  return eventSource;
};

export default function Room() {
  const [message, setMessage] = useState("");
  const [eventSource] = useState(() =>
    createEventSource("1", {
      onMessage: (event: any) => {
        setMessage((v) => v + event.data + "\n");
      },
    })
  );
  useEffect(() => {
    return () => {
      eventSource.close();
    };
  }, [eventSource]);
  return <div>{message}</div>;
}
