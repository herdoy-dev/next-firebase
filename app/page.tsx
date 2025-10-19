import ListInput from "@/components/list-input";
import ListItem from "@/components/list-item";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function Home() {
  const { docs } = await getDocs(collection(db, "Items"));

  return (
    <div className="h-screen flex justify-center p-4">
      <div className="w-3xl bg-gray-200 rounded-3xl shadow p-4">
        <ListInput />
        <div className="flex items-center justify-center flex-col gap-3 py-4">
          {docs.map((doc) => (
            <ListItem
              key={doc.id}
              item={{ id: doc.id, data: doc.data().item }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
