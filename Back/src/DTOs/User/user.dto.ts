import { IsString } from "class-validator";


export class UserDto {

    @IsString()
    id : string;
    
    @IsString()
    username : string;

    @IsString()
    email ? :    string;

    avatar : string;

    achievements : string[];

    TwoFASecret: string;

    IsEnabled: boolean;

    bandUsers : string[];

    bandBy    ? : string[];

    online  :    boolean;
    
    inGame  :    boolean;

    level : number;

    isAuth ? : boolean;

    rank ?: number;
}

export class TwoFaV {

    code: string;
}