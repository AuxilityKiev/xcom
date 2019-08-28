import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber'

export const comparePhoneNumbers = (phoneNumber1: string, phoneNumber2: string, region: string): boolean => {
    const phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance()
    return (
        phoneNumberUtil.format(phoneNumberUtil.parse(phoneNumber1, region), PNF.E164) ===
        phoneNumberUtil.format(phoneNumberUtil.parse(phoneNumber2, region), PNF.E164)
    )
}
