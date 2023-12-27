import { Module } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { SettingsModule } from './settings/settings.module';
import { ProfileModule } from "./profile/profile.module";
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { HomeModule } from './home/home.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module";

import { EventEmitterModule } from '@nestjs/event-emitter';
import { GameGeteway } from "./game/game.gateway";
import { UsersRepository } from "./modules/users/users.repository";
import { SideBarGateway } from "./modules/sidebar/sidebar.gatway";
import { SideBarModule } from "./modules/sidebar/sidebar.module";


@Module({
  imports: [
    AuthModule, 
    GameModule, 
    SettingsModule, 
    ProfileModule, 
    ChatModule, 
    HomeModule, 
    CloudinaryModule, 
    LeaderboardModule, 
    SearchModule,
    SideBarModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: []
})
export class AppModule {}