import { matchModel } from "../Match/match.model"
import { AchievementDto } from "../achievement/achievement.dto"
import { UserDto } from "./user.dto"

export class ProfileID  {
    userData : UserDto
    // user matches
    matches : matchModel[]

    achievements : AchievementDto[]

    isBlocked    :   boolean

    isFriend    :   boolean
};