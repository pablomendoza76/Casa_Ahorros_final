// svgo.config.js
module.exports = {
  multipass: true,
  plugins: [
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill', 'stroke', 'width', 'height']
      }
    }
  ]
};
