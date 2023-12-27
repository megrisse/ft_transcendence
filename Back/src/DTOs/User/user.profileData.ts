import { UserDto } from "./user.dto";
import { AchievementDto } from "../achievement/achievement.dto";
import { matchModel } from "../Match/match.model";
import { FriendDto } from "../friends/friend.dto";
import { ProfileFriends } from "./user.Friends";


export class UserData {
    userData : UserDto;
    matches : matchModel[];
    achievements : AchievementDto[];
    freinds :   ProfileFriends [];
}