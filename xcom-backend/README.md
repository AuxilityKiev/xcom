# XCOM Backend

## Dependencies
- [Node.js](https://nodejs.org/uk/) 10+ and NPM
- [MongoDB](https://docs.mongodb.com/manual/installation/) 4.0 or later
- [PM2](https://www.npmjs.com/package/pm2) (npm install pm2 -g)
- Postfix `sudo apt-get install postfix`
- make, gcc, g++ to build bcrypt (`sudo apt-get install make build-essential g++`)
- nginx

### Configuration
All configuration is in: `server/xcom-api.config.js`

### Deployment

Initial:

* `pm2 deploy server/xcom-api.config.js dev setup`

or
* `pm2 deploy server/xcom-api.config.js prod setup`

Consequent

* `npm run deploy:dev`

or
* `npm run deploy:prod`
