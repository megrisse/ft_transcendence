import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
    constructor (private configSrvice: ConfigService) {
        super({
            accessType: 'offline',
        });
    }
}