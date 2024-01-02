import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/DTOs/User/user.dto';
import { channelDto } from 'src/DTOs/channel/channel.dto';
import { channelMessageDto } from 'src/DTOs/channel/channel.messages.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { channelOnUser } from 'src/DTOs/channel/channelOnUser.dto';
import { number } from 'zod';


export type channelSearchType = {
  name : string;
  isProtected : boolean;
};

export type ChannelOnUserCreateInput = {
  userId: string;
  channelId: string;
  isAdmin?: boolean;
  isOwner?: boolean;
  isBanned?: boolean;
  isMuted?: boolean;
  until?: Date;
 };

 export class _channelSettings {
  channelName : string;
  users      : string[];
  bandUsers  : string[];
  admins     : string[];
  mutedUsers : string[];
}

@Injectable()
export class ChannelsService {
 constructor(private prisma: PrismaService) {}

    async channelSearchResults(channel : string, user : string) : Promise<channelSearchType[]> {
      let data : channelDto[] = await this.prisma.channel.findMany({
        where : {
          name : {
            contains : channel
        },
          IsPrivate : false
        }
      })
      let hasdata = await this.prisma.channelOnUser.findMany({
        where : {
          userId : user,
        },
        include :{
          channel : {
            select : {
              name : true,
            }
          }
        }
      });
      let channelNames : string[] = hasdata.map(item => item.channel.name);
      let response : channelSearchType[] = [];
      data.map((element)=> {
        if (!channelNames.includes(element.name)) {
          response.push({
            name : element.name,
            isProtected : element.IsProtected,
          });
        }
      })
      return response
    }  

    async createChannel(ownerId: string, channelData: channelDto) {
      try {
        let checkIfChannelExist : channelDto = await this.prisma.channel.findFirst({where : {
        name : channelData.name,
      }})
      if (checkIfChannelExist)
        return null
      if ((channelData.IsProtected && !channelData.password.length) || channelData.name.length === 0) {
        return
      }
      let _tmp : string[] = ['','']
      if (channelData.IsProtected) {
        _tmp  = await this.hashPassword(channelData.password)
      } else {
          _tmp[0] = ''
          _tmp[1] = ''
      }
      const channel : channelDto = await this.prisma.channel.create({
        data: {
          name: channelData.name,
          owner: ownerId,
          IsPrivate : channelData.IsPrivate,
          IsProtected : channelData.IsProtected,
          password : _tmp[1],
          passwordHash : _tmp[0],
          users : {
            create : {
              isAdmin: true,
              isOwner: true,
              isBanned: false,
              isMuted: false,
                until: new Date,
                user : {
                  connect : {
                    id : ownerId
                  }
                },
            }
          },
        }
      });
      return channel;
    } catch (error) {
    }
     }
     
     async leaveChannel(userId: string, channelName : string) : Promise<boolean> {
      let userOnChannel : channelOnUser = await this.prisma.channelOnUser.findFirst({
        where : {
          user : {
            id : userId,
          },
          channel : {
            name : channelName,
          }
        }
      })
      if (!userOnChannel) {
        return false;
      }
      let channel : channelDto = await this.prisma.channel.findFirst({
        where : {
          name : channelName,
        }
      })
      if (!channel)
        return false;
        await this.prisma.channelOnUser.delete({
          where: {
            userId_channelId: {
              userId: userId,
              channelId: channel.id,
            },
          },
        });
      let usersInChannel : channelOnUser[] = await this.prisma.channelOnUser.findMany({
        where : {
          channel : {
            id : channel.id,
          }
        }
      })
      if (usersInChannel && usersInChannel.length !== 0) {
        return true;
      } else {
        await this.prisma.channel.delete({
          where : {
            id : channel.id,
          }
        })
        return true
      } 
     }

     async getUserChannelNames(id : string) : Promise<string[]> {
      let data = await this.prisma.channelOnUser.findMany({
        where : {
          userId : id,
        },
        include :{
          channel : {
            select : {
              name : true,
            }
          }
        }
      });
      let channelNames : string[] = data.map(item => item.channel.name);
      return channelNames;
   }
   


  async getChannelUsersId(channel :string ) : Promise<string[]> {
    let data = await this.prisma.channelOnUser.findMany({
      where : {
        channel : {
          name : channel,
        }
      }
    })
    let ids : string[] = []
    if (data) {

      data.map((user)=> {
        ids.push(user.userId)
      })
      return ids;
    }
    else
      return []
  }


  async JoinUserToChannel(userId : string, channel : string, password : string) : Promise<boolean> {
    let StoredChannel : channelDto = await this.prisma.channel.findFirst({
      where : {
        name : channel,
      }
    })
    if (!StoredChannel) {
      return false
    }
    let CheckIfUserExitst : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        channel : {
          name : channel,
        },
        user : {
          id : userId,
        }
      }
    })
    if (CheckIfUserExitst) {
      return false
    }
    if (StoredChannel.IsProtected) {
      let valid : boolean = await this.checkPassword(password, StoredChannel.password)
      if (valid) {
        let tmp : channelOnUser = await this.prisma.channelOnUser.create({
          data : {
            isAdmin : false,
            isMuted : false,
            isBanned : false,
            isOwner : false,
            until: new Date,
            user : {
              connect : {
                id : userId,
              }
            },
            channel : {
              connect : {
                name: channel,
              }
            }
          }
        })
        if (!tmp) {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      let tmp : channelOnUser = await this.prisma.channelOnUser.create({
        data : {
          isAdmin : false,
          isMuted : false,
          isBanned : false,
          isOwner : false,
          until: new Date,
          user : {
            connect : {
              id : userId,
            }
          },
          channel : {
            connect : {
              name: channel,
            }
          }
        }
      })
      if (!tmp)
        return true;
    }
    return true;
  }

  async getChannelSettingsData(userId : string) : Promise<any> {
    let data = await this.prisma.channelOnUser.findMany({
      where : {
          userId : userId,
          isAdmin : true,
      },
      include : {
          channel : {
              include : {
                 users : {
                  include : {
                    user : {
                      select : {
                        username : true,
                      }
                    }
                  }
                 },
              }
          },
      },
  });
  let channelSettingsArray: _channelSettings[] = [];
  for (let index: number = 0; index < data.length; index++) {
    for (let userIndex : number = 0; userIndex < data[index].channel.users.length;  userIndex++) {
      if (data[index].channel.users[userIndex].isMuted) {
        await this.UndoMuteForUser(data[index].channel.users[userIndex].userId, data[index].channel.users[userIndex].channelId)
      }
    }
  }
  data.forEach((channelData) => {
      let channelSettingsInstance = new _channelSettings();
      channelSettingsInstance.channelName = channelData.channel.name;
      channelSettingsInstance.users = [];
      channelSettingsInstance.bandUsers = [];
      channelSettingsInstance.admins = [];
      channelSettingsInstance.mutedUsers = [];

      channelData.channel.users.forEach( async (userData) => {
          if (userData.isAdmin && !userData.isBanned) {
              channelSettingsInstance.admins.push(userData.user.username);
          }
          if (userData.isBanned) {
              channelSettingsInstance.bandUsers.push(userData.user.username);
          }
          if (userData.isMuted && !userData.isBanned) {
                channelSettingsInstance.mutedUsers.push(userData.user.username);
          }
          if (!userData.isBanned && !userData.isAdmin) {
            channelSettingsInstance.users.push(userData.user.username);
          }
      });

      channelSettingsArray.push(channelSettingsInstance);
  });
  
  return channelSettingsArray;
  }



  async hashPassword(password: string): Promise<string[]> {
    const salt : string = await bcrypt.genSalt();
    let tmp : string[] = []
    tmp.push(salt);
    
    let pass : string = await bcrypt.hash(password, salt);
    tmp.push(pass)
    return tmp
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  async removeUserFromChannel(requesterId: string, channelName: string, userToRemove : string) : Promise<boolean> {
    try  {
      let idToDelete : UserDto = await this.prisma.user.findFirst({where : {
      username : userToRemove,
    }})
    let _channel : channelDto = await this.prisma.channel.findFirst({where : {
      name : channelName,
    }})
    if (!idToDelete || !_channel)
      return false
    let requester : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        channelId : _channel.id,
        userId : requesterId
      }
    })
    if (requester && requester.isAdmin) {
        let tmpChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
          where : {
            userId : idToDelete.id,
            channelId : _channel.id,
          }
        })
        if (!tmpChannelOnUser || tmpChannelOnUser.isOwner) {
          throw ('user not in channel Or trying to kick owner ...')
        }
        await this.prisma.channelOnUser.delete({
          where: {
            userId_channelId: {
              userId: tmpChannelOnUser.userId,
              channelId: tmpChannelOnUser.channelId,
            },
          },
        });
    }
    else {
      return false
    }
    return true;
  }
  catch (error) {
    return false;
    }
  }

 async  muteUser(UserToMute: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    const now : Date = new Date();
    let ToMute : UserDto = await this.prisma.user.findFirst({
      where : {
        username : UserToMute,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where : {
        name : channelName
      }
    })
    if (!channel || !ToMute) {
      return false
    }
    let ToMuteChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : ToMute.id,
        channelId : channel.id,
      }
    })
    let RequesterChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : requester,
        channelId : channel.id
      }
    })
    if (!ToMuteChannelOnUser || ToMuteChannelOnUser.isMuted || ToMuteChannelOnUser.isBanned || ToMuteChannelOnUser.isOwner || !RequesterChannelOnUser || !RequesterChannelOnUser.isAdmin ) {
      return false
    } 
    await this.prisma.channelOnUser.update({
        where: {
          userId_channelId: {
            userId: ToMute.id,
            channelId: channel.id,
          },
        },
        data : {
          isMuted : true,
          until : new Date(now.getTime() + 5 * 60 * 1000)
        }
      });
      return true;
  }
  catch (error) {
  }
}

async  KickUserFromChannel(UserToKick: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    let ToKick : UserDto = await this.prisma.user.findFirst({
      where : {
        username : UserToKick,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where : {
        name : channelName
      }
    })
    if (!channel || !ToKick)
      return false
    let ToKickChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : ToKick.id,
        channelId : channel.id,
      }
    })
    let RequesterChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : requester,
        channelId : channel.id
      }
    })
    if (!ToKickChannelOnUser || ToKickChannelOnUser.isOwner || !RequesterChannelOnUser || !RequesterChannelOnUser.isAdmin ) {
      return false
    } 
    await this.prisma.channelOnUser.delete({
        where: {
          userId_channelId: {
            userId: ToKick.id,
            channelId: channel.id,
          },
        }
      });
      return true;
  }
  catch (error) {
  }
}


  async createChannelMessage(message : channelMessageDto, channelId : string, senderId : string) : Promise<any> {

   if (message) {
     return await this.prisma.channelMessage.create({data : {
       sender : message.sender,
       content : message.content,
       channelName : message.channelName,
       channel : {
        connect : {
          id : channelId,
        }
       },
       user : {
        connect : {
          id : senderId
        }
       }
     }})
   }
  }

  
  
  async UndoMuteForUser(userId : string, channelId : string) : Promise<boolean> {
    let UserToCheck : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : userId,
        channel : {
          id : channelId,
        }
      }
    })
    if (UserToCheck) {
      if (UserToCheck.isMuted) {
        let now : Date = new Date();
        if (UserToCheck.until.getTime() < now.getTime()) {
          await this.prisma.channelOnUser.update({
            where : {
              userId_channelId : {
                userId : UserToCheck.userId,
                channelId : UserToCheck.channelId,
              }
            },
            data : {
              isMuted : false
            }
          })
          return true;
        }
      }
    }
    else {
      return false;
    }
  }

 async banUserFromChannel(username: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    let user : UserDto = await this.prisma.user.findFirst({
      where : {
        username : username,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where: {
        name : channelName,
      }
    })
    if (!user || !channel)
      return false
    let channelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where :{
          userId : user.id,
          channelId : channel.id,
      }
    })
    let _requester : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where :{
          userId : requester,
          channelId : channel.id,
      }
    })
    if (!channelOnUser || channelOnUser.isBanned || channelOnUser.isOwner || !_requester || !_requester.isAdmin)
      return false;
      await this.prisma.channelOnUser.update({
        where: {
          userId_channelId: {
            userId: user.id,
            channelId: channel.id,
          },
        },
        data : {
          isBanned : true,
          isAdmin : false,
        }
      });
      return true;
    }
    catch (error) {
      return false
  } 
 }
 
 async unBanUserFromChannel(username: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    let user : UserDto = await this.prisma.user.findFirst({
      where : {
        username : username,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where: {
        name : channelName,
      }
    })
    if (!user || !channel)
      return false
    let channelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : user.id,
        channelId : channel.id,
      }
    })
    let _requester : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where :{
          userId : requester,
          channelId : channel.id,
      }
    })

    if (!channelOnUser || !_requester || !_requester.isAdmin)
      return false;
      await this.prisma.channelOnUser.update({
        where: {
          userId_channelId: {
            userId: user.id,
            channelId: channel.id,
          },
        },
        data : {
          isBanned : false
        }
      });
      return true;
  }
    catch (error) {
      return false
  } 
 }
 
 async AddAdminToChannel(username: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    let user : UserDto = await this.prisma.user.findFirst({
      where : {
        username : username,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where: {
        name : channelName,
      }
    })
    if (!user || !channel)
      return false
    let channelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : user.id,
        channelId : channel.id,
      }
    })
    let _requester : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where :{
          userId : requester,
          channelId : channel.id,
      }
    })

    if (!channelOnUser || channelOnUser.isBanned || !_requester || !_requester.isAdmin ||  channelOnUser.isAdmin)
      return false;
    await this.prisma.channelOnUser.update({
        where: {
          userId_channelId: {
            userId: user.id,
            channelId: channel.id,
          },
        },
        data : {
          isAdmin : true
        }
      });
      return true;
  }
    catch (error) {
      return false
  } 
 }
 
 async RemoveAdminFromChannel(username: string, channelName: string, requester : string) : Promise<boolean> {
  try {
    let user : UserDto = await this.prisma.user.findFirst({
      where : {
        username : username,
      }
    })
    let channel : channelDto = await this.prisma.channel.findFirst({
      where: {
        name : channelName,
      }
    })
    if (!user || !channel)
      return false
    let channelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : user.id,
        channelId : channel.id,
      }
    })
    let _requester : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where :{
          userId : requester,
          channelId : channel.id,
      }
    })

    if (!channelOnUser || channelOnUser.isOwner || !_requester || !_requester.isAdmin)
      return false;
      await this.prisma.channelOnUser.update({
        where: {
          userId_channelId: {
            userId: user.id,
            channelId: channel.id,
          },
        },
        data : {
          isAdmin : false
        }
      });
      return true;
  }
    catch (error) {
      return false
  } 
 }

 async getChannelByName(channelName: string) : Promise<channelDto> {
    return await this.prisma.channel.findFirst({where : {name : channelName}});
 }

 async addUserToChannel(userId: string, channelId: string, requester : string): Promise<boolean> {
  try {
    const existingUser : UserDto = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return false
    }

    const existingChannel : channelDto = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!existingChannel) {
      return false
    }

    let requsterChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : requester,
        channelId : existingChannel.id,
      }
    })
    if (!requsterChannelOnUser || !requsterChannelOnUser.isAdmin)
      return false
    let existingChannelOnUser : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : existingUser.id,
        channelId : existingChannel.id,
      }
    })
    if (existingChannelOnUser || existingChannelOnUser)
      return false;
    const channelOnUser = await this.prisma.channelOnUser.create({
      data: {
      isAdmin: false,
      isOwner: false,
      isBanned: false,
      isMuted: false,
      until: new Date,
      channel : {
        connect : {
          id : channelId
        }
      },
      user : {
        connect : {
          id : userId
        }
      },
      }
    });
    
    return true
  } catch (error) {
    return false
  }
}
 

 async deleteChannel(channelId : string) : Promise<any> {
    await this.prisma.channel.delete({where : {id : channelId}})
 }

 async setPasswordToChannel(password: string, channelName : string) {
    let channel : channelDto = await this.prisma.channel.findFirst({where : { name :channelName}})
    if (channel && password.length) {
      let _tmp : string[] = ['','']
      _tmp  = await this.hashPassword(password)
      return await this.prisma.channel.update({where : {id: channel.id},
      data : {
        IsProtected : true,
        password : _tmp[1],
        passwordHash : _tmp[0],
      }})
    }
 }
 
 async unsetPasswordToChannel(channelName : string) {
    let channel : channelDto = await this.prisma.channel.findFirst({where : { name :channelName}})
    if (channel) {
      return await this.prisma.channel.update({where : {id: channel.id},
      data : {
        IsProtected : false,
        password : '',
      }})
    }
 }
 
 async BanUser(user: UserDto, ban : UserDto): Promise<string> {
    let tmp : string[] = []
    if (user && ban) {
      tmp = user.bandUsers;
      tmp.push(ban.id)
      
      let check = await this.prisma.user.update({where : {id : user.id}, 
        data : {bandUsers : tmp},
      })
      let banList : string[] = ban.bandBy
      banList.push(user.id);
      await this.prisma.user.update({
        where : {
          id : ban.id,
        },
        data : {
          bandBy : banList,
        }
      })
      return `user banned succesfully.`
    }
    return `user already banned or dosen't exist.`
}
 
async unBanUser(user: UserDto, ban : UserDto): Promise<string> {
    let tmp : string[] = []
    if (user && ban) {
      user.bandUsers.forEach((user) => {
        if (user != ban.id)
          tmp.push(user)
      })
      let check = await this.prisma.user.update({where : {id : user.id}, 
        data : {bandUsers : tmp},
      })
      let bandBy : string[] = []
      for (let index : number = 0; index < bandBy.length; index++) {
        if (ban.bandBy[index] != user.id) {
          bandBy.push(ban.bandBy[index]);
        }
      }
      await this.prisma.user.update({
          where : {
            id : ban.id,
          },
          data : {
            bandBy : bandBy,
          }
        })
      return `user unbanned succesfully.`
    }
    return `user is not in the ban list.`
}

 async getChannelMessages(channel : string, requester : string) : Promise<channelMessageDto[]> {
  let user : UserDto = await this.prisma.user.findUnique({
    where : {
      id : requester,
    }
  })
  let tmp =  await this.prisma.channelMessage.findMany({
    where : {
      channelName : channel,
    },
    include : {
      user : {
        select : {
          username : true,
        }
      }
    }
  })
  let data : channelMessageDto[] = []
  for (let index : number = 0; index < tmp.length; index++) {
    if (!user.bandBy.includes(tmp[index].userId) && !user.bandUsers.includes(tmp[index].userId)) {
      data.push({
        userId : tmp[index].userId,
        sender : tmp[index].user.username,
        content : tmp[index].content,
        channelName : tmp[index].channelId
      })
    }
  }
  return data;
 }

 async canSendMessageToChannel(id : string, channelName : string) : Promise<boolean> {
  try {
    let user : channelOnUser = await this.prisma.channelOnUser.findFirst({
      where : {
        userId : id,
        channel : {
          name : channelName,
        }
      }
    })
    if (!user || user.isBanned || user.isMuted) {
      if (user.isMuted) {
        let time : Date = new Date();
        let removeMute : boolean = ((time.getTime() - user.until.getTime()) > 0);
        if (removeMute) {
          await this.prisma.channelOnUser.update({
            where : {
              userId_channelId : {
                userId : user.userId,
                channelId : user.channelId,
              }
            },
            data : {
              isMuted : false,
            }
          })
          if (!user.isBanned)
            return true 
        }
      }else {
        return false
      }
    }
    else {
      return true;
    }
  }
  catch (error) {
    return false;
  }
 }
 }

