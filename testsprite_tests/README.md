# TestSprite Configuration Guide

## Setting Up TestSprite API Key

TestSprite uses MCP (Model Context Protocol) for integration with Cursor. The API key needs to be configured in your **Cursor MCP server settings**, not in the project files.

### Step 1: Get Your API Key

1. Visit [https://www.testsprite.com/dashboard/settings/apikey](https://www.testsprite.com/dashboard/settings/apikey)
2. Log in to your TestSprite account
3. Generate a new API key if you don't have one

### Step 2: Configure in Cursor MCP Settings

The API key should be configured in Cursor's MCP server configuration. The exact location depends on your Cursor version:

**Option A: Cursor Settings UI**
1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Search for "MCP" or "Model Context Protocol"
3. Find the TestSprite server configuration
4. Add your API key in the configuration

**Option B: Cursor Configuration File**
The MCP server configuration is typically in:
- Windows: `%APPDATA%\Cursor\User\globalStorage\mcp.json` or similar
- macOS: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
- Linux: `~/.config/Cursor/User/globalStorage/mcp.json`

Look for a configuration like:
```json
{
  "mcpServers": {
    "testsprite": {
      "apiKey": "your_api_key_here"
    }
  }
}
```

### Step 3: Verify Configuration

After setting up the API key, you can verify it by running TestSprite commands through Cursor.

## Project Configuration

The project is configured to run on:
- **Port**: 8080
- **Type**: Frontend (React + Vite)
- **Test Scope**: Codebase (full project testing)

## Running Tests

Once the API key is configured:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server should be running on http://localhost:8080

3. Use Cursor's AI assistant to run TestSprite commands:
   - Generate test plans
   - Execute tests
   - View test results

## Files Generated

- `testsprite_tests/tmp/code_summary.json` - Project code summary
- `testsprite_tests/tmp/config.json` - TestSprite configuration
- `testsprite_tests/tmp/prd_files/` - PRD files (if generated)


