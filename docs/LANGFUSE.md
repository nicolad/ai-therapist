# Langfuse Integration Guide

This project integrates [Langfuse](https://langfuse.com/) for prompt management and LLM observability, allowing you to:

- Manage agent prompts centrally without code changes
- Track and analyze LLM generations
- Version control prompts
- A/B test different prompt variations

## Setup

### 1. Install Dependencies

The required packages are already installed:

```bash
pnpm add langfuse @mastra/langfuse @mastra/observability
```

### 2. Environment Variables

Add your Langfuse credentials to `.env.local`:

```env
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
```

Get these from your [Langfuse Dashboard](https://cloud.langfuse.com).

## Usage

### Using Agents with Langfuse Prompts

We provide two ways to use agents:

#### Option 1: Static Agents (Current Default)

These use hardcoded instructions defined in the code:

```typescript
import { therapeuticAgent, storyTellerAgent } from '@/src/agents';

// Use directly - prompts are in the code
const response = await therapeuticAgent.generate("Help me with anxiety");
```

#### Option 2: Dynamic Agents with Langfuse

These fetch prompts from Langfuse, allowing updates without deployments:

```typescript
import { 
  createTherapeuticAgentWithLangfuse,
  createStoryTellerAgentWithLangfuse 
} from '@/src/agents';

// Create agent with Langfuse prompt and tracing
const agent = await createTherapeuticAgentWithLangfuse("therapeutic-agent");

// Use the agent - prompts are managed in Langfuse
const response = await agent.generate("Help me with anxiety");

// Note: Langfuse tracing options are attached to the agent
// You can access them via (agent as any)._langfuseTracingOptions if needed
```

### Creating Prompts in Langfuse

1. Go to your [Langfuse Dashboard](https://cloud.langfuse.com)
2. Navigate to **Prompts** → **New Prompt**
3. Create a prompt with one of these names:
   - `therapeutic-agent` - for the therapeutic audio agent
   - `story-teller-agent` - for the interactive storytelling agent
4. Add your prompt content (you can use the existing instructions from `src/agents/index.ts` as a starting point)
5. Save and publish the prompt

### Example: Creating a Custom Agent

```typescript
import { langfuse } from '@/src/agents';
import { Agent } from '@mastra/core/agent';
import { buildTracingOptions } from '@mastra/observability';
import { withLangfusePrompt } from '@mastra/langfuse';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { Memory } from '@mastra/memory';

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Fetch prompt from Langfuse
const prompt = await langfuse.getPrompt("my-custom-prompt");
const tracingOptions = buildTracingOptions(withLangfusePrompt(prompt));

// Create agent
const customAgent = new Agent({
  id: "custom-agent",
  name: "My Custom Agent",
  instructions: prompt.prompt,
  model: deepseek("deepseek-chat"),
  memory: new Memory({ /* your storage config */ }),
});

// Attach tracing options
(customAgent as any)._langfuseTracingOptions = tracingOptions;
```

## Benefits

### 1. **Centralized Prompt Management**

- Update prompts in Langfuse without redeploying
- Version control all prompt changes
- Rollback to previous versions if needed

### 2. **Observability**

- Track all LLM generations
- Monitor costs and latency
- Debug prompt performance
- Analyze user interactions

### 3. **Experimentation**

- A/B test different prompts
- Compare performance metrics
- Iterate quickly on prompt engineering

### 4. **Collaboration**

- Non-technical team members can update prompts
- Review prompt changes before deployment
- Share prompts across projects

## Migration Path

To migrate existing agents to use Langfuse:

1. **Create prompts in Langfuse** - Copy existing instructions to Langfuse
2. **Update code** - Replace static agent usage with `createXAgentWithLangfuse()`
3. **Test** - Verify the agent works with Langfuse prompts
4. **Deploy** - Your prompts are now managed centrally

## Monitoring

View your agent activity in Langfuse:

1. Go to **Traces** to see all generations
2. Filter by agent name or prompt
3. Analyze costs, latency, and user feedback
4. Use **Sessions** to track multi-turn conversations

## Best Practices

1. **Use descriptive prompt names** - e.g., `therapeutic-agent-v2`, `story-teller-short-form`
2. **Version your prompts** - Langfuse handles versioning automatically
3. **Test in staging first** - Use different Langfuse projects for dev/prod
4. **Monitor regularly** - Check the dashboard for errors or performance issues
5. **Document prompt changes** - Add notes when creating new prompt versions

## Resources

- [Langfuse Documentation](https://langfuse.com/docs)
- [Mastra Observability Docs](https://docs.mastra.ai/observability)
- [Prompt Engineering Guide](https://langfuse.com/docs/prompts)
