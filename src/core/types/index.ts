/**
 * Type definitions for TapTap MCP Server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * MAC Token interface
 * Used for MAC (Message Authentication Code) Token authentication
 */
export interface MacToken {
  /** mac_key id, The key identifier */
  kid: string;

  /** Token type, such as "mac" */
  token_type: string;

  /** mac key */
  mac_key: string;

  /** mac algorithm name, such as "hmac-sha-1" */
  mac_algorithm: string;
}

/**
 * Handler Context
 * Passed to all tool handlers
 */
export interface HandlerContext {
  projectPath?: string;
  macToken?: MacToken;
  env?: 'production' | 'rnd';
}

/**
 * Tool Registration Interface
 * Combines tool definition and handler in a single object
 */
export interface ToolRegistration<T = any> {
  /** MCP Tool definition (JSON Schema) */
  definition: Tool;

  /** Tool handler function */
  handler: (args: T, context: HandlerContext) => Promise<string>;

  /** Whether this tool requires authentication */
  requiresAuth?: boolean;
}

/**
 * Resource Registration Interface
 * Combines resource definition and handler in a single object
 */
export interface ResourceRegistration {
  /** Resource URI */
  uri: string;

  /** Resource name */
  name: string;

  /** Resource description */
  description?: string;

  /** MIME type */
  mimeType?: string;

  /** Resource handler function */
  handler: (args?: any) => Promise<string>;
}

/**
 * Prompt Registration Interface
 * Combines prompt definition and handler in a single object
 */
export interface PromptRegistration {
  /** Prompt name */
  name: string;

  /** Prompt description */
  description?: string;

  /** Prompt arguments */
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;

  /** Prompt handler function */
  handler: (args?: any) => Promise<{
    messages: Array<{
      role: string;
      content: {
        type: string;
        text: string;
      };
    }>;
  }>;
}
