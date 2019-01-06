## About postgresql users

- superuser is `postgres`
- `visitor` user is anonymous
- `web` user owns `things` db
- `robin` is a regular user
- `things` is the main database
- `users` is the table where `user` column matches `current_user` (RLS)

grant select on all tables in schema public to PUBLIC;
