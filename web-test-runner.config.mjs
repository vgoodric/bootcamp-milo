import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  rootDir: './',
  appIndex: 'demo/base-path/index.html',
  basePath: '/my-base-path',
  coverageConfig: {
    exclude: [
      '**/mocks/**',
      '**/node_modules/**',
      '**/test/**',
      '**/deps/**',
      // TODO: folders below need to have tests written for 100% coverage
      '**/ui/controls/**',
      '**/hooks/**',
    ],
  },
  plugins: [
    importMapsPlugin({}),
    {
      name: 'my-plugin',
      transform(context) {
        console.log(context);
        if (context.response.is('html')) {
          return { body: context.body.replace(/<base href=".*">/, '<base href="/foo/">') };
        }
      },
    },
  ],
};
