import { IsNumber, IsString } from "class-validator";


export class MatchDto {
        @IsString()
        id      :string;
        
        @IsString()
        playerAId :string;
        
        @IsString()
        playerBId :string;

        @IsNumber()
        playerAScore : number;
        
        @IsNumber()
        playerBScore : number;
}