# Server part of todo

To make server ready for docker-compose:

1. Create '.env' file in the root, initialize three variables in it: `PORT=3000` (Only that), `URL=mongodb://mongo:27017/tododb` (MongodDB database path you can change name), `SECRET_KEY` (for JWT-token, as a salt)
