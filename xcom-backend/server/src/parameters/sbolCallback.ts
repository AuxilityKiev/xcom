import { IsDefined, IsNotEmpty, IsString } from 'class-validator'

export class SbolCallback {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public orderNumber!: string

    public orderId?: string
}
