import bcrypt from 'bcrypt'

import User from './../models/user'

export default async function seedUsers() {
    if (!await User.findOne({ email: 'admin@gmail.com' })) {
        const user = new User({ email: 'admin@gmail.com', password: bcrypt.hashSync('12345678', 10)})
        await user.save()
    }
}