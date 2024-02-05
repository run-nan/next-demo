import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Button>
      <Link href="/rooms">room list</Link>
    </Button>
  );
}
