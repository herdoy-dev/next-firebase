"use client";
import { db } from "@/firebase";
import { joiResolver } from "@hookform/resolvers/joi";
import { doc, updateDoc } from "firebase/firestore";
import Joi from "joi";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { BounceLoader } from "react-spinners";

const InputSchema = Joi.object({
  item: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Item is not allowed to be empty",
    "string.min": "Item length must be at least 2 characters long",
    "string.max":
      "Item length must be less than or equal to 50 characters long",
  }),
});

interface FormItems {
  item: string;
}

interface Item {
  id: string;
  data: string;
}

interface Props {
  item: Item;
  onSucess: () => void;
  onClose: () => void;
}

const ItemEditDialog = ({ item, onSucess, onClose }: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormItems>({
    defaultValues: {
      item: item.data ?? "",
    },
    resolver: joiResolver(InputSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateDoc(doc(db, "Items", item.id), { item: data.item });
      toast.success("Success");
      reset();
      router.refresh();
      onSucess();
    } catch (error) {
      toast.error("Something went worn!");
    }
  });

  return (
    <div className="w-full h-screen bg-black/80 flex items-center justify-center fixed top-0 left-0 p-4">
      <div className="md:w-[550px] w-full p-4 rounded-2xl shadow bg-gray-200 relative">
        <h1 className="text-center font-semibold text-3xl mt-6 mb-4">
          Edit Item
        </h1>
        <form onSubmit={onSubmit}>
          <div className="flex items-center justify-between w-full border border-gray-300 rounded-md overflow-hidden shadow">
            <input
              {...register("item")}
              type="text"
              placeholder="Enter your item"
              className="border-none focus:outline-none outline-none flex-1 px-3 text-gray-600"
            />
            <button
              disabled={isSubmitting}
              type="submit"
              className="py-3 cursor-pointer w-18 flex items-center justify-center border-none outline-none bg-green-500 text-white"
            >
              {isSubmitting ? (
                <BounceLoader size={24} color="#fff" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
          <div className="px-1 py-2">
            {errors && errors.item && (
              <p className="text-red-500"> {errors.item.message} </p>
            )}
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-5 right-5 border-none outline-none bg-none"
        >
          <IoClose className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ItemEditDialog;
