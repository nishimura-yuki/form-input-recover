let targets = {
  ie: '11',
};
if(process.env.NODE_ENV === 'test'){
  targets = {
    node: 'current'
  };
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets
      },
    ],
  ],
  plugins: [
    'emotion'
  ]
};