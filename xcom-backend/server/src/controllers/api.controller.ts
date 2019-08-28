import { Get, JsonController } from 'routing-controllers'
import { NODE_ENV } from '../config/env.config'

@JsonController()
export class ApiController {
    @Get()
    public apiInfo() {
        return {
            name: process.env.APP_NAME,
            version: process.env.APP_VERSION_CODE,
            version_name: process.env.APP_VERSION_NAME,
            startAt: new Date(),
            env: NODE_ENV
        }
    }
}
