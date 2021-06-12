/* globals module */
module.exports = {
    "extends": "eslint:recommended",
    "env":{
        "es6": true,
        "nodejs": true
    },
    "rules":{
        'indent': ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        //'semi': ['error', 'always'],

        // override configuration set by extending 'eslint:recommended'
        'no-empty': 'warn',
        'no-cond-assign': ['error', 'always'],

    }
}