import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Book from "../components/Book";
import DVD from "../components/DVD";
import Pagination from "../utils/Pagination";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../utils/Loading";

const Home = () => {
  const [activeTab, setActiveTab] = useState("books"); // State for active tab
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [language, setLanguage] = useState(""); // State for language filter
  const [genre, setGenre] = useState(""); // State for genre filter
  const [books, setBooks] = useState([]); // State for books data
  const [dvds, setDvds] = useState([]); // State for DVDs data
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(8); // Number of items per page
  const [totalBooks, setTotalBooks] = useState(0); // Total number of books
  const [totalDvds, setTotalDvds] = useState(0); // Total number of DVDs
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const { isLoggedIn, login, logout } = useAuth(); // Auth status and functions

  // Fetch books and DVDs based on active tab and filters
  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        langue: language || "",
        genre: genre || "",
      });

      const bookResponse = await fetch(`http://127.0.0.1:8000/home?${queryParams.toString()}`);
      const dvdResponse = await fetch(`http://127.0.0.1:8000/home/DVD?${queryParams.toString()}`);

      const booksData = await bookResponse.json();
      const dvdsData = await dvdResponse.json();
      if (booksData && booksData.Books) {
        setBooks(booksData.Books);
        setTotalBooks(booksData.Books.length);
      } else {
        setBooks([]);
        setTotalBooks(0);
      }

      if (dvdsData && dvdsData.DVDs) {
        setDvds(dvdsData.DVDs);
        setTotalDvds(dvdsData.DVDs.length);
      } else {
        setDvds([]);
        setTotalDvds(0);
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, language, genre, currentPage]);

  // Handle tab and page changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 when switching tabs
    fetchItems(); // Fetch items when tab changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter and search handlers
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "language") {
      setLanguage(value);
    } else if (filterType === "genre") {
      setGenre(value);
    }
    setCurrentPage(1);
  };

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBooks = books.slice(startIndex, endIndex);
  const paginatedDvds = dvds.slice(startIndex, endIndex);

  return (
    <div>
      {/* Header Section */}
      <div className="absolute w-full top-20 bg-yellow-950">
        <div className="text-white py-2 px-20 flex items-center w-full justify-between">
          <div className="flex gap-2">
            <h2 className="font-medium font-frank text-2xl italic">
              Find Your Favorite {activeTab === "books" ? "Book" : "DVD"}
            </h2>
          </div>
          <div className="flex items-center px-2 py-2 w-full max-w-sm bg-white rounded-full border-2 border-yellow-950 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <input
              type="text"
              placeholder={`Type in the ${activeTab === "books" ? "book" : "DVD"} title ...`}
              className="w-full outline-none text-sm text-black placeholder-gray-400"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <FaSearch className="text-gray-500" size={18} />
          </div>
        </div>
      </div>

      <div className="mt-[10rem] px-20">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleTabChange("books")}
            className={`px-6 py-2 rounded-md font-bold ${
              activeTab === "books" ? "bg-yellow-950 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Books
          </button>
          <button
            onClick={() => handleTabChange("dvds")}
            className={`px-6 py-2 rounded-md font-bold ${
              activeTab === "dvds" ? "bg-yellow-950 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            DVDs
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            className="border rounded-md px-4 py-2"
            value={language}
            onChange={(e) => handleFilterChange("language", e.target.value)}
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            {/* Add more languages as needed */}
          </select>
          <select
            className="border rounded-md px-4 py-2"
            value={genre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-fiction</option>
            {/* Add more genres as needed */}
          </select>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl font-bold mb-6 font-frank">
            Most Borrowed {activeTab === "books" ? "Books" : "DVDs"}
          </h2>
          {loading ? (
            <Loading />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              {activeTab === "books" &&
                paginatedBooks.map((book) => (
                  <Book
                    key={book.id_element}
                    title={book.titre}
                    author={book.author}
                    price={book.price}
                  />
                ))}
              {activeTab === "dvds" &&
                paginatedDvds.map((dvd) => (
                  <DVD
                    key={dvd.id_element}
                    title={dvd.titre}
                    director={dvd.director}
                    price={dvd.price}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={activeTab === "books" ? totalBooks : totalDvds}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
