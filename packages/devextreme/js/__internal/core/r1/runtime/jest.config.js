module.exports = {
	projects: [
		'<rootDir>/react/jest.config.js',
		'<rootDir>/inferno-hooks/jest.config.js',
	],
  transform: {
    "inferno-hooks/.*\.[jt]sx?$": ["babel-jest", {babelrc: "<rootDir>/inferno-hooks/.babelrc.json"}],
	"react/.*\.[jt]sx?$": "babel-jest"
  },
}