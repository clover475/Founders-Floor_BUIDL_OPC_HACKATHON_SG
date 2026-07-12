import { notFound } from "next/navigation";
import { OfficeFloor } from "@/components/office/office-floor";
import type { RoomId } from "@/types/domain";

const validRooms: RoomId[] = ["idea", "build", "feedback", "growth", "break"];

export default async function OfficeRoomPage({
  params,
}: {
  params: Promise<{ room: RoomId }>;
}) {
  const { room } = await params;
  if (!validRooms.includes(room)) {
    notFound();
  }

  return <OfficeFloor roomId={room} />;
}
