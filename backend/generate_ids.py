import uuid
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def gen_id():
    return str(uuid.uuid4())

# Generate UUIDs
admin_id = gen_id()
user_id = gen_id()
book1_id = gen_id()
book2_id = gen_id()
lend1_id = gen_id()
lendreq1_id = gen_id()
order1_id = gen_id()
item1_id = gen_id()
payment1_id = gen_id()
log1_id = gen_id()
log2_id = gen_id()
req1_id = gen_id()
req2_id = gen_id()

# Generate password hashes
admin_password = generate_password_hash("adminpassword")
user_password = generate_password_hash("userpassword")

# Generate SQL
print(f"""
INSERT INTO users (id, username, name, email, password_hash, role, created_at)
VALUES
('{admin_id}', 'admin', 'Admin User', 'admin@example.com', '{admin_password}', 'admin', '2025-09-28 07:46:00'),
('{user_id}', 'johndoe', 'John Doe', 'john@example.com', '{user_password}', 'customer', '2025-09-28 07:46:00');

INSERT INTO books (id, title, author, category, price, isbn, copies_available, created_at)
VALUES
('{book1_id}', '1984', 'George Orwell', 'Dystopian', NULL, '9780451524935', 5, '2025-09-28 07:46:00'),
('{book2_id}', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 15.99, '9780743273565', 3, '2025-09-28 07:46:00');

INSERT INTO lending_requests (id, user_id, book_id, status, approved_by, created_at)
VALUES
('{lendreq1_id}', '{user_id}', '{book1_id}', 'Approved', '{admin_id}', '2025-09-28 07:46:00');

INSERT INTO lendings (id, user_id, book_id, status, borrowed_at, due_date)
VALUES
('{lend1_id}', '{user_id}', '{book1_id}', 'borrowed', '2025-09-28 07:46:00', '2025-10-12 07:46:00');

INSERT INTO orders (id, user_id, status, approved_by, created_at)
VALUES
('{order1_id}', '{user_id}', 'Approved', '{admin_id}', '2025-09-28 07:46:00');

INSERT INTO order_items (id, order_id, book_id, quantity)
VALUES
('{item1_id}', '{order1_id}', '{book2_id}', 1);

INSERT INTO payments (id, user_id, amount, status, created_at)
VALUES
('{payment1_id}', '{user_id}', 15.99, 'completed', '2025-09-28 07:46:00');

INSERT INTO activity_logs (id, user_id, action, item, created_at)
VALUES
('{log1_id}', '{user_id}', 'Borrowed', '1984', '2025-09-28 07:46:00'),
('{log2_id}', '{user_id}', 'Purchased', 'The Great Gatsby', '2025-09-28 07:46:00');

INSERT INTO pending_requests (id, user_id, book_id, request_type, created_at)
VALUES
('{req1_id}', '{user_id}', '{book1_id}', 'Borrow', '2025-09-28 07:46:00'),
('{req2_id}', '{user_id}', '{book2_id}', 'Purchase', '2025-09-28 07:46:00');
""")