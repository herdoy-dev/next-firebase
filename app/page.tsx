import ItemSearch from "@/components/item-search";
import ListInput from "@/components/list-input";
import ListItem from "@/components/list-item";
import Pagination from "@/components/pagination";
import { db } from "@/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const search = params.search?.trim().toLowerCase() ?? "";
  const pageSize = 5;

  const itemsRef = collection(db, "Items");
  const q = query(itemsRef, orderBy("item"));

  // Fetch all items
  const snapshot = await getDocs(q);
  const allItems = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocumentData[];

  // Filter items based on search text
  const filteredItems = search
    ? allItems.filter((item) => item.item.toLowerCase().includes(search))
    : allItems;

  // Get total item count (matching search)
  const totalDocs = filteredItems.length;

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalDocs);
  const items = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="h-screen flex justify-center p-4">
      <div className="w-3xl bg-gray-200 rounded-3xl shadow p-4">
        <ListInput />
        <div className="w-full">
          <ItemSearch />
        </div>

        <div className="flex flex-col items-center gap-3 py-4">
          {items.map((item) => (
            <ListItem key={item.id} item={{ id: item.id, data: item.item }} />
          ))}

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
