#!/bin/bash

npx prisma db push
npm run build
npm run start