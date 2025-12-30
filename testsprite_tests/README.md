# TestSprite Testing Configuration

TestSprite is an AI-powered testing platform that integrates with your IDE via MCP (Model Context Protocol).

## Quick Start

### Step 1: Get Your API Key

1. Visit [TestSprite Dashboard](https://www.testsprite.com/dashboard/settings/apikey)
2. Sign in or create a free account
3. Generate a new API key

### Step 2: Configure Your IDE

TestSprite runs as an MCP server in your IDE. Add the following configuration:

#### For Cursor

1. Open Cursor Settings (`⌘⇧J` or `Ctrl+Shift+J`)
2. Navigate to **Tools & Integration**
3. Click **Add custom MCP**
4. Add this configuration:

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

5. Verify the green dot appears on the TestSprite MCP server icon

**Important:** Disable Cursor's "Run in Sandbox" mode for full functionality:
- Go to `Cursor Settings` → `Chat` → `Auto-Run Mode`
- Set to **"Ask Every Time"** or **"Run Everything"**

#### For VS Code

1. Install the MCP extension if not already installed
2. Add the same configuration to your MCP settings

### Step 3: Start Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Server should be running on http://localhost:8080

3. In your IDE chat, simply say:
   ```
   Help me test this project with TestSprite
   ```

## Project Configuration

This project is configured with:

| Setting | Value |
|---------|-------|
| Port | 8080 |
| Type | Frontend (React + Vite) |
| Test Scope | Codebase |
| Framework | React |
| Build Tool | Vite |

## TestSprite Features

- **One-Command Testing**: Just say "Help me test this project with TestSprite"
- **AI-Driven**: Automatically generates PRDs, test plans, and test code
- **Cloud Execution**: Tests run in secure TestSprite cloud environments
- **Auto-Fix**: Get detailed results and fix suggestions

## Files Generated

- `testsprite_tests/tmp/code_summary.json` - Project code analysis
- `testsprite_tests/tmp/config.json` - Runtime configuration
- `testsprite_tests/standard_prd.json` - Generated PRD
- `testsprite_tests/testsprite_frontend_test_plan.json` - Test plan

## Useful Commands

Once TestSprite MCP is configured, you can ask your AI assistant:

- "Help me test this project with TestSprite"
- "Run tests for the Dashboard component"
- "Generate a test plan for authentication"
- "Fix failing tests"

## Documentation

- [TestSprite Docs](https://docs.testsprite.com/)
- [MCP Installation Guide](https://docs.testsprite.com/mcp/getting-started/installation)
- [Troubleshooting](https://docs.testsprite.com/mcp/troubleshooting/installation-issues)

## Support

- Website: [testsprite.com](https://www.testsprite.com)
- Docs: [docs.testsprite.com](https://docs.testsprite.com)
