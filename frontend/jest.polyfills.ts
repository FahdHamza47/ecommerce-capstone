/// <reference types="node" />

const {
  TextDecoder: NodeTextDecoder,
  TextEncoder: NodeTextEncoder,
} = require("node:util");
const {
  ReadableStream: NodeReadableStream,
  TransformStream: NodeTransformStream,
} = require("node:stream/web");
// 👇 Added MessageChannel and MessagePort here
const {
  BroadcastChannel: NodeBroadcastChannel,
  MessageChannel: NodeMessageChannel,
  MessagePort: NodeMessagePort,
} = require("node:worker_threads");

// 1. Attach Node globals FIRST
Object.defineProperties(globalThis, {
  TextDecoder: { value: NodeTextDecoder },
  TextEncoder: { value: NodeTextEncoder },
  ReadableStream: { value: NodeReadableStream },
  TransformStream: { value: NodeTransformStream },
  BroadcastChannel: { value: NodeBroadcastChannel },
  // 👇 Added to globalThis here
  MessageChannel: { value: NodeMessageChannel },
  MessagePort: { value: NodeMessagePort },
});

// 2. Require undici AFTER globals exist
const { Blob: NodeBlob, File: NodeFile } = require("node:buffer");
const {
  fetch: nodeFetch,
  Headers: NodeHeaders,
  FormData: NodeFormData,
  Request: NodeRequest,
  Response: NodeResponse,
} = require("undici");

Object.defineProperties(globalThis, {
  fetch: { value: nodeFetch, writable: true },
  Blob: { value: NodeBlob },
  File: { value: NodeFile },
  Headers: { value: NodeHeaders },
  FormData: { value: NodeFormData },
  Request: { value: NodeRequest },
  Response: { value: NodeResponse },
});

// Forces TypeScript to treat this as an isolated module
export {};
