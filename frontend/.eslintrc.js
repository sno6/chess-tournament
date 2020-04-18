module.exports = {
	parser: "@typescript-eslint/parser", // Specifies the ESLint parser
	extends: [
		"plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
		"plugin:@typescript-eslint/recommended" // Uses the recommended rules from @typescript-eslint/eslint-plugin
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true // Allows for the parsing of JSX
		}
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		"indent": [
			"error",
			2,
			{
				"SwitchCase": 1
			}
		],
		"max-len": [
			"error",
			{
				"code": 80,
				"ignoreComments": true,
				"ignoreTemplateLiterals": true,
				"ignoreStrings": true
			}
		],
		"react/prop-types": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
	},
	settings: {
		react: {
			version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
		}
	}
}