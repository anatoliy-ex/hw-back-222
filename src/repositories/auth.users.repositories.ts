import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection, usersNotConfirmCollection} from "../dataBase/db.posts.and.blogs";
import {jwtService} from "../application/jwtService";
import {InputUserType, UserConfirmTypes, UserIsNotConfirmTypes} from "../types/userConfirmTypes";
import nodemailer from 'nodemailer'
import {settings} from "../../.env/settings";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {promises} from "dns";


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

       const user = await usersCollection.findOne(filter)

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

    ////confirm registration-2
    async confirmEmailByUser(code: string) : Promise<boolean> {

      let confirmationUser = await usersNotConfirmCollection.findOne({confirmationCode: code});

      if(confirmationUser && confirmationUser.expirationDate < new Date())
      {
          const updateUser : UserConfirmTypes = {
              id: confirmationUser.id,
              login: confirmationUser.login,
              email: confirmationUser.email,
              hash: confirmationUser.hash,
              createdAt: confirmationUser.createdAt,
              isConfirm: true,
          }

          await usersNotConfirmCollection.deleteOne({confirmationCode: code});
          await usersCollection.insertOne({...updateUser});
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
                {login: {$regex: user.login, $options: 'i'}},
                {email: {$regex: user.email, $options: 'i'}}
            ]
        };

        const checkUserInSystem = await usersCollection.findOne(filter)
        const checkUserInSystemNotConfirm = await usersNotConfirmCollection.findOne(filter)

        if(checkUserInSystem != null || checkUserInSystemNotConfirm != null)
        {
            return false;
        }
        else
        {
            const passwordHash = await bcrypt.hash(user.password, 10)
            const now = new Date();

            const newUser: UserIsNotConfirmTypes =
            {
                id: `${Date.now()}`,
                login: user.login,
                email: user.email,
                hash: passwordHash,
                createdAt: now.toISOString(),
                isConfirm: false,
                confirmationCode: settings.EMAIL_CODE,
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
                from: 'IT-INCUBATOR Blogs Platform <endlessxxxpain@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<h1>Thank for your registration</h1>\n" +
                    " <p>To finish registration please follow the link below:\n" +
                    "     <a href='https://somesite.com/confirm-email?code=546792'>complete registration</a>\n" +
                    " </p>", // html body
            });

            await usersNotConfirmCollection.insertOne({...newUser});
            return true;
        }
    },

    //registration in system-3
    async registrationWithSendingEmail(email: string){

       const user = await usersCollection.findOne({email: email})

        if(user && !user.isConfirm)
        {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "incubator.blogs.platform@gmail.com", // generated ethereal user
                    pass: "snfsapqqywlznyjj", // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: 'IT-INCUBATOR <endlessxxxpain@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<h1>Thank for your registration</h1>\n" +
                    " <p>To finish registration please follow the link below:\n" +
                    "     <a href='https://somesite.com/confirm-email?code=546792'>complete registration</a>\n" +
                    " </p>", // html body
            });

            return true;
        }
        else
        {
            return false;
        }


    },

    //get information about user
    async getUser(token: string)
    {
        const userId = await  jwtService.getUserIdByToken(token);

        if(userId != null) {
            return await usersCollection.findOne({id: userId})
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

        const user = await usersCollection.findOne(filter)

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