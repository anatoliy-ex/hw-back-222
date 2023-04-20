import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection} from "../dataBase/db.posts.and.blogs";
import {jwtService} from "../application/jwtService";
import {InputUserType, UsersTypes} from "../types/users.types";
import nodemailer from 'nodemailer'
import {settings} from "../../.env/settings";

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
    async confirmEmailByUser(code: string){

       return code == settings.EMAIL_CODE;
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
        console.log(checkUserInSystem)

        if(checkUserInSystem !== null)
        {
            console.log("1234")
            return false;
        }
        else
        {

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


            const passwordHash = await bcrypt.hash(user.password, 10)
            const now = new Date();

            const newUser: UsersTypes = {
                id: `${Date.now()}`,
                login: user.login,
                email: user.email,
                hash: passwordHash,
                createdAt: now.toISOString(),
            }

            await usersCollection.insertOne({...newUser});
            return true;
        }
    },

    //registration in system-3
    async registrationWithSendingEmail(email: string){

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