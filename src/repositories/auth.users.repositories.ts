import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {PasswordRecoveryModel, UserModel, UserNotConfirmationModel,} from "../dataBase/db";
import {JwtTokenService} from "../application/jwt.token.service";
import {InputUserType, UserConfirmTypes, UserIsNotConfirmTypes} from "../types/userConfirmTypes";
import nodemailer from 'nodemailer'
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {injectable} from "inversify";

@injectable()
export class AuthUsersRepositories {

    private jwtTokenService : JwtTokenService

    constructor() {

        this.jwtTokenService = new JwtTokenService()
    }


    //login users
    async loginUser(authUser: LoginType)
    {
        const filter = {
            $or: [
                {login: {$regex: authUser.loginOrEmail, $options: 'i'}},
                {email: {$regex: authUser.loginOrEmail, $options: 'i'}}
            ]
        };

        const user = await UserModel.findOne(filter)

        if(user)
        {
            const isLogin =  await bcrypt.compare(authUser.password, user.hash);

            if(isLogin)
            {
                return user.id
            }
            else
            {
                return false;
            }

        }
        else
        {
            return false;
        }
    }

    ////password recovery via email
    async recoveryPasswordWithSendEmail(email: string) : Promise<boolean> {

        const date = new Date()
        const recoveryCode = uuidv4()
        await PasswordRecoveryModel.create({confirmCode: recoveryCode, email: email, dateAt: date})
        console.log(email)

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "incubator.blogs.platform@gmail.com", // generated ethereal user
                pass: "snfsapqqywlznyjj", // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: 'IT-INCUBATOR Blogs Platform <incubator.blogs.platform@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html:  `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`
        });

        return true;
    }

    //confirm new password with recovery code
    async confirmNewPasswordWithCode(newPassword: string, userConfirmCode: string) : Promise<boolean> {

        try {
            const user = await PasswordRecoveryModel.findOne({confirmCode: userConfirmCode})
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await UserModel.updateOne({email: user!.email}, {hash: passwordHash});
            await PasswordRecoveryModel.deleteOne({confirmCode: userConfirmCode})
            return true;
        }
        catch  {
            return false;
        }
    }

    //confirm registration-2
    async confirmEmailByUser(code: string) : Promise<boolean> {

        let confirmationUser = await UserNotConfirmationModel.findOne({confirmationCode: code});

        if(confirmationUser && confirmationUser.expirationDate > new Date())
        {
            const updateUser : UserConfirmTypes = {
                id: confirmationUser.id,
                login: confirmationUser.login,
                email: confirmationUser.email,
                hash: confirmationUser.hash,
                createdAt: confirmationUser.createdAt,
                isConfirm: true,
            }
            const filter = {confirmationCode: code}

            await UserNotConfirmationModel.deleteOne(filter);
            await UserModel.create(updateUser);
            return true
        }
        else
        {
            return false;
        }
    }

    //first registration in system => send to email code for verification-1
    async firstRegistrationInSystem(user: InputUserType) : Promise<boolean> {

        const filter = {
            $or: [
                {login: user.login},
                {email: user.email}
            ]
        };

        const checkUserInSystem = await UserModel.find(filter)
        const checkUserIsNotConfirmInSystem = await UserNotConfirmationModel.find(filter)

        if(checkUserInSystem.length != 0)
        {
            console.log(checkUserInSystem)
            return false;
        }
        else if(checkUserIsNotConfirmInSystem.length != 0)
        {
            console.log(checkUserIsNotConfirmInSystem + "2")
            return false;
        }
        else
        {
            const passwordHash = await bcrypt.hash(user.password, 10)
            const now = new Date();
            const code = uuidv4()
            console.log(code)

            const newUser: UserIsNotConfirmTypes =
                {
                    id: `${Date.now()}`,
                    login: user.login,
                    email: user.email,
                    hash: passwordHash,
                    createdAt: now.toISOString(),
                    isConfirm: false,
                    confirmationCode: code,
                    expirationDate: add(new Date(),{hours: 1,}),
                }


            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "incubator.blogs.platform@gmail.com", // generated ethereal user
                    pass: "snfsapqqywlznyjj", // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: 'IT-INCUBATOR Blogs Platform <incubator.blogs.platform@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html:  `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${newUser.confirmationCode}'>complete registration</a>
      </p>`
            });

            await UserNotConfirmationModel.insertMany([newUser]);
            return true;
        }
    }

    //registration in system-3
    async registrationWithSendingEmail(email: string){

        const user = await UserNotConfirmationModel.findOne({email: email})

        if(user && !user.isConfirm)
        {
            const newCode = uuidv4()
            await UserNotConfirmationModel.updateOne( {email: email}, {$set: {'confirmationCode': newCode}})
            const updatedUser = await UserNotConfirmationModel.findOne({'email': email})

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "incubator.blogs.platform@gmail.com", // generated ethereal user
                    pass: "snfsapqqywlznyjj", // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: 'IT-INCUBATOR <incubator.blogs.platform@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html:`<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${updatedUser!.confirmationCode}'>complete registration</a>
      </p>`,});

            return true;
        }
        else
        {
            return false;
        }
    }

    //get information about user
    async getUserWithAccessToken(token: string)
    {
        const userId = await  this.jwtTokenService.getUserIdByToken(token);

        if(userId != null) {
            return UserModel.findOne({id: userId})
        }
        else
        {
            return null
        }
    }

    //get user id by login or email
    async getUserIdByLoginOrEmail(authUser: LoginType){
        const filter = {
            $or: [
                {login: {$regex: authUser.loginOrEmail, $options: 'i'}},
                {email: {$regex: authUser.loginOrEmail, $options: 'i'}}
            ]
        };

        const user = await UserModel.findOne(filter)

        if(user)
        {
            return user.id
        }
        else
        {
            return false;
        }
    }
}

export const authUsersRepositories = new AuthUsersRepositories();