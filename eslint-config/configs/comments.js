import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import commentsRules from '../rules/comments.js';

/** @type {import('eslint').Linter.Config[]} */
export default [comments.recommended, commentsRules];