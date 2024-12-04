import React from "react";

const Book = ({key, title, author, price, image }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition-transform duration-300">
      {/* Placeholder for the book image */}
      <div className="bg-gray-200 h-60 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Image Placeholder</span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{author}</p>
        {/* <p className="mt-2 text-yellow-700 font-bold">${price.toFixed(2)}</p> */}
      </div>
    </div>
  );
};

export default Book;
