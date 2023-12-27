import { IsBoolean, IsNumber, IsString } from "class-validator";


export class AchievementDto {

        @IsString()
        title : string;

        @IsBoolean()
        unlocked : boolean;

        @IsString()
        icon : string;
}