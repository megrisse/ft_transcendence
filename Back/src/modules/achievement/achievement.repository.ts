import { Injectable } from "@nestjs/common";
import { AchievementDto } from "src/DTOs/achievement/achievement.dto";
import { PrismaService } from "src/modules/database/prisma.service";
import { FileService } from "../readfile/readfile";


@Injectable()
export class AchievementRepository {
    constructor (private readonly prisma: PrismaService) {}
    async CreateAchievment (file : FileService){
        const achievements : AchievementDto[] = [
            {
                title : 'play your first game', // Game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322232/umkxxvgtxbe2bowynp8v.png',
            },
            {
                title : 'add your first friend', // invitation
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323498/kncbovhc1fbuqkilrgjm.png',
            },
            {
                title : 'win a game', // game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png',
            },
            {
                title : 'play 3 games', // game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png',
            },
            {
                title : 'reach level 10', // game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323588/f535f2mtj54fjeejkb7t.png',
            },
            {
                title : 'get 10 friends', // invitation
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322969/drbaiumfsn0dp6ij908s.png',
            },
            {
                title : 'send your first message', // chat
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png',
            },
            {
                title : 'join your first channel', // chat
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699049653/qwt5g7xtl2aqybw77drz.png', // need to be changed
            },
            {
                title : 'create your first channel', // chat
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png',
            },
            {
                title : 'customize your avatar', // settings
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322922/ds3v9fsgo1dlujvh8otp.png',
            },
            {
                title : 'play 100 games', // game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png',
            },
            {
                title : 'play 10 games', // game
                unlocked : false,
                icon : 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png',
            },
        ];
        achievements.forEach(async (data)=> {
                await this.prisma.achievement.create({data});
            })
            
            return achievements;
    }

    async getAchievementImage(id: string): Promise<string | null> {
        let tmp : AchievementDto[] = await this.prisma.achievement.findMany()
        if (tmp){
            tmp.forEach((achievemnt)=> {
                if (achievemnt.title == id)
                    id = achievemnt.icon
            })
            return id;
        }
        return null
    }


    async getAchievements() : Promise<AchievementDto[]> {
        return await this.prisma.achievement.findMany();
    }

}