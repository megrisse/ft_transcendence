// import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
// import { UserDto } from "src/DTOs/User/user.dto";
// import { FriendDto } from "src/DTOs/friends/friend.dto";
// import { InviteDto } from "src/DTOs/invitation/invite.dto";
// import { converationRepositroy } from "src/modules/conversation/conversation.repository";
// import { FriendsRepository } from "src/modules/friends/friends.repository";
// import { InvitesRepository } from "src/modules/invites/invites.repository";
// import { UsersRepository } from "src/modules/users/users.repository";
// import { ChannelsService, channelSearchType } from "./chat.service";
// import { channelDto } from "src/DTOs/channel/channel.dto";
// import { Request, Response } from "express";
// import { channelMessageDto } from "src/DTOs/channel/channel.messages.dto";
// import { channelParams } from "src/DTOs/channel/channel.params.dto";
// import { frontData } from "src/DTOs/chat/conversation.dto";
// import { messageRepository } from "src/modules/message/message.repository";
// import { JwtAuth } from "src/auth/Guards/jwt.guard";
// import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
// import { UserSettingsDto } from "src/DTOs/settings/settings.user.dto";
// import{ channelData } from "src/DTOs/channel/channel.response.dto";
// import { send } from "process";
// import { read } from "fs";



// @Controller('Chat')
// export class ChatController {
//     constructor (private conversation: converationRepositroy
//                 , private user : UsersRepository
//                 , private invite : InvitesRepository
//                 , private friend: FriendsRepository
//                 , private channel : ChannelsService
//                 , private message: messageRepository) {}

//     @Get('user')
//     @UseGuards(JwtAuth)
//     async getUserMessages(@Req() req: Request & {user : UserDto}, @Res() res: Response) :Promise<any> {
//         try {
//             let _user : UserDto = await this.user.getUserById(req.user.id)
//             let data : frontData[] = [];

//             if (_user && _user.IsEnabled && !_user.isAuth) {

//                 res.status(401).json('Unauthorized');
//                 return ;
//             }
//             if (_user) {
//                 let conversations : ConversationDto[] = await this.conversation.getConversations(_user.id)
//                 if  (conversations) {
//                     for (let index : number = 0; index < conversations.length; index++) {
//                         let tmp : frontData = new frontData;
//                         let _sender : UserDto = await this.user.getUserById(conversations[index].senderId)
//                         let _reciever : UserDto = await this.user.getUserById(conversations[index].recieverId)
//                         if (_sender && _reciever && !_sender.bandUsers.includes(_reciever.id) && !_reciever.bandUsers.includes(_sender.id)) {
//                             tmp.Conversationid = conversations[index].id;
//                             tmp.recieverId = (req.user.id == _sender.id) ? _reciever.id : _sender.id;
//                             tmp.reciever = (req.user.id == _sender.id) ? _reciever.username : _sender.username;
//                             tmp.senderId = (req.user.id == _sender.id) ? _sender.id : _reciever.id;
//                             tmp.sender = (req.user.id == _sender.id) ? _sender.username : _reciever.username;
//                             tmp.avatar = (req.user.username == _sender.username) ? _reciever.avatar : _sender.avatar;
//                             tmp.username = (req.user.username == _sender.username) ? _reciever.username : _sender.username;
//                             tmp.online = false;
//                             tmp.id = 0;
//                             tmp.updatedAt = conversations[index].updatedAt;
//                             tmp.messages = await this.message.getMessages(conversations[index], req.user.id);
//                             data.push(tmp);
//                         }
//                     }
//                 }
//                 else {
//                     let empty : frontData;
//                     empty.messages = [];
//                     empty.Conversationid = null;
//                     empty.avatar = null;
//                     empty.online = false;
//                     empty.username = "";
//                     empty.recieverId = "";
//                     empty.senderId = "";
//                     empty.sender = "",
//                     res.status(200).json(empty);
//                     return
//                 }
//                 data.sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());
//                 let index: number = 0
//                 data.forEach((_data) => {
//                     _data.id = index++;
//                 })
//                 res.status(200).json(data)
//                 return
//             }
//             else
//                 throw('invalid User .')
//         }
//         catch (error) {
//             res.status(400).json('invalid User ...')
//         }
//     }

//     @Get('channel')
//     @UseGuards(JwtAuth)
//     async getChannels(@Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
//         try {
//             // console.log("Sending data to : ", req.user.username);
//             let _user : UserDto = await this.user.getUserById(req.user.id)

//             if (_user && _user.IsEnabled && !_user.isAuth) {

//                 res.status(401).json('Unauthorized');
//                 return ;
//             }
//             let channelData : channelData[] = [];
//             let data = await this.channel.getUserChannelNames(req.user.id);
//             if (data){
//                 data.map((name)=> {
//                     channelData.push({
//                         channelName : name,
//                         messages : []
//                     })
//                 })
//                 res.status(200).json({"username" : req.user.username ,"channels" : channelData});
//             }
//             else
//                 res.status(400).json("no channel");
//         }
//         catch (error) {
//             res.status(400).json("no channel")
//         }
//     }


//     @Post('leaveChannel')
//     @UseGuards(JwtAuth)
//     async  leaveChannel(@Req() req: Request & {user : UserDto}, @Res() res: Response, @Body('channelName') channelName : string) {
//         let check : boolean = await this.channel.leaveChannel(req.user.id, channelName)
//         console.log("left : ", check);
//         if (check) {
//             res.status(200).json(channelName)
//         }
//         else {
//             res.status(400).json(channelName)
//         }
//     }

//     @Post('channelSearch')
//     @UseGuards(JwtAuth)
//     async channelSearch(@Req() req: Request & {user : UserDto}, @Res() res: Response, @Body('message') message : string ) : Promise<any> {
//         try {
//             let response : channelSearchType[] = await this.channel.channelSearchResults(message, req.user.id)
//             if (response) {
//                 res.status(200).json(response);
//             }
//             else {
//                 res.status(400).json(response);
//             }
//         }
//         catch (error) {
//             res.status(400).json("no channel")
//         }
//     }

//     @Post('channel')
//     @UseGuards(JwtAuth)
//     async getChannelsMessages(@Req() req: Request & {user : UserDto}, @Body('_channel') _channel : string, @Res() res: Response) : Promise<any> {
//         try {
//             console.log("recieved : ",_channel);
//             let data : channelMessageDto[] =  await this.channel.getChannelMessages(_channel, req.user.id)
//             res.status(200).json(data);
//         } catch (error) {
//             console.log("erroriiiiiii ");
//             res.status(400).json("no channel");
//         }
//     }

//     @Get('channelSettings')
//     @UseGuards(JwtAuth)
//     async   channelSettings(@Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
//         try {
//             let _user : UserDto = await this.user.getUserById(req.user.id)
//             if (_user && _user.IsEnabled && !_user.isAuth) {
//                 res.status(401).json('Unauthorized');
//                 return ;
//             }
//             let data = await this.channel.getChannelSettingsData(req.user.id);
//             console.log("final data : ", data);
//             res.status(200).json(data)
//         }
//         catch (error) {
//             res.status(400).json("error");
//         }
//     }

//     @Get('userSettings')
//     @UseGuards(JwtAuth)
//     async getUserDataForSettings(@Req() req: Request & {user: UserDto}, @Res() res: Response) : Promise<any> {
//         try {
//             let _user : UserDto = await this.user.getUserById(req.user.id)
//             if (_user && _user.IsEnabled && !_user.isAuth) {
//                 res.status(401).json('Unauthorized');
//                 return ;
//             }
//             let data : UserSettingsDto = new UserSettingsDto() ;
//             let userData : UserDto = await this.user.getUserById(req.user.id)
//             let invitations : InviteDto[] = await this.invite.getUserInviations(req.user.id)
//             let friends : FriendDto[] = await this.friend.getFriends(req.user.id);
//             if (userData) {
//                 data.bandUsers = userData.bandUsers
//                 if (invitations) {
//                     for (let index : number = 0; index < invitations.length; index++) {
//                         if (!data.bandUsers.includes(invitations[index].invitationSenderId)) {
//                             let tmp : UserDto = await this.user.getUserById(invitations[index].invitationSenderId)
//                             if (tmp) {
//                                 data.invitations.push(tmp.username)
//                             }
//                         }
//                     }
//                 }
//                 if (friends) {
//                     let tmp : UserDto;
//                     for (let index : number = 0; index < friends.length; index++) {
//                         if (friends[index].inviteRecieverId == req.user.id && !data.bandUsers.includes(friends[index].inviteSenderId)) {
//                             tmp  = await this.user.getUserById(friends[index].inviteSenderId)
//                             if (tmp)
//                                 data.friends.push({
//                                    name : tmp.username,
//                                    inGame : tmp.inGame,
//                                    online : tmp.online
//                                 });
//                         }
//                         else if (friends[index].inviteSenderId == req.user.id && !data.bandUsers.includes(friends[index].inviteRecieverId)) {
//                             tmp = await this.user.getUserById(friends[index].inviteRecieverId)
//                             if (tmp) {
//                                 data.friends.push({
//                                     name : tmp.username,
//                                     inGame : tmp.inGame,
//                                     online : tmp.online
//                                 });
//                             }
//                         }
//                     }
//                 }
//                 let banUsernames : string[] = []
//                 if (data.bandUsers) {
//                     for (let index : number = 0; index < data.bandUsers.length ; index++) {
//                         let tmpUser : UserDto = await this.user.getUserById(data.bandUsers[index]);
//                         if (tmpUser)
//                             banUsernames.push(tmpUser.username)
//                     }
//                 }
//                 data.bandUsers = banUsernames;
//                 data.user = req.user.id;
//                 res.status(200).json({data})
//             }
//             else {
//                 res.status(400).json({message : "User dosen't exist in database ..."})
//             }
//     } catch(error) {
//         res.status(400).json({message : "Error ..."})
//     }
// }


//     @Post('removeFriend')
//     @UseGuards(JwtAuth)
//     async removeFriend(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Res() res: Response) : Promise<any> {
//         try {
//             console.log("recived a request ////////////   ===> ", username);
//             let tmp : UserDto = await this.user.getUserByUsername(username)
//             if (tmp) {
//                 await this.friend.deleteFriend(tmp.id, req.user.id);
//                 res.status(200).json({username : username, action : "removeFriend"})
//                 return
//             }
//             else {
//                 res.status(400).json("no Such User ...");
//             }
//         }
//         catch(error) {
//             res.status(400).json("xxx...")
//             console.log(error);
//         }
//     }


//     @Post('invite')
//     @UseGuards(JwtAuth)
//     async SendInvitation(@Body('username') username : string, @Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> { //check here ////////
//         try {
//             if (req.user.username == username) {
//                 res.status(400).json("Sir tel3eb")
//                 return 
//             }
//             let invitation : InviteDto = {
//                 invitationRecieverId : "",
//                 invitationSenderId : "",
//                 inviteStatus : 0,
//             }
//             let tmpUser : UserDto = await this.user.getUserByUsername(username)
//             if (!tmpUser) {
//                 res.sendStatus(400).json("no invite")
//                 return 
//             }
//             invitation.invitationSenderId = req.user.id;
//             invitation.invitationRecieverId  = tmpUser.id;
//             let tmp : InviteDto = await this.invite.createInvite(invitation);
//             if (tmp == null) {
//                 res.status(400).json("Already friends .")
//                 return 
//             }
//             else {
//                 console.log("succes");
//                 res.status(200).json(tmp)
//                 return 
//             }
            
//             }
//         catch (error) {
//             console.log(error);
//             res.status(400).json({message : "Error ..."})
//         }
//     }

//     @Post('createChannel')
//     @UseGuards(JwtAuth)
//     async createChannel(@Body('name') name : string,  @Body('password') password : string, @Body('isPrivate') isPrivate : boolean, @Body('isProtected') isProtected : boolean, @Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
//         try {
//             let test : channelDto = await this.channel.createChannel(req.user.id, {
//                 "name" : name,
//                 "IsPrivate" : isPrivate,
//                 "IsProtected" : isProtected,
//                 "password" : password,
//             });
//             if (test) {
//                 console.log("created channel : ", test);
//                 if (!req.user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png'))
//                     this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png', req.user.id)
//                 res.status(200).json({"channelName": test.name, "users" : [], "bandUsers": [], "admins": [req.user.username], "mutedUsers" : []})
//             }
//             else
//                 res.status(400).json("can't create channel ....")
//         }
//         catch (error) {
//             res.status(400).json("invalid Data .")
//         } 
//     }

//     @Post('BanUser')
//     @UseGuards(JwtAuth)
//     async   BanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string, @Res() res: Response) : Promise<any> {
//         try {
//             let userToBan : UserDto = await this.user.getUserByUsername(username)
//             let requester : UserDto = await this.user.getUserById(req.user.id)
//             if (userToBan && requester && !requester.bandUsers.includes(userToBan.id)) {
//                 let tmp : string = await this.channel.BanUser(req.user, userToBan)
//                 res.status(200).json({username : username, action : "Ban"});
//                 return 
//             }
//             else {
//                 res.status(400).json("user dosen't exist in database .")
//             }
//         }   catch (error) {
//             res.status(400).json("user dosen't exist in database .")
//         }
//     }
    
//     @Post('unBanUser')
//     @UseGuards(JwtAuth)
//     async   unBanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string, @Res() res: Response) : Promise<any> {
//         try {
//             let userTounBan : UserDto = await this.user.getUserByUsername(username)
//             let requester : UserDto = await this.user.getUserById(req.user.id)
//             if (userTounBan && requester && requester.bandUsers.includes(userTounBan.id)) {
//                 let tmp :string = await this.channel.unBanUser(req.user, userTounBan)
//                 console.log(tmp);
//                 res.status(200).json({username : userTounBan,action : "unBan"})
//             }
//             else
//                 res.status(400).json("user dosen't exist in database .")    
//         } catch (error) {
//             res.status(400).json("user dosen't exist in database .")
//         }
//     }

//     @Post('mute')
//     @UseGuards(JwtAuth)
//     async muteUser(@Req() req: Request & {user : UserDto}, @Body('channelName') channelName : string, @Body('username') username : string, @Res() res: Response) : Promise<any> {
//         try { 
//             let check : boolean = await this.channel.muteUser(username, channelName, req.user.id)
//             console.log("check : ", check, " data : ", username ,  " , ", channelName);
//             if (check){
//                 console.log('mute 1');
//                 res.status(200).json(username)
//             } else {
//                 console.log('mute 2');
//                 res.status(400).json(username)
//             }
//         } catch (error) {
//             res.status(400).json(username)
//         }
//     }

//     @Post('AddUserToChannel')
//     @UseGuards(JwtAuth)
//     async addUserToChannel(@Body('channelName') channelName : string, @Body('username') username : string, @Body('password') password : string, @Req() req : Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
//         try {
//             let channel : channelDto = await this.channel.getChannelByName(channelName);
//             let tmpUser : UserDto = await this.user.getUserByUsername(username);
//             let check : boolean;
//             if (tmpUser && channel) {
//                 check = await this.channel.addUserToChannel(tmpUser.id, channel.id, req.user.id);
//             }
//             if (check)
//                 res.status(200).json(username)
//             else
//                 res.status(400).json(username)
//             }
//         catch (error){
//             console.log(error);
            
//             res.status(400).json(username)
//         } 
//     }
    

//     @Post('kick')
//     @UseGuards(JwtAuth)
//     async removeUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) : Promise<any> {
//         try {
//                 let check : boolean = await this.channel.removeUserFromChannel(req.user.id, data.channelName, data.username);
//                 if (check)
//                     res.status(200).json(data.username)
//                 else
//                     res.status(400).json(data.username)
//             }
//             catch (error) {
//                 res.status(400).json(data.username)
//             }
//         }
    
//     @Post('BanUserFromChannel')
//     @UseGuards(JwtAuth)
//     async   banUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) {
//         try {
//             console.log("ban user from channel data : ", data);
            
//             let check : boolean = await this.channel.banUserFromChannel(data.username, data.channelName, req.user.id)
//             if (check)
//                 res.status(200).json(data.username)
//             else
//                 res.status(400).json(data.username)
//         } catch (error) {
//         res.status(400).json("can't ban user .")
//         }
//     }
    
//     @Post('unBanUserFromChannel')
//     @UseGuards(JwtAuth)
//     async   unBanUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) {
//         try {
//             let check : boolean = await this.channel.unBanUserFromChannel(data.username, data.channelName, req.user.id)
//             if (check)
//                 res.status(200).json(data.username)
//             else
//                 res.status(400).json(data.username)
//         } catch (error) {
//         res.status(400).json("can't ban user .")
//         }
//     }
    

//     @Post('deleteInvite')
//     @UseGuards(JwtAuth)
//     async deleteInvite(@Req() req: Request & {user : UserDto}, @Body('username') username : string,  @Res() res: Response) : Promise<any> {
//         try {
//             let tmpUser : UserDto = await this.user.getUserByUsername(username)
//             if (!tmpUser) {
//                 res.status(400).json("user dosen't exist in database ...")
//                 return 
//             }
//             let find : InviteDto = await this.invite.getInviteToValidate(tmpUser.id, req.user.id)
//             if (find)
//                 await this.invite.deleteInvite(find.id)
//             console.log('deleted ...');
//             res.status(200).json({username : username, action : "deleteInvite"})
//         } catch (error) {
//             res.status(400).json("no invite ...")
//         }
//     }

//     @Post('joinChannel')
//     @UseGuards(JwtAuth)
//     async joinChannelRequest(@Req() req: Request & {user : UserDto}, @Body('channelName') channelName : string, @Body('password') password : string, @Res() res: Response) : Promise<any> {
//         console.log("=======> ", channelName , password);
//         let check : boolean = await this.channel.JoinUserToChannel(req.user.id, channelName, password)
//         if (check) {
//             if (!req.user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699049653/qwt5g7xtl2aqybw77drz.png")) {
//                 this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699049653/qwt5g7xtl2aqybw77drz.png", req.user.id)
//             }
//             res.status(200).json(channelName);
//         }
//         else {
//             res.status(400).json("can't join");
//         }
//     } 

//     @Post('accepteInvite')
//     @UseGuards(JwtAuth)
//     async accepteInvite(@Req() req: Request & {user : UserDto}, @Body('username') username : string, @Res() res: Response) : Promise<any> {
//         try {
//             console.log('at least got here ??');
            
//             let tmpUser : UserDto = await (await this.user.getUserByUsername(username))
//             let invitationSenderId : string = tmpUser.id
//             let invitationRecieverId : string = req.user.id
            
//             let tmp : InviteDto = await this.invite.getInviteToValidate(invitationSenderId, invitationRecieverId);
//             console.log("tmp ===> : ",tmp);
//             if (!tmp) {
//                 res.status(400).json("no Invite to accepte")
//                 return
//             }
//             console.log("invite ====> ", username);
//             await this.invite.deleteInvite(tmp.id);
//             let data : FriendDto = await this.friend.createFriend(new FriendDto(invitationRecieverId, invitationSenderId, ''), req.user.id)
//             res.status(200).json({username : username, action : "addFriend"});
//         }
//         catch (error) {
//             res.status(400).json("no Invite to accepte")
//         }
//     }
    

//     @Post('addAdminToChannel')
//     @UseGuards(JwtAuth)
//     async   addAdminToChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams, @Res() res: Response) {
//         try {
//             let check : boolean = await this.channel.AddAdminToChannel(data.username, data.channelName, req.user.id)
//             console.log("addAdminToChannel : ", check);
//             if (check)
//                 res.status(200).json(data.username)
//             else
//                 res.status(400).json(data.username)
//         }   
//         catch (error) {
//             res.status(400).json(data.username)
//         }
//     }
    
//     @Post('RemoveAdminFromChannel')
//     @UseGuards(JwtAuth)
//     async   RemoveAdminFromChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams, @Res() res: Response) {
//         try {
//             let check : boolean = await this.channel.RemoveAdminFromChannel(data.username, data.channelName, req.user.id)
//             if (check)
//                 res.status(200).json(data.username)
//             else
//                 res.status(400).json(data.username)
//         }   
//         catch (error) {
//             res.status(400).json(data.username)
//         }
//     }
//     @UseGuards(JwtAuth)
//     @Post('addPasswordToChannel')
//     async addPasswordToChannel(@Body() channelData : channelDto, @Req() req: Request & {user : UserDto}, @Res() res: Response) {
//         try {
//             let channel : channelDto = await this.channel.getChannelByName(channelData.name)
//             if (channel && channel.owner == req.user.id) {
//                 console.log("password to channel : ", channelData.password);
                
//                 await this.channel.setPasswordToChannel(channelData.password, channelData.name)
//             }
//             res.status(200).json("added Pass")
//         }
//         catch (error) {
//             res.status(400).json("can't add pass")
//         }
//     }
    
//     @UseGuards(JwtAuth)
//     @Post('removePasswordToChannel')
//     async removePasswordToChannel(@Body() data : channelParams , @Req() req: Request & {user : UserDto}, @Res() res: Response) {
//         try {
//             let channel : channelDto = await this.channel.getChannelByName(data.channelName)
//             if (channel && channel.owner == req.user.id) {
//                 await this.channel.unsetPasswordToChannel(data.channelName)
//             }
//             res.status(200).json("removed pass")
//         }
//         catch (error) {
//             res.status(400).json("can't removed pass")
//         }
//     }
// }
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserDto } from "src/DTOs/User/user.dto";
import { FriendDto } from "src/DTOs/friends/friend.dto";
import { InviteDto } from "src/DTOs/invitation/invite.dto";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { FriendsRepository } from "src/modules/friends/friends.repository";
import { InvitesRepository } from "src/modules/invites/invites.repository";
import { UsersRepository } from "src/modules/users/users.repository";
import { ChannelsService, channelSearchType } from "./chat.service";
import { channelDto } from "src/DTOs/channel/channel.dto";
import { Request, Response } from "express";
import { channelMessageDto } from "src/DTOs/channel/channel.messages.dto";
import { channelParams } from "src/DTOs/channel/channel.params.dto";
import { frontData } from "src/DTOs/chat/conversation.dto";
import { messageRepository } from "src/modules/message/message.repository";
import { JwtAuth } from "src/auth/Guards/jwt.guard";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { UserSettingsDto } from "src/DTOs/settings/settings.user.dto";
import{ channelData } from "src/DTOs/channel/channel.response.dto";
import { send } from "process";
import { read } from "fs";



@Controller('Chat')
export class ChatController {
    constructor (private conversation: converationRepositroy
                , private user : UsersRepository
                , private invite : InvitesRepository
                , private friend: FriendsRepository
                , private channel : ChannelsService
                , private message: messageRepository) {}

    @Get('user')
    @UseGuards(JwtAuth)
    async getUserMessages(@Req() req: Request & {user : UserDto}, @Res() res: Response) :Promise<any> {
        try {
            if (!req.user.isAuth && req.user.IsEnabled) {
                res.status(401).json("unAuthorized");
                return ;
            }
            let _user : UserDto = await this.user.getUserById(req.user.id)
            let data : frontData[] = [];
            if (_user) {
                let conversations : ConversationDto[] = await this.conversation.getConversations(_user.id)
                if  (conversations) {
                    for (let index : number = 0; index < conversations.length; index++) {
                        let tmp : frontData = new frontData;
                        let _sender : UserDto = await this.user.getUserById(conversations[index].senderId)
                        let _reciever : UserDto = await this.user.getUserById(conversations[index].recieverId)
                        if (_sender && _reciever && !_sender.bandUsers.includes(_reciever.id) && !_reciever.bandUsers.includes(_sender.id)) {
                            tmp.Conversationid = conversations[index].id;
                            tmp.recieverId = (req.user.id == _sender.id) ? _reciever.id : _sender.id;
                            tmp.reciever = (req.user.id == _sender.id) ? _reciever.username : _sender.username;
                            tmp.senderId = (req.user.id == _sender.id) ? _sender.id : _reciever.id;
                            tmp.sender = (req.user.id == _sender.id) ? _sender.username : _reciever.username;
                            tmp.avatar = (req.user.id == _sender.id) ? _reciever.avatar : _sender.avatar;
                            tmp.username = (req.user.id == _sender.id) ? _reciever.username : _sender.username;
                            tmp.online = false;
                            tmp.id = 0;
                            tmp.updatedAt = conversations[index].updatedAt;
                            tmp.messages = await this.message.getMessages(conversations[index], req.user.id);
                            data.push(tmp);
                        }
                    }
                }
                else {
                    let empty : frontData;
                    empty.messages = [];
                    empty.Conversationid = null;
                    empty.avatar = null;
                    empty.online = false;
                    empty.username = "";
                    empty.recieverId = "";
                    empty.senderId = "";
                    empty.sender = "",
                    res.status(200).json(empty);
                    return
                }
                data.sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());
                let index: number = 0
                data.forEach((_data) => {
                    _data.id = index++;
                })
                res.status(200).json(data)
                return
            }
            else
                throw('invalid User .')
        }
        catch (error) {
            res.status(400).json('invalid User ...')
        }
    }

    @Get('channel')
    @UseGuards(JwtAuth)
    async getChannels(@Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
        try {
            let _user : UserDto = await this.user.getUserById(req.user.id)

            if (_user && _user.IsEnabled && !_user.isAuth) {
                res.status(401).json('Unauthorized');
                return ;
            }
            let channelData : channelData[] = [];
            let data = await this.channel.getUserChannelNames(req.user.id);
            if (data){
                data.map((name)=> {
                    channelData.push({
                        channelName : name,
                        messages : []
                    })
                })
                res.status(200).json({"username" : req.user.username ,"channels" : channelData});
            }
            else
                res.status(400).json("no channel");
        }
        catch (error) {
            res.status(400).json("no channel")
        }
    }


    @Post('leaveChannel')
    @UseGuards(JwtAuth)
    async  leaveChannel(@Req() req: Request & {user : UserDto}, @Res() res: Response, @Body('channelName') channelName : string) {
        let check : boolean = await this.channel.leaveChannel(req.user.id, channelName)
        console.log("left : ", check);
        if (check) {
            res.status(200).json(channelName)
        }
        else {
            res.status(400).json(channelName)
        }
    }

    @Post('channelSearch')
    @UseGuards(JwtAuth)
    async channelSearch(@Req() req: Request & {user : UserDto}, @Res() res: Response, @Body('message') message : string ) : Promise<any> {
        try {
            let response : channelSearchType[] = await this.channel.channelSearchResults(message, req.user.id)
            if (response) {
                res.status(200).json(response);
            }
            else {
                res.status(400).json(response);
            }
        }
        catch (error) {
            res.status(400).json("no channel")
        }
    }

    @Post('channel')
    @UseGuards(JwtAuth)
    async getChannelsMessages(@Req() req: Request & {user : UserDto}, @Body('_channel') _channel : string, @Res() res: Response) : Promise<any> {
        try {
            console.log("recieved : ",_channel);
            let data : channelMessageDto[] =  await this.channel.getChannelMessages(_channel, req.user.id)
            res.status(200).json(data);
        } catch (error) {
            console.log("erroriiiiiii ");
            res.status(400).json("no channel");
        }
    }

    @Get('channelSettings')
    @UseGuards(JwtAuth)
    async   channelSettings(@Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
        try {
            let _user : UserDto = await this.user.getUserById(req.user.id)
            if (_user && _user.IsEnabled && !_user.isAuth) {
                res.status(401).json('Unauthorized');
                return ;
            }
            let data = await this.channel.getChannelSettingsData(req.user.id);
            console.log("final data : ", data);
            res.status(200).json(data)
        }
        catch (error) {
            res.status(400).json("error");
        }
    }

    @Get('userSettings')
    @UseGuards(JwtAuth)
    async getUserDataForSettings(@Req() req: Request & {user: UserDto}, @Res() res: Response) : Promise<any> {
        try {
            let _user : UserDto = await this.user.getUserById(req.user.id)
            if (_user && _user.IsEnabled && !_user.isAuth) {
                res.status(401).json('Unauthorized');
                return ;
            }
            let data : UserSettingsDto = new UserSettingsDto() ;
            let userData : UserDto = await this.user.getUserById(req.user.id)
            let invitations : InviteDto[] = await this.invite.getUserInviations(req.user.id)
            let friends : FriendDto[] = await this.friend.getFriends(req.user.id);
            if (userData) {
                data.bandUsers = userData.bandUsers
                if (invitations) {
                    for (let index : number = 0; index < invitations.length; index++) {
                        if (!data.bandUsers.includes(invitations[index].invitationSenderId)) {
                            let tmp : UserDto = await this.user.getUserById(invitations[index].invitationSenderId)
                            if (tmp) {
                                data.invitations.push(tmp.username)
                            }
                        }
                    }
                }
                if (friends) {
                    let tmp : UserDto;
                    for (let index : number = 0; index < friends.length; index++) {
                        if (friends[index].inviteRecieverId == req.user.id && !data.bandUsers.includes(friends[index].inviteSenderId)) {
                            tmp  = await this.user.getUserById(friends[index].inviteSenderId)
                            if (tmp)
                                data.friends.push({
                                    id : tmp.id,
                                   name : tmp.username,
                                   inGame : tmp.inGame,
                                   online : tmp.online
                                });
                        }
                        else if (friends[index].inviteSenderId == req.user.id && !data.bandUsers.includes(friends[index].inviteRecieverId)) {
                            tmp = await this.user.getUserById(friends[index].inviteRecieverId)
                            if (tmp) {
                                data.friends.push({
                                    id : tmp.id,
                                    name : tmp.username,
                                    inGame : tmp.inGame,
                                    online : tmp.online
                                });
                            }
                        }
                    }
                }
                let banUsernames : string[] = []
                if (data.bandUsers) {
                    for (let index : number = 0; index < data.bandUsers.length ; index++) {
                        let tmpUser : UserDto = await this.user.getUserById(data.bandUsers[index]);
                        if (tmpUser)
                            banUsernames.push(tmpUser.username)
                    }
                }
                data.bandUsers = banUsernames;
                data.user = req.user.id;
                res.status(200).json(data)
            }
            else {
                res.status(400).json({message : "User dosen't exist in database ..."})
            }
    } catch(error) {
        res.status(400).json({message : "Error ..."})
    }
}


    @Post('removeFriend')
    @UseGuards(JwtAuth)
    async removeFriend(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Res() res: Response) : Promise<any> {
        try {
            console.log("recived a request ////////////   ===> ", username);
            let tmp : UserDto = await this.user.getUserByUsername(username)
            if (tmp) {
                await this.friend.deleteFriend(tmp.id, req.user.id);
                res.status(200).json({username : username, action : "removeFriend"})
                return
            }
            else {
                res.status(400).json("no Such User ...");
            }
        }
        catch(error) {
            res.status(400).json("xxx...")
            console.log(error);
        }
    }


    @Post('invite')
    @UseGuards(JwtAuth)
    async SendInvitation(@Body('username') username : string, @Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> { //check here ////////
        try {
            if (req.user.username == username) {
                res.status(400).json("Sir tel3eb")
                return 
            }
            let invitation : InviteDto = {
                invitationRecieverId : "",
                invitationSenderId : "",
                inviteStatus : 0,
            }
            let tmpUser : UserDto = await this.user.getUserByUsername(username)
            if (!tmpUser) {
                res.sendStatus(400).json("no invite")
                return 
            }
            invitation.invitationSenderId = req.user.id;
            invitation.invitationRecieverId  = tmpUser.id;
            let tmp : InviteDto = await this.invite.createInvite(invitation);
            if (tmp == null) {
                res.status(400).json("Already friends .")
                return 
            }
            else {
                console.log("succes");
                res.status(200).json(tmp)
                return 
            }
            
            }
        catch (error) {
            console.log(error);
            res.status(400).json({message : "Error ..."})
        }
    }

    @Post('createChannel')
    @UseGuards(JwtAuth)
    async createChannel(@Body('name') name : string,  @Body('password') password : string, @Body('isPrivate') isPrivate : boolean, @Body('isProtected') isProtected : boolean, @Req() req: Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
        try {
            let test : channelDto = await this.channel.createChannel(req.user.id, {
                "name" : name,
                "IsPrivate" : isPrivate,
                "IsProtected" : isProtected,
                "password" : password,
            });
            if (test) {
                console.log("created channel : ", test);
                if (!req.user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png'))
                    this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png', req.user.id)
                res.status(200).json({"channelName": test.name, "users" : [], "bandUsers": [], "admins": [req.user.username], "mutedUsers" : []})
            }
            else
                res.status(400).json("can't create channel ....")
        }
        catch (error) {
            res.status(400).json("invalid Data .")
        } 
    }

    @Post('BanUser')
    @UseGuards(JwtAuth)
    async   BanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string, @Res() res: Response) : Promise<any> {
        try {
            if (username === req.user.username) {
                res.status(400).json("can't ban yourself")
                return
            }
            let userToBan : UserDto = await this.user.getUserByUsername(username)
            let requester : UserDto = await this.user.getUserById(req.user.id)
            if (userToBan && requester && !requester.bandUsers.includes(userToBan.id)) {
                let tmp : string = await this.channel.BanUser(req.user, userToBan)
                res.status(200).json({username : username, action : "Ban"});
                return 
            }
            else {
                res.status(400).json("user dosen't exist in database .")
            }
        }   catch (error) {
            res.status(400).json("user dosen't exist in database .")
        }
    }
    
    @Post('unBanUser')
    @UseGuards(JwtAuth)
    async   unBanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string, @Res() res: Response) : Promise<any> {
        try {
            let userTounBan : UserDto = await this.user.getUserByUsername(username)
            let requester : UserDto = await this.user.getUserById(req.user.id)
            if (userTounBan && requester && requester.bandUsers.includes(userTounBan.id)) {
                let tmp :string = await this.channel.unBanUser(req.user, userTounBan)
                console.log(tmp);
                res.status(200).json({username : userTounBan,action : "unBan"})
            }
            else
                res.status(400).json("user dosen't exist in database .")    
        } catch (error) {
            res.status(400).json("user dosen't exist in database .")
        }
    }

    @Post('mute')
    @UseGuards(JwtAuth)
    async muteUser(@Req() req: Request & {user : UserDto}, @Body('channelName') channelName : string, @Body('username') username : string, @Res() res: Response) : Promise<any> {
        try { 
            let check : boolean = await this.channel.muteUser(username, channelName, req.user.id)
            console.log("check : ", check, " data : ", username ,  " , ", channelName);
            if (check){
                console.log('mute 1');
                res.status(200).json(username)
            } else {
                console.log('mute 2');
                res.status(400).json(username)
            }
        } catch (error) {
            res.status(400).json(username)
        }
    }

    @Post('AddUserToChannel')
    @UseGuards(JwtAuth)
    async addUserToChannel(@Body('channelName') channelName : string, @Body('username') username : string, @Body('password') password : string, @Req() req : Request & {user : UserDto}, @Res() res: Response) : Promise<any> {
        try {
            let channel : channelDto = await this.channel.getChannelByName(channelName);
            let tmpUser : UserDto = await this.user.getUserByUsername(username);
            let check : boolean;
            if (tmpUser && channel) {
                check = await this.channel.addUserToChannel(tmpUser.id, channel.id, req.user.id);
            }
            if (check)
                res.status(200).json(username)
            else
                res.status(400).json(username)
            }
        catch (error){
            console.log(error);
            
            res.status(400).json(username)
        } 
    }
    

    @Post('kick')
    @UseGuards(JwtAuth)
    async removeUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) : Promise<any> {
        try {
                let check : boolean = await this.channel.removeUserFromChannel(req.user.id, data.channelName, data.username);
                if (check)
                    res.status(200).json(data.username)
                else
                    res.status(400).json(data.username)
            }
            catch (error) {
                res.status(400).json(data.username)
            }
        }
    
    @Post('BanUserFromChannel')
    @UseGuards(JwtAuth)
    async   banUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) {
        try {
            console.log("ban user from channel data : ", data);
            
            let check : boolean = await this.channel.banUserFromChannel(data.username, data.channelName, req.user.id)
            if (check)
                res.status(200).json(data.username)
            else
                res.status(400).json(data.username)
        } catch (error) {
        res.status(400).json("can't ban user .")
        }
    }
    
    @Post('unBanUserFromChannel')
    @UseGuards(JwtAuth)
    async   unBanUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams, @Res() res: Response) {
        try {
            let check : boolean = await this.channel.unBanUserFromChannel(data.username, data.channelName, req.user.id)
            if (check)
                res.status(200).json(data.username)
            else
                res.status(400).json(data.username)
        } catch (error) {
        res.status(400).json("can't ban user .")
        }
    }
    

    @Post('deleteInvite')
    @UseGuards(JwtAuth)
    async deleteInvite(@Req() req: Request & {user : UserDto}, @Body('username') username : string,  @Res() res: Response) : Promise<any> {
        try {
            let tmpUser : UserDto = await this.user.getUserByUsername(username)
            if (!tmpUser) {
                res.status(400).json("user dosen't exist in database ...")
                return 
            }
            let find : InviteDto = await this.invite.getInviteToValidate(tmpUser.id, req.user.id)
            if (find)
                await this.invite.deleteInvite(find.id)
            console.log('deleted ...');
            res.status(200).json({username : username, action : "deleteInvite"})
        } catch (error) {
            res.status(400).json("no invite ...")
        }
    }

    @Post('joinChannel')
    @UseGuards(JwtAuth)
    async joinChannelRequest(@Req() req: Request & {user : UserDto}, @Body('channelName') channelName : string, @Body('password') password : string, @Res() res: Response) : Promise<any> {
        console.log("=======> ", channelName , password);
        let check : boolean = await this.channel.JoinUserToChannel(req.user.id, channelName, password)
        if (check) {
            if (!req.user.achievements.includes("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699049653/qwt5g7xtl2aqybw77drz.png")) {
                this.user.updateAcheivement("https://res.cloudinary.com/dvmxfvju3/image/upload/v1699049653/qwt5g7xtl2aqybw77drz.png", req.user.id)
            }
            res.status(200).json(channelName);
        }
        else {
            res.status(400).json("can't join");
        }
    } 

    @Post('accepteInvite')
    @UseGuards(JwtAuth)
    async accepteInvite(@Req() req: Request & {user : UserDto}, @Body('username') username : string, @Res() res: Response) : Promise<any> {
        try {
            console.log('at least got here ??');
            
            let tmpUser : UserDto = await (await this.user.getUserByUsername(username))
            let invitationSenderId : string = tmpUser.id
            let invitationRecieverId : string = req.user.id
            
            let tmp : InviteDto = await this.invite.getInviteToValidate(invitationSenderId, invitationRecieverId);
            console.log("tmp ===> : ",tmp);
            if (!tmp) {
                res.status(400).json("no Invite to accepte")
                return
            }
            console.log("invite ====> ", username);
            await this.invite.deleteInvite(tmp.id);
            let data : FriendDto = await this.friend.createFriend(new FriendDto(invitationRecieverId, invitationSenderId, ''), req.user.id)
            res.status(200).json({username : username, action : "addFriend", id : tmpUser.id});
        }
        catch (error) {
            res.status(400).json("no Invite to accepte")
        }
    }
    

    @Post('addAdminToChannel')
    @UseGuards(JwtAuth)
    async   addAdminToChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams, @Res() res: Response) {
        try {
            let check : boolean = await this.channel.AddAdminToChannel(data.username, data.channelName, req.user.id)
            console.log("addAdminToChannel : ", check);
            if (check)
                res.status(200).json(data.username)
            else
                res.status(400).json(data.username)
        }   
        catch (error) {
            res.status(400).json(data.username)
        }
    }
    
    @Post('RemoveAdminFromChannel')
    @UseGuards(JwtAuth)
    async   RemoveAdminFromChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams, @Res() res: Response) {
        try {
            let check : boolean = await this.channel.RemoveAdminFromChannel(data.username, data.channelName, req.user.id)
            if (check)
                res.status(200).json(data.username)
            else
                res.status(400).json(data.username)
        }   
        catch (error) {
            res.status(400).json(data.username)
        }
    }
    @UseGuards(JwtAuth)
    @Post('addPasswordToChannel')
    async addPasswordToChannel(@Body() channelData : channelDto, @Req() req: Request & {user : UserDto}, @Res() res: Response) {
        try {
            let channel : channelDto = await this.channel.getChannelByName(channelData.name)
            if (channel && channel.owner == req.user.id) {
                console.log("password to channel : ", channelData.password);
                
                await this.channel.setPasswordToChannel(channelData.password, channelData.name)
            }
            res.status(200).json("added Pass")
        }
        catch (error) {
            res.status(400).json("can't add pass")
        }
    }
    
    @UseGuards(JwtAuth)
    @Post('removePasswordToChannel')
    async removePasswordToChannel(@Body() data : channelParams , @Req() req: Request & {user : UserDto}, @Res() res: Response) {
        try {
            let channel : channelDto = await this.channel.getChannelByName(data.channelName)
            if (channel && channel.owner == req.user.id) {
                await this.channel.unsetPasswordToChannel(data.channelName)
            }
            res.status(200).json("removed pass")
        }
        catch (error) {
            res.status(400).json("can't removed pass")
        }
    }
}