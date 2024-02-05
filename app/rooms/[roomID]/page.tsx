"use client";
import type { RoomPageProps } from "./type";

const createEventSource = (roomID: string) => {
  const eventSource = new EventSource(`/api/rooms/${roomID}/sse`);
  eventSource.onmessage = (event) => {
    console.log(event.data);
  };
  eventSource.onerror = (event) => {
    console.error(event);
  };
};

export default function Room(props: RoomPageProps) {
  const { roomID } = props.params;
  return "Room" + roomID;
}
