import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MatchDto } from 'src/DTOs/Match/match.dto';
import { matchModel } from 'src/DTOs/Match/match.model';
import { ProfileID } from 'src/DTOs/User/user.ProfileWithId';
import { UserDto } from 'src/DTOs/User/user.dto';
import { UserData } from 'src/DTOs/User/user.profileData';
import { AchievementDto } from 'src/DTOs/achievement/achievement.dto';
import { FriendDto } from 'src/DTOs/friends/friend.dto';
import { JwtAuth } from 'src/auth/Guards/jwt.guard';
import { AchievementRepository } from 'src/modules/achievement/achievement.repository';
import { FriendsRepository } from 'src/modules/friends/friends.repository';
import { InvitesRepository } from 'src/modules/invites/invites.repository';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { FileService } from 'src/modules/readfile/readfile';
import { UsersRepository } from 'src/modules/users/users.repository';

@Controller('Profile')
export class ProfileController {
    constructor (private user: UsersRepository,
                private achievement: AchievementRepository,
                private match: MatchesRepository,
                private file : FileService,
                private friend: FriendsRepository,
                private invite : InvitesRepository){}

    @Get()
    @UseGuards(JwtAuth)
    async GetUserData(@Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<void> {
        try {
            if (!req.user.isAuth && req.user.IsEnabled) {
                res.status(401).json("unAuthorized");
                return ;
            }
        const _achievements : AchievementDto[] = await this.achievement.getAchievements();
        if (!_achievements.length)
            await this.achievement.CreateAchievment(this.file);
        const _matches =  await this.match.findMatchesByUserId(req.user.id)
        
        let tmpUser : UserDto  = await this.user.getUserById(req.user.id)
        if (!tmpUser)
            throw ('no such user.')
        let profileData : UserData = {
            userData : tmpUser,
            achievements : _achievements,
            matches : [],
            freinds : []
        }
        profileData.matches = [];
        profileData.achievements.forEach((_achievement) => {
            if (profileData.userData.achievements.includes(_achievement.icon)) {
                _achievement.unlocked = true;
            }
        })
        const tmpMatches : matchModel[] = await Promise.all (_matches.map( async (match)=> {
            let _playerAAvatar : string;
            let _playerBAvatar : string;
            let _playerAAUsername : string;
            let _playerBAUsername : string;

            if (match.playerAId == profileData.userData.id) {
                const tmpUser : UserDto = await this.user.getUserById(match.playerBId)
                _playerAAUsername = profileData.userData.username;
                _playerAAvatar = profileData.userData.avatar;
                _playerBAUsername = tmpUser.username;
                _playerBAvatar = tmpUser.avatar;
            }
            else {
                const tmpUser : UserDto = await this.user.getUserById(match.playerAId)
                _playerBAUsername = profileData.userData.username;
                _playerBAvatar = profileData.userData.avatar;
                _playerAAUsername = tmpUser.username;
                _playerAAvatar = tmpUser.avatar;
            }
            let tmp : matchModel = {
                playerAId : match.playerAId,
                playerBId : match.playerBId,
                playerAScore : match.playerAScore,
                playerBScore : match.playerBScore,
                playerAAvatar : _playerAAvatar,
                playerBAvatar : _playerBAvatar,
                playerAUsername : _playerAAUsername,
                playerBUsername : _playerBAUsername,
            };
            return tmp;
        }))
        let FriendsList = await this.friend.getFriends(req.user.id);
        for (let index : number = 0; index < FriendsList.length ; index++) {
            profileData.freinds.push({
                username : (req.user.id != FriendsList[index].inviteSenderId) ? FriendsList[index].inviteSender.username : FriendsList[index].inviteReciever.username,
                id  : (req.user.id != FriendsList[index].inviteSenderId ) ? FriendsList[index].inviteSenderId : FriendsList[index].inviteRecieverId,
                Online : (req.user.id != FriendsList[index].inviteSenderId ) ? FriendsList[index].inviteSender.online : FriendsList[index].inviteReciever.online,
                avatar : (req.user.id != FriendsList[index].inviteSenderId ) ? FriendsList[index].inviteSender.avatar : FriendsList[index].inviteReciever.avatar,
                InGame : false,
            })
        }
        profileData.matches = tmpMatches.filter((match) => match !== null);
        let allUsers : UserDto[] = await this.user.getAllUsers();
        for (let index : number = 0 ; index < allUsers.length; index++) {
            if (allUsers[index].id === req.user.id) {
                profileData.userData.rank = index + 1;
            }
        }
        res.status(200).json(profileData)
        }
        catch(error) {
            res.status(400).json('Invalid data .')
        }
}

    @Get(':id')
    @UseGuards(JwtAuth)
    async AnassTest(@Req() req: Request & {user : UserDto}, @Res() res: Response, @Param('id') id : string) : Promise<any> {
        try {
            if (!req.user.isAuth && req.user.IsEnabled) {
                res.status(401).json("unAuthorized");
                return ;
            }
            const _achievements : AchievementDto[] = await this.achievement.getAchievements();
            if (!_achievements.length)
                await this.achievement.CreateAchievment(this.file);
            const _matches: MatchDto[] =  await this.match.findMatchesByUserId(id)
            
            let tmpUser : UserDto  = await this.user.getUserById(id)
            if (!tmpUser)
                throw ('no such user.')
            let profileData : ProfileID = {
                userData : tmpUser,
                achievements : _achievements,
                matches : [],
                isBlocked : false,
                isFriend : false,
            }
            profileData.matches = [];
            profileData.achievements.forEach((_achievement) => {
                if (profileData.userData.achievements.includes(_achievement.icon)) {
                    _achievement.unlocked = true;
                }
            })
            const tmpMatches : matchModel[] = await Promise.all (_matches.map( async (match)=> {
                let _playerAAvatar : string;
                let _playerBAvatar : string;
                let _playerAAUsername : string;
                let _playerBAUsername : string;
    
                if (match.playerAId == profileData.userData.id) {
                    const tmpUser : UserDto = await this.user.getUserById(match.playerBId)
                    _playerAAUsername = profileData.userData.username;
                    _playerAAvatar = profileData.userData.avatar;
                    _playerBAUsername = tmpUser.username;
                    _playerBAvatar = tmpUser.avatar;
                }
                else {
                    const tmpUser : UserDto = await this.user.getUserById(match.playerAId)
                    _playerBAUsername = profileData.userData.username;
                    _playerBAvatar = profileData.userData.avatar;
                    _playerAAUsername = tmpUser.username;
                    _playerAAvatar = tmpUser.avatar;
                }
                let tmp : matchModel = {
                    playerAId : match.playerAId,
                    playerBId : match.playerBId,
                    playerAScore : match.playerAScore,
                    playerBScore : match.playerBScore,
                    playerAAvatar : _playerAAvatar,
                    playerBAvatar : _playerBAvatar,
                    playerAUsername : _playerAAUsername,
                    playerBUsername : _playerBAUsername,
                };
                    return tmp;
            }))
                profileData.matches = tmpMatches.filter((match) => match !== null);
                let isBand : boolean = (req.user.bandUsers.includes(id) || req.user.bandBy.includes(id))
                let isFreind : boolean = await this.friend.isFriend(req.user.id, id);
                let inviteSent  : boolean = await this.invite.hasInvite(req.user.id, id)
                profileData.isBlocked = isBand
                profileData.isFriend = isFreind
                let allUsers : UserDto[] = await this.user.getAllUsers();
                for (let index : number = 0 ; index < allUsers.length; index++) {
                    if (allUsers[index].id === id) {
                        profileData.userData.rank = index + 1;
                    }
                }
                if (inviteSent)
                    profileData.isFriend = true;
                if (isBand) {
                    res.status(401).json("UnAuthorized ....")
                    return ;
                }
                res.status(200).json(profileData)
            }
            catch(error) {
                res.status(400).json('Invalid data .')
            }
    }

    @Post('addFriend')
    @UseGuards(JwtAuth)
    async addFriend(@Body() data : FriendDto, @Req() req: Request & {user: UserDto}) : Promise<FriendDto> {
        return this.friend.createFriend(data, req.user.id)
    }
}