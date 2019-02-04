module.exports = {
  presets: ["react-app"],
  plugins: [
    process.env.BUILD === "cjs"
      ? "@babel/plugin-transform-modules-commonjs"
      : null,
  ].filter(Boolean),
};
