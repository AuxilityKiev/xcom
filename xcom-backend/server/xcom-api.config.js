// abstract environment for all apps
const absEnv = {
    MONGO_URI: 'mongodb://localhost:27017',
    FTP_CLIENT_HOST: 'ftp.stoletov.ru',
    FTP_CLIENT_USER: 'ws_ImagineWeb',
    FTP_CLIENT_PASSWORD: '9035-51109aefc7dd',
    LOGS_FOLDER: 'logs/',
    MANZANA_CASH_URL: 'http://crmozerki.manzanagroup.ru:8083/posprocessing.asmx',
    MANZANA_CLIENT_URL: 'https://cosnozerki.manzanagroup.ru/customerofficeservice/',
    APP_VERSION_CODE: 2,
    APP_VERSION_NAME: '2.1.0',
}

module.exports = {
    apps: [
        {
            name: `xcom-api-ozerki-v` + absEnv.APP_VERSION_CODE,
            script: './lib/bin/index.js',
            watch: false,
            log_date_format: 'DD-MM-YYYY HH:mm:ss.SSS',
            exec_mode: 'fork',
            max_memory_restart: "500M",
            env: {
                ...absEnv,
                APP_NAME: `xcom-api-ozerki-v` + absEnv.APP_VERSION_CODE,
                PORT: '1444' + absEnv.APP_VERSION_CODE,
                IMAGE_FOLDER: '/var/www/xcom/static/images/',
                FCM_SERVER_KEY: 'AAAAVhiMKRg:APA91bEl1BmfXz7nBNiAK8FLmlG0VDX-fEMNdIG4P6yV6gyOXGbK3YqOYW0m-R-D7-MWFKtLF3L0cSU2U8kJXCUfN5byHNXtqMlrmbGb1VJHbCIsi-CwuuyUFQQ-MIuJ5xDJPN_wjLN-',
                NODE_ENV: 'development',
                MONGO_DB: 'xcom-dev', // TODO: ozerki db
                IMAGE_URL: 'http://138.68.86.83/static/images/',
                ECOM_URL: 'http://ws-dev.erkapharm.com:8990/ecom_test/hs/',
                ECOM_USER: 'SiteOz',
                ECOM_PASS: 'AV74D8',
                SBOL_GATEWAY_URL: 'https://3dsec.sberbank.ru/payment/'
            },
            env_prod: {
                NODE_ENV: 'production',
                MONGO_DB: 'xcom-prod', // TODO: ozerki db
                IMAGE_URL: 'https://app.6030000.ru/static/images/',
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
            ref  : `origin/xcom-backend/dev/v` + absEnv.APP_VERSION_CODE,
            repo: `git@github.com:bolein/xcom.git`,
            path: `/var/www/xcom-api/dev/v${absEnv.APP_VERSION_CODE}/`,
            'post-deploy' : `cd xcom-backend/server && npm install && npm run build && pm2 startOrReload xcom-api.config.js`
        },
        prod: {
            user: 'ideast',
            host: [
                {
                    host : 'app.6030000.ru',
                    port: '54422'
                }
            ],
            ref  : `origin/xcom-backend/prod/v${absEnv.APP_VERSION_CODE}`,
            repo: `git@github.com:bolein/xcom.git`,
            path: `/var/www/xcom-api/prod/v${absEnv.APP_VERSION_CODE}/`,
            'post-deploy' : `cd xcom-backend/server && npm install && npm run build && pm2 startOrReload xcom-api.config.js --env prod`
        }
    }
}
