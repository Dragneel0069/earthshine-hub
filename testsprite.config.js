/**
 * TestSprite Configuration
 * 
 * Note: For MCP (Model Context Protocol) usage, the API key should be configured
 * in your Cursor MCP server settings, not in this file.
 * 
 * To configure the API key in Cursor:
 * 1. Open Cursor Settings
 * 2. Navigate to MCP Servers / TestSprite configuration
 * 3. Add your API key from https://www.testsprite.com/dashboard/settings/apikey
 */

module.exports = {
  // API key should be set in MCP server configuration
  // Get your API key from: https://www.testsprite.com/dashboard/settings/apikey
  apiKey: process.env.TESTSPRITE_API_KEY || '',
  
  // Project configuration
  projectPath: __dirname,
  localPort: 8080,
  type: 'frontend',
  testScope: 'codebase',
};


