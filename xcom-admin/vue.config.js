module.exports = {
    devServer: {
        proxy: {
            '/admin-api/*': {
                target: 'http://localhost:3000',
                secure: false
            }
        }
    }
}
