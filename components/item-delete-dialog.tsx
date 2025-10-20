"use client";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BounceLoader } from "react-spinners";

interface Item {
  id: string;
  data: string;
}

interface Props {
  item: Item;
  onSucess: () => void;
  onClose: () => void;
}

const ItemDeleteDialog = ({ item, onSucess, onClose }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "Items", item.id));
      toast.success("Item deleted successfully");
      const currentPage = params.get("page");
      if (currentPage) {
        params.delete("page");
        router.push(`?${params.toString()}`);
      }
      router.refresh();
      onSucess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-black/80 flex items-center justify-center fixed top-0 left-0 p-4">
      <div className="md:w-[550px] max-w-[400px] bg-white rounded-2xl shadow p-4">
        <h1 className="font-semibold text-2xl text-gray-800">Delete Item</h1>

        <p className="text-gray-600">
          Are you sure you want to delete This item? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-20 flex items-center justify-center py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            {loading ? <BounceLoader size={24} color="#fff" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDeleteDialog;
