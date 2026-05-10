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
            time: true,
        },
    ],
};