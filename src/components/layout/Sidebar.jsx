import { useState } from "react";
import { Menu } from "@headlessui/react";

const Sidebar = () => {
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");

  const handleFilter = (filterType, value) => {
    if (filterType === "genre") setGenre(value);
    if (filterType === "price") setPrice(value);
    if (filterType === "date") setDate(value);
    console.log(`${filterType}: ${value}`); // Replace with actual filter logic
  };

  return (
    <aside className="bg-gray-50 text-purple-900 w-32 p-1.5 h-screen fixed top-0 left-0 mt-12 z-10 border-l border-purple-200">
      <h2 className="font-medium text-sm mb-2">Filters:</h2>
      <div className="flex flex-col gap-1">
        {/* Genre Filter */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="bg-purple-200 text-purple-900 px-1 py-0.5 rounded flex items-center justify-between w-full hover:bg-purple-300 text-xs"
            aria-controls="genre-menu"
          >
            {genre || "Genre"} <span>⏷</span>
          </Menu.Button>
          <Menu.Items
            id="genre-menu"
            className="absolute z-10 mt-0.5 w-full bg-white text-purple-900 rounded shadow-lg"
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("genre", "Fiction")}
                >
                  Fiction
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("genre", "Non-Fiction")}
                >
                  Non-Fiction
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>

        {/* Price Filter */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="bg-purple-200 text-purple-900 px-1 py-0.5 rounded flex items-center justify-between w-full hover:bg-purple-300 text-xs"
            aria-controls="price-menu"
          >
            {price || "Price"} <span>⏷</span>
          </Menu.Button>
          <Menu.Items
            id="price-menu"
            className="absolute z-10 mt-0.5 w-full bg-white text-purple-900 rounded shadow-lg"
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("price", "Low to High")}
                >
                  Low to High
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("price", "High to Low")}
                >
                  High to Low
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>

        {/* Date Filter */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="bg-purple-200 text-purple-900 px-1 py-0.5 rounded flex items-center justify-between w-full hover:bg-purple-300 text-xs"
            aria-controls="date-menu"
          >
            {date || "Date"} <span>⏷</span>
          </Menu.Button>
          <Menu.Items
            id="date-menu"
            className="absolute z-10 mt-0.5 w-full bg-white text-purple-900 rounded shadow-lg"
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("date", "Newest")}
                >
                  Newest
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left px-2 py-0.5 text-xs ${active ? "bg-purple-100" : ""}`}
                  onClick={() => handleFilter("date", "Oldest")}
                >
                  Oldest
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;