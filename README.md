# SvelteKit Local Auth

Full stack sveltekit local authentication using prisma and the sveltekit node adapter

## Ideas

- Template for building secure, self-hosted monoliths
- Sign up, log in, log out, and change password endpoints
- Uses cookies and a session table to persist auth (don't do this for real apps, use redis)
- Prisma ORM and schema
- Bcrypt for handling passwords

## Notes

- If you're not using SQLite, update the provider in `prisma/schema.prisma`
- Remove `migrations` from `.gitignore` to track migrations once setting up prisma

## Usage

```sh
# after prisma set up

# create and apply migrations from schema
npx prisma migrate dev --name init

# development
yarn dev

# production
yarn build

node build

# docker
docker build -t sk-auth .

docker run --rm -it -p 3000:3000 \
    -v `pwd`/prisma/dev.db:/app/dev.db \
    -e DATABASE_URL="file:/app/dev.db" \
    sk-auth
```

## Reference

- [prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgres)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
