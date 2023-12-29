
export class friends {
    name : string;
    id   : string;
    online : boolean;
    inGame : boolean;
}

export class UserSettingsDto {
    constructor () {
        this.user = "";
        this.bandUsers = [];
        this.friends = [];
        this.invitations = [];
    }
    user        : string;
    invitations : string[];
    friends     : friends[];
    bandUsers   : string[];
}