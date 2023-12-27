import { channelMessageDto } from "./channel.messages.dto";

export class channelsAsConversations {
    channels : channelData[];
    username : string;
};

export class channelData {
    messages : channelMessageDto[];
    channelName : string;
}

export default channelsAsConversations;