import {Router} from "express"
import {authMiddleware, rateLimitedMiddleware, refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {
    codeValidator,
    createUsersValidator,
    emailAlreadyExistButNotConfirmedValidator,
    existEmailValidator,
    inputValidationMiddleware,
    loginOrEmailValidator,
    recoveryPasswordValidator,
    passwordValidator,
    recoveryCodeValidator,
    recoveryEmailValidator} from "../middlewares/middleware.validators";
import {authUserController} from "../roots/composition.root";

export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', rateLimitedMiddleware, loginOrEmailValidator, passwordValidator, inputValidationMiddleware, authUserController.LoginUser.bind(authUserController));

//password recovery via email
authUsersRouter.post('/password-recovery', rateLimitedMiddleware, recoveryEmailValidator, inputValidationMiddleware, authUserController.PasswordRecovery.bind(authUserController));

//confirm new password with recovery code
authUsersRouter.post('/new-password', rateLimitedMiddleware, recoveryPasswordValidator, recoveryCodeValidator, inputValidationMiddleware, authUserController.ConfirmNewPassword.bind(authUserController));

// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, authUserController.GenerateRefreshAndAccessToken.bind(authUserController));

//confirm registration-2
authUsersRouter.post('/registration-confirmation', rateLimitedMiddleware, codeValidator, inputValidationMiddleware, authUserController.RegistrationAndConfirmation.bind(authUserController));

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration', rateLimitedMiddleware, createUsersValidator, existEmailValidator, inputValidationMiddleware, authUserController.FirstRegistration.bind(authUserController));

//registration in system-3
authUsersRouter.post('/registration-email-resending', rateLimitedMiddleware, emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, authUserController.RegistrationEmailResending.bind(authUserController));

//logout if bad refresh token
authUsersRouter.post('/logout', refreshAuthMiddleware, authUserController.Logout.bind(authUserController));

//get information about user
authUsersRouter.get('/me', authMiddleware, authUserController.GetInformationAboutUser.bind(authUserController));