export class chatDto {
    isOwner : boolean;

    content : string;

    avatar : string;

    sender : string;

    senderId : string;

    reciever : string;

    recieverId : string;

    date    : Date;

    conversationId ? : string;
}


// {
//     "id": 1,
//     "messages": [
//       {
//         "avatar": "path",
//         "text": "Hey!",
//         "sentBy": "owner",
//         "isChatOwner": true
//       },
//       {
//         "avatar": "path",
//         "text": "Hey, friend!",
//         "sentBy": "anon",
//         "isChatOwner": false
//       },
//     ]
//   },

// objet[]