import { IsDefined, IsNotEmpty } from 'class-validator'

export class RegisterDeviceRequest {
    @IsDefined()
    @IsNotEmpty()
    public deviceToken!: string
}
