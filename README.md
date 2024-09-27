


### DB CODE:

```

CREATE TABLE usersLogin (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


show usersLogin;

select * from usersLogin;

```

### Node Code:

```
node server.js

Server is running on http://localhost:3000

```

