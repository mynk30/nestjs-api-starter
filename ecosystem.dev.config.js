// module.exports = {
//     apps: [
//         {
//             name: '2nest-fastify-dev',

//             script: './node_modules/@nestjs/cli/bin/nest.js',
//             args: 'start --watch',

//             interpreter: 'node',

//             env: {
//                 NODE_ENV: 'development',
//                 PORT: 3010,
//             },

//             watch: false,

//             autorestart: true,

//             log_file: './logs/dev.log',
//             merge_logs: true,
//             time: true,
//         },
//     ],
// };
module.exports = {
    apps: [
        {
            name: '2nest-fastify-dev',
            script: 'node_modules/ts-node/dist/bin.js',
            args: 'src/main.ts',

            env: {
                NODE_ENV: 'development',
                PORT: 3010,
            },

            watch: ['src'],
            ignore_watch: ['node_modules', 'logs', 'documentation'],
            autorestart: true,

            log_file: './logs/dev.log',
            merge_logs: true,
            time: false,
        },
    ],
};