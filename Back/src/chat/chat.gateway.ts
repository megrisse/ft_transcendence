import { JwtService } from "@nestjs/jwt";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserDto } from "src/DTOs/User/user.dto";
import { channelDto } from "src/DTOs/channel/channel.dto";
import { channelMessageDto } from "src/DTOs/channel/channel.messages.dto";
import { messageDto } from "src/DTOs/message/message.dto";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { messageRepository } from "src/modules/message/message.repository";
import { UsersRepository } from "src/modules/users/users.repository";
import { ChannelsService } from "./chat.service";
import { chatDto } from "src/DTOs/chat/chat.dto";
import { AllExceptionsSocketFilter } from "./socket.exceptionHandler";
import { Inject, UseFilters } from "@nestjs/common";
import { MatchMaking } from "src/DTOs/User/matchMaking";
import { ClientProxy } from "@nestjs/microservices";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { use } from "passport";
import { email } from "valibot";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { log } from "console";
import { User } from "@prisma/client";
import { frontData } from "src/DTOs/chat/conversation.dto";

@WebSocketGateway(8888, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
})
@UseFilters(new AllExceptionsSocketFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor (
      private jwtService: JwtService, 
      private user: UsersRepository, 
      private conversation : converationRepositroy, 
      private message: messageRepository, 
      private channel : ChannelsService,
      private eventEmitter: EventEmitter2
      ) {
        this.clientsMap = new Map<string, Socket>();
    }
    @WebSocketServer() server: Server;
    private clientsMap: Map<string, Socket>;

    async handleConnection(client: Socket, ...args: any[]) {
      try {
        
            let cookie : string = client.client.request.headers.cookie;
            
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              let user;
              user =  this.jwtService.verify(jwt);
              if (user) {
                const test = await this.user.getUserById(user.sub);
                if (test) {
                  let exist : boolean = this.clientsMap.has(test.id);
                  if (exist)
                  {
                    client.emit('ERROR', "YOU ARE ALREADY CONNECTED ...")
                    client.disconnect();
                  }
                  else {
                    this.clientsMap.set(test.id, client);
                    // await this.user.updateUserOnlineStatus(true, user.sub)
                  }
                }
              }
            }
          else {
            client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM")
            client.disconnect();
          }
        }
        catch (error) {
          client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM")
          client.disconnect()
      }
  }

      async handleDisconnect(client: Socket) {
        try {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            let user;
            user =  this.jwtService.verify(jwt);
            if (user) {
              const test = await this.user.getUserById(user.sub)
              this.clientsMap.delete(user.sub);
            }
          }
        } catch (error) {
          return;
        }
      }

      @SubscribeMessage('channelMessage')
      async handleChannelMessage(@MessageBody() message: channelMessageDto,@ConnectedSocket() client : Socket) {
        try {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            let user;
            user = await this.jwtService.verify(jwt);
            if (user) {
              
              const _user = await this.user.getUserById(user.sub)
              if (_user) {
                  let channelId : string = "";
                  if (!_user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png')) {
                    await this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png', _user.id)
                  }
                  let tmpChannel : channelDto = await this.channel.getChannelByName(message.channelName)
                  if (tmpChannel) {
                    channelId = tmpChannel.id;
                  }
                  let check : boolean = await this.channel.canSendMessageToChannel(_user.id, message.channelName)
                  let sent : boolean = false;
                  if (check) {
                    let channelUsersIds : string[] = await this.channel.getChannelUsersId(message.channelName)
                    channelUsersIds.map((id)=> {
                    let socket: Socket = this.clientsMap.get(id)
                      if (socket && !_user.bandBy.includes(id) && !_user.bandUsers.includes(id)) {
                        message.sender = _user.username
                        sent = true;
                        socket.emit("channelMessage", message)
                      }
                    })
                  } else {
                    let socket : Socket = this.clientsMap.get(_user.id)
                    if (socket){
                      socket.emit("ERROR", "you can't Send This Message .... ");
                    }
                  }
                  if (sent) {
                    await this.channel.createChannelMessage(message, channelId, _user.id);
                }
            }
          }
        }
        else
          throw('unAuthorized Action ....')
      }
        catch (error) {
        }
      }
      

      //Invite client 
      @SubscribeMessage('INVITE')
      async HandleGameInvite(@MessageBody() recieverId : string, @ConnectedSocket() client : Socket) {
        try {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            let user;
            user =  this.jwtService.verify(jwt);
            if (user) {
              let customer : Socket = this.clientsMap.get(recieverId)
              if (customer) {
                customer.emit("GameInvite",{ recieverId: recieverId, senderId: user.sub})
              }
              else {
                client.emit("ERROR", `${recieverId} is Not Online For the moment `)
              }
            }
          }
        } catch (error) {
        }
      }
      
      @SubscribeMessage('GameInvite')
      async HandleGame(@MessageBody() res : {state: string, recieverId: string, senderId: string}, @ConnectedSocket() client : Socket) {
        try {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            let playerA : Socket;
            let playerB : Socket;
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            let user;
            user =  this.jwtService.verify(jwt);
            if (user && res.state === "OK") {
              playerA  = this.clientsMap.get(res.recieverId)
              playerB  = this.clientsMap.get(res.senderId)
              if (playerA && playerB) {
                playerA.emit("EnterGame", "OK")
                playerB.emit("EnterGame", "OK")
                this.eventEmitter.emit("chat.INVITE", {recieverId : res.recieverId, senderId: res.senderId})
              }
              else {
                if (!playerA && playerB)
                  playerB.emit("ERROR", "Can't play Game the other player wen't offline ...");
                else if (!playerB && playerA)
                  playerA.emit("ERROR", "Can't play Game the other player wen't offline ...");
              }
            }
            else {
              playerA  = this.clientsMap.get(res.recieverId)
              playerB  = this.clientsMap.get(res.senderId)
              if (playerA && playerB) {
                playerA.emit("ERROR", "invite Canceled .")
                playerB.emit("ERROR", "invite Canceled .")
              }
              else {
                client.emit("ERROR", "invitation Declined ...")
              }
            }
          }
        } catch (error) {
          client.emit("ERROR", "TRY AGAIN LATER ....")
        }
      }

      @SubscribeMessage('newMessage')
      async handleNewConversation(@MessageBody() message: messageDto, @ConnectedSocket() client : Socket) {
        try{
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            let user;
            user =  this.jwtService.verify(jwt)
            if (user) {
              let _user : UserDto = await this.user.getUserByUsername(message.recieverId)
              if (!_user) {
                client.emit('ERROR', `No such Nick ${message.recieverId}`)
                return
              }
              const sender = await this.user.getUserById(message.senderId);
              const reciever = await this.user.getUserByUsername(message.recieverId);;
              
              if (_user.bandUsers.includes(reciever.id) || _user.bandBy.includes(reciever.id) || sender.id == reciever.id) {
                client.emit("ERROR", "can't send message to this user ....")
                return
              }
              let senderConversations : ConversationDto[] = await this.conversation.getConversations(sender.id)
              let recieverConversations : ConversationDto[] = await this.conversation.getConversations(reciever.id)
                let conversationExist : ConversationDto = await this.conversation.conversationExist(sender.id, reciever.id)
                if (conversationExist) {
                  client.emit("RecieveMessage", {
                    isOwner : true,
                    content : message.content,
                    avatar : sender.avatar,
                    senderId : sender.id,
                    sender : sender.username,
                    reciever : reciever.username,
                    recieverId : reciever.id,
                    date : conversationExist.updatedAt,
                    conversationId : conversationExist.id,
                  })
                  let recieverSocket : Socket = this.clientsMap.get(reciever.id)
                  if (recieverSocket) {
                    recieverSocket.emit("RecieveMessage", {
                      isOwner : false,
                      content : message.content,
                      avatar : sender.avatar,
                      senderId : sender.id,
                      sender : sender.username,
                      reciever : reciever.username,
                      recieverId : reciever.id,
                      date : conversationExist.updatedAt,
                      conversationId : conversationExist.id,
                    })
                  }
                  return
                }
                const tmp : ConversationDto = await this.conversation.createConversation(reciever.id, sender.id)
                message.recieverId = _user.id;
                client.emit("NewConversation",{
                  Conversationid : tmp.id,
                  id      : senderConversations.length,
                  avatar : reciever.avatar,
                  username : reciever.username,
                  senderId : sender.id,
                  sender : sender.username,
                  reciever : reciever.username,
                  recieverId : reciever.id,
                  online : reciever.online,
                  updatedAt : tmp.updatedAt,
                  messages : [
                    {
                      isOwner : true,
                      content : message.content,
                      avatar : sender.avatar,
                      senderId : sender.id,
                      sender : sender.username,
                      reciever : reciever.username,
                      recieverId : reciever.id,
                      date : tmp.updatedAt,
                      conversationId : tmp.id,
                    }
                  ]
                })
                let recieverSocket = this.clientsMap.get(reciever.id)
                if (recieverSocket) {
                  recieverSocket.emit("NewConversation",{
                    Conversationid : tmp.id,
                    id : recieverConversations.length,
                    avatar : sender.avatar,
                    username : sender.username,
                    senderId : reciever.id,
                    sender : reciever.username,
                    reciever : sender.username,
                    recieverId : sender.id,
                    online : sender.online,
                    updatedAt : tmp.updatedAt,
                    messages : [
                      {
                        isOwner : false,
                        content : message.content,
                        avatar : sender.avatar,
                        senderId : sender.id,
                        sender : sender.username,
                        reciever : reciever.username,
                        recieverId : reciever.id,
                        date : tmp.updatedAt,
                        conversationId : tmp.id,
                      }
                    ]
                  })
                }
                message.conversationId = tmp.id
                await this.message.CreateMesasge(message);
              }
            }} catch (error) {
              client.emit("ERROR", "error ...")
            }
      }


      @SubscribeMessage('SendMessage')
        async hanldeMessage(@MessageBody() message: messageDto, @ConnectedSocket() client : Socket) {
          try {
            let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              let user;
              user =  this.jwtService.verify(jwt);
              if (user) {
                  const sender = await this.user.getUserById(message.senderId);
                  const reciever = await this.user.getUserById(message.recieverId);
                  if (!sender || !reciever || (message.senderId == message.recieverId)) {
                    client.emit("ERROR", "YOU CAN't Text yourself Go buy a Note Book !")
                    return ;
                  }
                  if (reciever.bandUsers.includes(sender.id)) {
                    throw("a banned user can't send messages .");
                  }
                  let achievementCheck : number = await this.conversation.numberOfConversations(sender.id)
                  if (achievementCheck > 0) {
                    if (!sender.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png')) {
                      await this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png', sender.id)
                  }
                }
                let conversations : string = await this.conversation.findConversations(reciever.id, sender.id);
                if (conversations.length > 0) {
                  message.conversationId = conversations;
                  await this.sendToSocket(message, sender.username); 
                }
                else {
                  const tmp : ConversationDto = await this.conversation.createConversation(reciever.id, sender.id)
                  await this.sendToSocket(message, sender.username);
                }
              }
        }
        else {
          throw ('invalid Request : not Authorized ...')
        }
        }
        catch (error) {}
      }
      
      async sendToSocket(message: messageDto, Sender : string) {
        try {
          let _reciever : UserDto = await this.user.getUserById(message.recieverId)
          let _sender : UserDto = await this.user.getUserByUsername(Sender)
          if (_reciever && _sender && !_reciever.bandBy.includes(_sender.id) && !_reciever.bandUsers.includes(_sender.id)) {
            const socket: Socket = this.clientsMap.get(_reciever.id);
            await this.message.CreateMesasge(message);
            if (socket) {
              this.conversation.updateConversationDate(message.conversationId)
              let data : chatDto = new chatDto;
              data.content = message.content
              data.sender = _sender.username
              data.senderId = message.senderId
              data.reciever = _reciever.username
              data.recieverId = _reciever.id
              data.avatar = _sender.avatar
              data.isOwner = false
              data.conversationId = message.conversationId 
              socket.emit('RecieveMessage', data);
            } else {
              this.conversation.updateConversationDate(message.conversationId)
            }
          }
          }
          catch (error) {
          }
        }
}