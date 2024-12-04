import React from "react";
import { useAuth } from "../utils/AuthContext";
import BorrowedItems from "../components/BorrowedItems";
import { Link } from "react-router-dom";

const Borrows = () => {
  const { isLoggedIn } = useAuth();

  console.log("isLoggedIn:", isLoggedIn); // Debug log

  if (isLoggedIn) {
    return (
      <div className="py-6 px-8 mt-[5rem]">
        <h1 className="text-3xl font-bold mb-4">Your Borrowed Items</h1>
        <BorrowedItems borrowedData={[{ id: 1, name: "Sample Item" }]} />
      </div>
    );
  }

  return (
    <div className="py-6 px-8 mt-[5rem] flex justify-center items-center h-screen">
      <div>
        <p className="text-xl mb-4">You need to log in to view your borrowed items.</p>
        <Link to="/login" className="text-blue-500">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Borrows;
