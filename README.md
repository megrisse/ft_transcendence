# Real-time Online Pong Tournament Website

This project implements a real-time online Pong tournament website, allowing users to compete and connect with each other.

Technologies
Backend: Nest.js
Frontend: React, Next.js
Database: PostgreSQL
Deployment: Docker
Features
Real-time gameplay: Utilizes WebSockets for low-latency updates during matches.
Chat functionality: Enables communication between players through individual and group chats.
Friend system: Allows users to add and manage friends for social interaction.
Guilds: Creates communities within the platform for players to connect and organize.
Ranking system: Tracks player performance and displays leaderboards for competition.
Setup
Clone the repository:
```bash
git clone https://github.com/megrisse/ft_transcendence.git
```
Install dependencies:
```Bash
cd ft_transcendence
npm install
```
Configure database:
Create a .env file in the root directory.
Add your PostgreSQL connection details to the .env file (refer to Nest.js documentation for environment variables).
Run the application:
For development:
```Bash
npm run start:dev
```
For production (using Docker):
```Bash
docker-compose up
```
Contributing
We welcome contributions to this project! Please see the CONTRIBUTING.md file for guidelines on how to contribute.

License
This project is licensed under the MIT License. See the LICENSE file for details.