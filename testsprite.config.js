/**
 * TestSprite Configuration
 * 
 * TestSprite uses MCP (Model Context Protocol) for IDE integration.
 * The MCP server runs via npx and connects to TestSprite cloud for testing.
 * 
 * IDE Configuration (add to your IDE's MCP settings):
 * {
 *   "mcpServers": {
 *     "TestSprite": {
 *       "command": "npx",
 *       "args": ["@testsprite/testsprite-mcp@latest"],
 *       "env": {
 *         "API_KEY": "your-api-key"
 *       }
 *     }
 *   }
 * }
 * 
 * Get your API key from: https://www.testsprite.com/dashboard/settings/apikey
 */

module.exports = {
  // Project configuration for TestSprite
  projectPath: __dirname,
  
  // Local development server port (must match vite.config.ts)
  localPort: 8080,
  
  // Project type: 'frontend' | 'backend' | 'fullstack'
  type: 'frontend',
  
  // Test scope: 'codebase' | 'component' | 'e2e'
  testScope: 'codebase',
  
  // Framework detection
  framework: 'react',
  
  // Build tool
  buildTool: 'vite',
  
  // Test output directory
  testOutputDir: 'testsprite_tests',
  
  // Directories to exclude from analysis
  excludeDirs: [
    'node_modules',
    'dist',
    '.git',
    'testsprite_tests/tmp'
  ],
  
  // File patterns to include in testing
  includePatterns: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/pages/**/*',
    'src/components/**/*'
  ],
  
  // Supabase integration (for backend testing)
  supabase: {
    enabled: true,
    functionsDir: 'supabase/functions'
  }
};
