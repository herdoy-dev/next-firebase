import ListInput from "@/components/list-input";
import ListItem from "@/components/list-item";
import Pagination from "@/components/pagination";
import { db } from "@/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";

interface Props {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const patams = await searchParams;
  const page = parseInt(patams.page) || 1;
  const pageSize = 5;

  const itemsRef = collection(db, "Items");

  let documentSnapshots = query(itemsRef, limit(pageSize));

  if (page > 1) {
    const prevDocs = await getDocs(
      query(itemsRef, limit((page - 1) * pageSize))
    );
    const lastVisible = prevDocs.docs[prevDocs.docs.length - 1];
    if (lastVisible) {
      documentSnapshots = query(
        itemsRef,
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
  }

  const snapshot = await getDocs(documentSnapshots);

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocumentData[];

  const totalDocs = (await getDocs(itemsRef)).size;

  return (
    <div className="h-screen flex justify-center p-4">
      <div className="w-3xl bg-gray-200 rounded-3xl shadow p-4">
        <ListInput />
        <div className="flex flex-col items-center gap-3 py-4">
          {items.length > 0 ? (
            items.map((item) => (
              <ListItem key={item.id} item={{ id: item.id, data: item.item }} />
            ))
          ) : (
            <p className="text-gray-600">No items found.</p>
          )}

          <div className="w-full py-4">
            <Pagination
              itemCount={totalDocs}
              currentPage={page}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
