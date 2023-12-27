import { Injectable } from "@nestjs/common";
import { AchievementDto } from "src/DTOs/achievement/achievement.dto";

@Injectable()

export class achievementModule {
    getAchievement() : AchievementDto[] {
        const achievements : AchievementDto[] = [
            {
                title : 'win first game',
                unlocked : false,
                icon : 'firstGame.png',
            },
            {
                title : 'add your first friend',
                unlocked : false,
                icon : 'firstFriend.png',
            },
            {
                title : 'win with a clean score',
                unlocked : false,
                icon : 'cleanScore.png',
            },
            {
                title : 'win 3 games',
                unlocked : false,
                icon : 'threeGamesWin.png',
            },
            {
                title : 'reach level 10',
                unlocked : false,
                icon : 'levelTen.png',
            },
            {
                title : 'get 10 friends',
                unlocked : false,
                icon : 'tenFriends.png',
            },
            {
                title : 'send your first message',
                unlocked : false,
                icon : 'firstMessage.png',
            },
            {
                title : 'join your first channel',
                unlocked : false,
                icon : 'firstChannel.png',
            },
            {
                title : 'creat your first channel',
                unlocked : false,
                icon : 'firstChannel.png',
            },
            {
                title : 'customize your avatar',
                unlocked : false,
                icon : 'newAvatar.png',
            },
            {
                title : '3 games strick',
                unlocked : false,
                icon : 'threeGamesStrick.png',
            },
            {
                title : 'win 10 games',
                unlocked : false,
                icon : 'tenGamesWin.png',
            },
        ];
        return achievements;
    } 
}