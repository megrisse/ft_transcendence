#!/bin/bash

npx prisma generate || exit 1
npx prisma db push || exit 1
npm run build || exit 1
npm run start


# #!/bin/bash

# npm run prisma:generate

# npx prisma db push

# npm run build

# npm run start