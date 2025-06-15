module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    // Disable warnings for unused variables and imports
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",

    // Allow console.log in development
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",

    // Disable quotes rule completely
    quotes: "off",

    // Allow semicolons to be optional
    semi: ["error", "always"],

    // Allow empty functions
    "no-empty-function": "off",

    // Allow empty catch blocks
    "no-empty": ["error", { allowEmptyCatch: true }],

    // Allow unused expressions
    "no-unused-expressions": "off",

    // Allow unused labels
    "no-unused-labels": "off",

    // Allow unused private class members
    "no-unused-private-class-members": "off",

    // Allow unused rest properties
    "no-unused-rest-properties": "off",

    // Disable display name requirement
    "react/display-name": "off",

    // Disable duplicate keys check
    "no-dupe-keys": "off",

    // Disable unescaped entities check
    "react/no-unescaped-entities": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
