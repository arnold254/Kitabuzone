import { useBorrow } from "../../context/BorrowContext";

const mockBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Atomic Habits", author: "James Clear" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari" },
];

const Library = () => {
  const { addToCart } = useBorrow();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockBooks.map((book) => (
          <div
            key={book.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <button
              onClick={() => addToCart(book)}
              className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Borrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
