module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-object-rest-spread',
        [
            'module-resolver',
            {
                root: ['./src',],
            },
        ],
    ],
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 'current',
                        },
                    },
                ],
            ],
        },
    },
    exclude: ['node_modules'],
};
