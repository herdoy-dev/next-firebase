"use client";
import { db } from "@/firebase";
import { joiResolver } from "@hookform/resolvers/joi";
import { addDoc, collection } from "firebase/firestore";
import Joi from "joi";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

const ListInput = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormItems>({
    defaultValues: {
      item: "",
    },
    resolver: joiResolver(InputSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addDoc(collection(db, "Items"), data);
      toast.success("Success");
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went worn!");
    }
  });

  return (
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
          className="py-3 cursor-pointer w-16 flex items-center justify-center border-none outline-none bg-green-500 text-white"
        >
          {isSubmitting ? <BounceLoader size={24} color="#fff" /> : "Add"}
        </button>
      </div>
      <div className="px-1 py-2">
        {errors && errors.item && (
          <p className="text-red-500"> {errors.item.message} </p>
        )}
      </div>
    </form>
  );
};

export default ListInput;
