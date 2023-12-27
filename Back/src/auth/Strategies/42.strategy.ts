import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, VerifyCallback } from 'passport-42';

@Injectable()
export class OAuth extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.CLIENT_ID_42,
            clientSecret: process.env.CLIENT_SECRET_42,
            callbackURL: "http://localhost:4000/auth/42/callback",
            profileFields: {
                'id':   'id',
                'username': 'login',
                'displayName': 'displayname',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'emails.0.value': 'email',
            }
        });
    }

    async validate(
        accesToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        
        const { id, email, login } = profile._json;
        const user = {

            id: String(id),
            username: login,
            email: email,
        };
        done(null, user);
    }
}