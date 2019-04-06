module.exports = {
  coverageDirectory: "coverage",
  setupFiles: ["<rootDir>/enzyme.config.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/assets/img"]
};
