"use client";
import { useState } from "react";
import { FaCheck, FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import ItemDeleteDialog from "./item-delete-dialog";
import ItemEditDialog from "./item-edit-dialog";

interface Item {
  id: string;
  data: string;
}

interface Props {
  item: Item;
}

const ListItem = ({ item }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-md bg-white w-full overflow-hidden">
        <button className="p-3 cursor-pointer border-none outline-none bg-green-500 text-white">
          <FaCheck />
        </button>
        <div className="flex-1 flex items-center gap-2 px-2">
          <p>{item.data}</p>
        </div>
        <button
          onClick={() => setOpenEditDialog(true)}
          className="p-3 cursor-pointer border-none outline-none bg-amber-500"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => setOpenDeleteDialog(true)}
          className="p-3 cursor-pointer border-none outline-none bg-red-500 text-white"
        >
          <FaRegTrashCan />
        </button>
      </div>
      {openEditDialog && (
        <ItemEditDialog
          item={item}
          onSucess={() => setOpenEditDialog(false)}
          onClose={() => setOpenEditDialog(false)}
        />
      )}
      {openDeleteDialog && (
        <ItemDeleteDialog
          item={item}
          onSucess={() => setOpenDeleteDialog(false)}
          onClose={() => setOpenDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default ListItem;
