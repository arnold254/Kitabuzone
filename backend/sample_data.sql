
INSERT INTO users (id, username, name, email, password_hash, role, created_at)
VALUES
('af91fee1-cd28-49fa-9f6b-ebaf9a59a7a5', 'admin', 'Admin User', 'admin@example.com', 'scrypt:32768:8:1$9cF1NdKGafN4xr97$d7e43fcd8e6ea027afee0e205e5b676ee04b11c77daf59f760dacc0686fb9f50eb4004c66a1a635c8a2da3cdc5cc03fde08efb3b64b942b6f1e4277f40bd3725', 'admin', '2025-09-28 07:46:00'),
('74bcc398-fae1-4ccd-9b84-9172e4d99b48', 'johndoe', 'John Doe', 'john@example.com', 'scrypt:32768:8:1$0uFxHuVS9Ew8kUQg$3eb4024d71b77e0f06fea0eb8b1d90ca143efc8fe6c154d73324acfbc4f261624dd02deec68d402ffafd67542187b2413276c22996ca77c24e01e13abd4919d0', 'customer', '2025-09-28 07:46:00');

INSERT INTO books (id, title, author, category, price, isbn, copies_available, created_at)
VALUES
('2507ea3c-1d12-4405-afe7-2431b6c3d49f', '1984', 'George Orwell', 'Dystopian', NULL, '9780451524935', 5, '2025-09-28 07:46:00'),
('11a14f7a-507e-4c54-bb3f-1b23a030c757', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 15.99, '9780743273565', 3, '2025-09-28 07:46:00');

INSERT INTO lending_requests (id, user_id, book_id, status, approved_by, created_at)
VALUES
('4ec36f49-f1fd-43b1-bcb7-2e9167200976', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', '2507ea3c-1d12-4405-afe7-2431b6c3d49f', 'Approved', 'af91fee1-cd28-49fa-9f6b-ebaf9a59a7a5', '2025-09-28 07:46:00');

INSERT INTO lendings (id, user_id, book_id, status, borrowed_at, due_date)
VALUES
('ed568d1d-8e8c-4f5e-90c6-d9569200be88', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', '2507ea3c-1d12-4405-afe7-2431b6c3d49f', 'borrowed', '2025-09-28 07:46:00', '2025-10-12 07:46:00');

INSERT INTO orders (id, user_id, status, approved_by, created_at)
VALUES
('cc761a87-2d78-429e-9394-66aeb672227f', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', 'Approved', 'af91fee1-cd28-49fa-9f6b-ebaf9a59a7a5', '2025-09-28 07:46:00');

INSERT INTO order_items (id, order_id, book_id, quantity)
VALUES
('02d20291-8881-4da3-8a50-28a6e7be343c', 'cc761a87-2d78-429e-9394-66aeb672227f', '11a14f7a-507e-4c54-bb3f-1b23a030c757', 1);

INSERT INTO payments (id, user_id, amount, status, created_at)
VALUES
('099d143f-38da-4026-8c20-fd87de54f70e', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', 15.99, 'completed', '2025-09-28 07:46:00');

INSERT INTO activity_logs (id, user_id, action, item, created_at)
VALUES
('a2ca3225-2461-48f5-989b-8af371fb9dbf', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', 'Borrowed', '1984', '2025-09-28 07:46:00'),
('2f995a0c-3922-493a-91c3-31a6c4261010', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', 'Purchased', 'The Great Gatsby', '2025-09-28 07:46:00');

INSERT INTO pending_requests (id, user_id, book_id, request_type, created_at)
VALUES
('51097348-dea3-4cbf-97a1-add77606060f', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', '2507ea3c-1d12-4405-afe7-2431b6c3d49f', 'Borrow', '2025-09-28 07:46:00'),
('24ac7eae-af16-43e6-891d-43102c0e03d7', '74bcc398-fae1-4ccd-9b84-9172e4d99b48', '11a14f7a-507e-4c54-bb3f-1b23a030c757', 'Purchase', '2025-09-28 07:46:00');

