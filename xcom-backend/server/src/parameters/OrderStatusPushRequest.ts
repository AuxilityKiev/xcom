import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'

export class OrderStatusPushRequest {
    @IsDefined()
    @IsNotEmpty()
    public extId!: string

    @IsDefined()
    @IsNumber()
    public id!: number

    @IsDefined()
    @IsNumber()
    public orderStatusId!: number

    @IsDefined()
    @IsNotEmpty()
    public phoneNumber!: string
}
