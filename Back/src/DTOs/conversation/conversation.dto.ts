import { IsString, MaxLength, MinLength, ValidationArguments } from "class-validator";

export class ConversationDto {
    @IsString()
    id              : string
    
    @IsString()
    @MinLength(10, {
        message: (args: ValidationArguments) => {
          if (args.value.length === 1) {
            return 'Too short, minimum length is 1 character';
          } else {
            return 'Too short, minimum length is 50 characters'; }
        }},)
      @MaxLength(50, {
        message: (args: ValidationArguments) => {
          if (args.value.length > 50) {
            return 'Too short, minimum length is 50 characters'; }
        }})
    senderId         : string

    @IsString()
    @MinLength(10, {
        message: (args: ValidationArguments) => {
          if (args.value.length === 1) {
            return 'Too short, minimum length is 1 character';
          } else {
            return 'Too short, minimum length is 50 characters'; }
        }},)
      @MaxLength(50, {
        message: (args: ValidationArguments) => {
          if (args.value.length > 50) {
            return 'Too short, minimum length is 50 characters'; }
        }})
    recieverId         : string

    updatedAt           : Date
}


