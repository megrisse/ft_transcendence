import { JwtService } from "@nestjs/jwt";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserDto } from "src/DTOs/User/user.dto";
import { UsersRepository } from "src/modules/users/users.repository";
import { UseFilters } from "@nestjs/common";
import { AllExceptionsSocketFilter } from "src/chat/socket.exceptionHandler";
import { PrismaService } from "../modules/database/prisma.service";
import { ConfigService } from "@nestjs/config";
import { UserSettingsDto } from "src/DTOs/settings/settings.user.dto";
import { InviteDto } from "src/DTOs/invitation/invite.dto";
import { FriendDto } from "src/DTOs/friends/friend.dto";
import { InvitesRepository } from "../modules/invites/invites.repository";
import { FriendsRepository } from "../modules/friends/friends.repository";


@WebSocketGateway(8800, {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  })
@UseFilters(new AllExceptionsSocketFilter())
export class InvitesGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private jwtService: JwtService,
        private user: UsersRepository,
        private prisma : PrismaService,
        private configService: ConfigService,
        private invite : InvitesRepository,
        private friend : FriendsRepository
    ) {
        this.clientsMap = new Map<string, Socket>();
    }
    @WebSocketServer() server: Server;
    private clientsMap: Map<string, Socket>;

    async handleConnection(client: Socket, ...args: any[]) {
        try {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            console.log("cookie : ", cookie);
            const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET') });
            console.log("user :", user);
            if (user) {
                    const test: UserDto  = await this.user.getUserById(user.sub);
                    if (test) {
                        let exist : boolean = this.clientsMap.has(test.id);
                    if (exist)
                    {
                        client.disconnect();
                    }
                    else {
                        console.log("new Connection : ", test.username);
                        this.clientsMap.set(test.id, client);
                    }
                  }
                }
              }
            // else {
            //   // client.disconnect();
            // }
          }
          catch (error) {
            // console.log("error in socket :", error);
            // client.disconnect()
        }
    }
    
    async handleDisconnect(client: Socket) {
        try {
            console.log("disconnected ...");            
            let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
            const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET') });
            if (user) {
              const test: UserDto  = await this.user.getUserById(user.sub)
              this.clientsMap.delete(test.id);
            }
          }
        } catch (error) {
        }
    }

    
//       async getUserDataForSettings(id : string, client : Socket) : Promise<boolean> {
//         try {
//             let _user : UserDto = await this.user.getUserById(id)
//             if (_user && _user.IsEnabled && !_user.isAuth) {
//                 return false;
//             }
//             let data : UserSettingsDto = new UserSettingsDto() ;
//             let invitations : InviteDto[] = await this.invite.getUserInviations(id)
//             let friends : FriendDto[] = await this.friend.getFriends(id);
//             if (_user) {
//               data.bandUsers = _user.bandUsers
//               if (invitations) {
//                   for (let index : number = 0; index < invitations.length; index++) {
//                       if (!data.bandUsers.includes(invitations[index].invitationSenderId)) {
//                           let tmp : UserDto = await this.user.getUserById(invitations[index].invitationSenderId)
//                           if (tmp) {
//                               data.invitations.push(tmp.username)
//                           }
//                       }
//                   }
//               }
//               if (friends) {
//                   let tmp : UserDto;
//                   for (let index : number = 0; index < friends.length; index++) {
//                       if (friends[index].inviteRecieverId == id && !data.bandUsers.includes(friends[index].inviteSenderId)) {
//                           tmp  = await this.user.getUserById(friends[index].inviteSenderId)
//                           if (tmp)
//                               data.friends.push({
//                                   id : tmp.id,
//                                  name : tmp.username,
//                                  inGame : tmp.inGame,
//                                  online : tmp.online
//                               });
//                       }
//                       else if (friends[index].inviteSenderId == id && !data.bandUsers.includes(friends[index].inviteRecieverId)) {
//                           tmp = await this.user.getUserById(friends[index].inviteRecieverId)
//                           if (tmp) {
//                               data.friends.push({
//                                   id : tmp.id,
//                                   name : tmp.username,
//                                   inGame : tmp.inGame,
//                                   online : tmp.online
//                               });
//                           }
//                       }
//                   }
//               }
//               let banUsernames : string[] = []
//               if (data.bandUsers) {
//                   for (let index : number = 0; index < data.bandUsers.length ; index++) {
//                       let tmpUser : UserDto = await this.user.getUserById(data.bandUsers[index]);
//                       if (tmpUser)
//                           banUsernames.push(tmpUser.username)
//                   }
//               }
//               data.bandUsers = banUsernames;
//               data.user = id;
//               client.emit("fetch", data);
//               return true
//           }
//           else {
//               return false
//           }
//     } catch(error) {
//       console.log("here .........., ", error);
//       return false
//     }
//   }

//   @SubscribeMessage('cancelInvite')
//   async handleCancelInvite(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
//     try {
//       console.log("received cancel invite event .");
//       let cookie : string = client.client.request.headers.cookie;
//       if (cookie) {
//       const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
//       if (user) {
//         const test: UserDto  = await this.user.getUserById(user.sub)
//         let tmpUser : UserDto = await this.user.getUserByUsername(username)
//         if (!tmpUser) {
//           client.emit("ERROR","can't cancel ...")
//           return 
//         }
//         let find : InviteDto = await this.invite.getInviteToValidate(tmpUser.id, test.id)
//         if (find) {
//           await this.invite.deleteInvite(find.id)
//         }
//       }
//     }
//   } catch (error) {
//     console.log("error , ", error);
//     // client.emit("ERROR", "")
//   }
//   }
  
//   @SubscribeMessage('accepteInvite')
//   async handleAccepteInvite(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
//     try {
//       console.log("received accepte invite event .");
//       let cookie : string = client.client.request.headers.cookie;
//       if (cookie) {
//         const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
//         if (user) {
//           const test : UserDto = await this.user.getUserById(user.sub)
//           let tmpUser : UserDto = await this.user.getUserByUsername(username)
//           let invitationSenderId : string = tmpUser.id
//           let invitationRecieverId : string = test.id
//           let tmp : InviteDto = await this.invite.getInviteToValidate(invitationSenderId, invitationRecieverId);
//           if (tmp) {
//             console.log("username  : ", username);
//             let inviteSenderSocket : Socket = this.clientsMap.get(tmpUser.id)
//             if (inviteSenderSocket) {
//               console.log("******, ", tmpUser.username);
//               console.log("******, ", test.username);
//               inviteSenderSocket.emit("InviteAccepted", {"name": test.username, "online" : test.online, "inGame" : test.inGame, "id" : test.id})
//               client.emit("InviteAccepted", {"name": tmpUser.username, "online" : tmpUser.online, "inGame" : tmpUser.inGame, "id" : tmpUser.id})
//               // client.emit("InviteAccepted", {"name": tmpUser.username, "online" : tmpUser.online, "inGame" : tmpUser.inGame, "id": tmpUser.id})
//               console.log("1");
//             }
//             else {
//               client.emit("InviteAccepted", {"name": tmpUser.username, "online" : tmpUser.online, "inGame" : tmpUser.inGame, "id": tmpUser.id})
//               console.log("2");
//             }
//             await this.invite.deleteInvite(tmp.id);
//             let data : FriendDto = await this.friend.createFriend(new FriendDto(invitationRecieverId, invitationSenderId, ''), test.id)
//           }
//       }
//     }
//   }
//   catch (error) {
//     console.log("error , ", error); // need to remove
//   }
//   }

  @SubscribeMessage('friend')
  async handleFriend(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
    try {
        console.log("username received : ", username);
        let cookie : string = client.client.request.headers.cookie;
        if (cookie) {
        const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
        if (user) {
          const test : UserDto = await this.user.getUserById(user.sub)
        let tmpUser : UserDto = await this.user.getUserByUsername(username)
        if (!tmpUser || !test || test.id === tmpUser.id) {
            client.emit("ERROR", "THERE'S NO USER WITH THAT NAME ...")
            return
        }else {
            let receiver : Socket = this.clientsMap.get(tmpUser.id)
            if (receiver) {
                receiver.emit("friend", {"name" : test.username})
            }
        }
        }
      }
    }
    catch (error) {
      // console.log("1, ", error);
      
      // res.status(400).json({message : "Error ..."})
    }
  }

  @SubscribeMessage('invite')
  async handleInvite(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
    try {
        console.log("username received : ", username);
        let cookie : string = client.client.request.headers.cookie;
        if (cookie) {
        const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
        if (user) {
          const test : UserDto = await this.user.getUserById(user.sub)
        // if (test.username == username) {
        //   client.emit("ERROR", "you can't invite yourself ....")
        //   return
        // }
        // let invitation : InviteDto = {
        //     invitationRecieverId : "",
        //     invitationSenderId : "",
        //     inviteStatus : 0,
        // }
        let tmpUser : UserDto = await this.user.getUserByUsername(username)
        if (!tmpUser || !test || test.id === tmpUser.id) {
            client.emit("ERROR", "THERE'S NO USER WITH THAT NAME ...")
            return
        }else {
            let receiver : Socket = this.clientsMap.get(tmpUser.id)
            if (receiver) {
                receiver.emit("invite", {"name" : test.username})
            }
        }
        }
      }
    }
    catch (error) {
      // console.log("1, ", error);
      
      // res.status(400).json({message : "Error ..."})
    }
  }

//   @SubscribeMessage('removeFriend')
//   async handleRemoveFreind(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
//     try {
//         let cookie : string = client.client.request.headers.cookie;
//           if (cookie) {
//           const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
//           if (user) {
//             const test: UserDto  = await this.user.getUserById(user.sub)
//         let tmp : UserDto = await this.user.getUserByUsername(username)
//         if (tmp) {
//             await this.friend.deleteFriend(tmp.id, test.id);
//             client.emit("removeFriend", {"username": username})
//             let otherUser : Socket = this.clientsMap.get(tmp.id)
//             if (otherUser)
//               otherUser.emit("removeFriend", {"username": username})
//             return
//         }
//         else {
//           client.emit("ERROR", "NO SUCH USER.")
//         }
//       }
//     }
//   }
//   catch(error) {
//   }
//   }
 
//   @SubscribeMessage('deleteInvite')
//   async sendDelete(@MessageBody('username') username : string, @ConnectedSocket() client : Socket) {
//     try {
//         let cookie : string = client.client.request.headers.cookie;
//           if (cookie) {
//           const user =  this.jwtService.verify( cookie.substring(cookie.indexOf('=') + 1), { secret: this.configService.get<string>('JWTSECRET')});
//           if (user) {
//             const test: UserDto  = await this.user.getUserById(user.sub)
//         let tmp : UserDto = await this.user.getUserByUsername(username)
//         if (tmp) {
//           client.emit("deleteInvite", {"username": username})
//         }
//         else {
//           client.emit("ERROR", "NO SUCH USER.")
//         }
//       }
//     }
//   }
//   catch(error) {
//   }
//   }


  // @SubscribeMessage('newInvite')
  // async handleNewInvite(@MessageBody() username : string, @ConnectedSocket() client : Socket) {
  //     try {
  //         console.log("username ", username);
  //         client.emit("newInvite", "you sent an invite ...")
  //     } catch (error) {
  //     }
  }
// }
