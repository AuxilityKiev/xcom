module.exports = {
    apps: [
        {
            name: `xcom-script-runner`,
            script: './lib/bin/runScript.js',
            args: process.argv.slice(process.argv.indexOf('--') + 1).join(' '),
            watch: false,
            autorestart: false,
            log_date_format: 'DD-MM-YYYY HH:mm:ss.SSS',
            env: {
                APP_NAME: `xcom-script-runner`,
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
            },
            env_prod: {
                NODE_ENV: 'production',
                MONGO_DB: 'xcom-prod', // TODO: ozerki db
                ECOM_URL: 'http://ws.erkapharm.com:8990/ecom/hs/',
                ECOM_USER: 'SiteOz',
                ECOM_PASS: 'AV74D8',
            }
        }
    ]
}
