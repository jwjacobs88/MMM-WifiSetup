const path = require('path');

module.exports = {
    entry: './WiFiForm.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'WiFiForm.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    mode: 'development'
};
