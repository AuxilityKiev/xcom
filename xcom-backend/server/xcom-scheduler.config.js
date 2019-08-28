module.exports = {
    apps: [
        {
            name: `xcom-scheduler`,
            script: './lib/bin/scheduler.js',
            watch: false,
            log_date_format: 'DD-MM-YYYY HH:mm:ss.SSS',
            env: {
                APP_NAME: `xcom-scheduler`,
                APP_VERSION_CODE: 1,
                APP_VERSION_NAME: '1.0.0',
                MONGO_URI: 'mongodb://localhost:27017',
                FTP_CLIENT_HOST: 'ftp.stoletov.ru',
                FTP_CLIENT_USER: 'ws_ImagineWeb',
                FTP_CLIENT_PASSWORD: '9035-51109aefc7dd',
                LOGS_FOLDER: 'logs/',
                NODE_ENV: 'development',
                MONGO_DB: 'xcom-dev', // TODO: ozerki db
                ECOM_URL: 'http://ws-dev.erkapharm.com:8990/ecom_test/hs/',
                ECOM_USER: 'SiteOz',
                ECOM_PASS: 'AV74D8',
                SBOL_GATEWAY_URL: 'https://3dsec.sberbank.ru/payment/'
            },
            env_prod: {
                NODE_ENV: 'production',
                MONGO_DB: 'xcom-prod', // TODO: ozerki db
                ECOM_URL: 'http://ws.erkapharm.com:8990/ecom/hs/',
                ECOM_USER: 'SiteOz',
                ECOM_PASS: 'AV74D8',
                SBOL_GATEWAY_URL: 'https://securepayments.sberbank.ru/payment/'
            }
        }
    ],
    deploy: {
        dev: {
            user: 'root',
            host: [
                {
                    host : '138.68.86.83',
                    port: '22'
                }
            ],
            ref  : `origin/xcom-backend/v3`,
            repo: `git@github.com:bolein/xcom.git`,
            path: `/var/www/xcom-scheduler/dev/`,
            'post-deploy' : `cd xcom-backend/server && npm install && npm run build && pm2 startOrReload xcom-scheduler.config.js`
        },
        prod: {
            user: 'ideast',
            host: [
                {
                    host : 'app.6030000.ru',
                    port: '54422'
                }
            ],
            ref  : `origin/xcom-backend/v3`,
            repo: `git@github.com:bolein/xcom.git`,
            path: `/var/www/xcom-scheduler/prod/`,
            'post-deploy' : `cd xcom-backend/server && npm install && npm run build && pm2 startOrReload xcom-scheduler.config.js --env prod`
        }
    }
}
