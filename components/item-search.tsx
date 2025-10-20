"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";

export default function ItemSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [searchText, setSearchText] = useState<string>("");

  // Sync search input with URL when navigating
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchText(currentSearch);
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchText.trim()) {
      params.delete("search");
      return router.push(`?${params.toString()}`);
    }
    params.delete("page");
    params.set("search", searchText.trim());
    router.push(`?${params.toString()}`);
  };

  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="rounded-md overflow-hidden flex items-center justify-between border border-gray-200 shadow w-full">
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        onKeyDown={onPressEnter}
        type="text"
        placeholder="Search"
        className="px-3 py-2 border-none outline-none focus:outline-none flex-1"
      />
      <button
        onClick={handleSearch}
        className="w-10 h-10 bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-white"
      >
        <FaSearch />
      </button>
    </div>
  );
}
