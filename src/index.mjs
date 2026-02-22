import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const cjs = require('./index.js');

export const FlowHandler = cjs.FlowHandler;
export const FlowCode = cjs.FlowCode;
export const NodePrototype = cjs.NodePrototype;
export const WriteInterface = cjs.WriteInterface;
export const UiWriteInterface = cjs.UiWriteInterface;
export const ApiNode = cjs.ApiNode;
export const CaseNode = cjs.CaseNode;
export const ConditionNode = cjs.ConditionNode;
export const EndNode = cjs.EndNode;
export const InitNode = cjs.InitNode;
export const PrintNode = cjs.PrintNode;
export const QueueNode = cjs.QueueNode;
export const VariableNode = cjs.VariableNode;
export const MenuNode = cjs.MenuNode;
export const TalkNode = cjs.TalkNode;

export default cjs;
