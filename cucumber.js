module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
    format: [
      '@cucumber/pretty-formatter',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    paths: ['src/features/*.feature'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
