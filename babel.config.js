module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '@modules': './src/modules',
                        '@shared': './src/shared',
                        '@assets': './assets',
                    },
                },
            ],
        ],
    };
};