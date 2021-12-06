module.exports = {
    devServer: {
        proxy: {
            '/admin': {
                target: 'http://test.com',
                changeOrigin: true
            }
        }
    }
}