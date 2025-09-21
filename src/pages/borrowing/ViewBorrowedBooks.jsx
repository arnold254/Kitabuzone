import { useBorrow } from "../../context/BorrowContext";

const ViewBorrowedBooks = () => {
  const { borrowed } = useBorrow();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📖 Borrowed Books</h2>
      {borrowed.length === 0 ? (
        <p>You haven’t borrowed any books yet.</p>
      ) : (
        <ul className="space-y-2">
          {borrowed.map((book, i) => (
            <li
              key={i}
              className="p-2 border rounded bg-gray-100"
            >
              {book.title} — {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewBorrowedBooks;
