"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const assistant_1 = require("../../src/ai/assistant");
suite('AI Assistant Test Suite', () => {
    let aiAssistant;
    setup(() => {
        aiAssistant = new assistant_1.MappAIAssistant();
    });
    test('Should provide code suggestions', async () => {
        const code = `
            MappSdk.setAlias("test");
        `;
        const suggestions = await aiAssistant.getCodeAssistance(code);
        assert.ok(suggestions.length > 0);
    });
    test('Should generate quick fixes', async () => {
        const code = `
            engage("key");
        `;
        const fixes = await aiAssistant.getQuickFixes(code, 'Missing required parameters');
        assert.ok(fixes.length > 0);
        assert.ok(fixes[0].code.includes('engage("key",'));
    });
});
//# sourceMappingURL=ai.test.js.map