import { type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { createRule, getParserServices } from '../util';

type MessageIds = 'forbiddenFunctionSpread';

export default createRule<[], MessageIds>({
  defaultOptions: [],
  name: 'no-misused-spread',
  meta: {
    docs: {
      description:
        "Disallow spread operator that shouldn't be spread most of the time",
      recommended: 'stylistic',
      requiresTypeChecking: true,
    },
    messages: {
      forbiddenFunctionSpread:
        'Spreading a function is almost always a mistake. Did you forget to call the function?',
    },
    schema: [],
    type: 'suggestion',
  },
  create: (context): TSESLint.RuleListener => {
    const listener = (node: TSESTree.SpreadElement): void => {
      const services = getParserServices(context);
      const checker = services.program.getTypeChecker();

      const tsNode = services.esTreeNodeToTSNodeMap.get(node.argument);
      const type = checker.getTypeAtLocation(tsNode);

      if (
        type.getProperties().length === 0 &&
        type.getCallSignatures().length > 0
      ) {
        context.report({
          node,
          messageId: 'forbiddenFunctionSpread',
        });
      }
    };
    return {
      SpreadElement: listener,
    };
  },
});