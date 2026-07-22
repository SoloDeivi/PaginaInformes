module.exports = {
  apps: [
    {
      name: 'informes-server',
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'server/index.ts',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
}
