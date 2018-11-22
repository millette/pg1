## About postgresql users

- superuser is `postgres`
- `visitor` user is anonymous
- `web` user owns `things` db
- `things` is the main database

grant select on all tables in schema public to PUBLIC;
