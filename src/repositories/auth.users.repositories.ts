import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {
    RefreshTokenSessionModel,
    UserModel, userNotConfirmationModel,
} from "../dataBase/db";
import {jwtService} from "../application/jwtService";
import {InputUserType, UserConfirmTypes, UserIsNotConfirmTypes} from "../types/userConfirmTypes";
import nodemailer from 'nodemailer'
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'


export const authUsersRepositories = {
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
   },

    async checkRefreshToken(refreshToken: string): Promise<boolean> {

       try{
           const isToken = await RefreshTokenSessionModel.findOne({refreshToken: refreshToken})
           return isToken != null;
       }
       catch (e) {
           return false;
       }
    },

    ////confirm registration-2
    async confirmEmailByUser(code: string) : Promise<boolean> {

      let confirmationUser = await userNotConfirmationModel.findOne({confirmationCode: code});

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

          await userNotConfirmationModel.deleteOne({confirmationCode: code});
          await UserModel.insertMany([updateUser]);
          return true
      }
      else
      {
          return false;
      }
    },

    ////first registration in system => send to email code for verification-1
    async firstRegistrationInSystem(user: InputUserType) : Promise<boolean> {

        const filter = {
            $or: [
                {login: user.login},
                {email: user.email}
            ]
        };

        const checkUserInSystem = await UserModel.findOne(filter)
        const checkUserIsNotConfirmInSystem = await userNotConfirmationModel.findOne(filter)

        if(checkUserInSystem != null )
        {
            return false;
        }
        else if(checkUserIsNotConfirmInSystem != null)
        {
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

            await userNotConfirmationModel.insertMany([newUser]);
            return true;
        }
    },

    //registration in system-3
    async registrationWithSendingEmail(email: string){

        const user = await userNotConfirmationModel.findOne({email: email})

        if(user && !user.isConfirm)
        {
            const newCode = uuidv4()
            await userNotConfirmationModel.updateOne( {email: email}, {$set: {'confirmationCode': newCode}})
            const updatedUser = await userNotConfirmationModel.findOne({'email': email})

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


    },

    //get information about user
    async getUserWithAccessToken(token: string)
    {
        const userId = await  jwtService.getUserIdByToken(token);

        if(userId != null) {
            return UserModel.findOne({id: userId})
        }
        else
        {
            return null
        }
    },

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
    },
};