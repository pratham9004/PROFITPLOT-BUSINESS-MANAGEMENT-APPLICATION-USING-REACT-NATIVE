module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@context': './context',
            '@components': './components',
            '@screens': './screens',
            '@config': './config'
          }
        }
      ],
      ['module:react-native-dotenv'] // ✅ Add this line
    ]
  };
};
