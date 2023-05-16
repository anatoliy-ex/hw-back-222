export type RefreshTokenSessions = {
    deviceId: string
    ip: string| string[],//device IP(user IP)
    title: string,//device name
    lastActiveDate: string,
    userId: string
}