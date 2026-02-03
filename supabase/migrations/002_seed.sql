-- Seed journeys and sample challenges
INSERT INTO journeys (slug, name, description, order_index) VALUES
  ('ai-builder', 'AI Builder', 'Build and ship AI-powered apps and features.', 1),
  ('prompt-engineering', 'Prompt Engineering', 'Master prompts and LLM workflows.', 2),
  ('content-creator', 'Content Creator', 'Create and distribute content with AI tools.', 3),
  ('vibe-coding', 'Vibe Coding', 'Code with AI pair programmers and rapid iteration.', 4),
  ('no-code', 'No-Code', 'Ship without code using no-code and low-code tools.', 5);

-- Get journey ids and insert challenges (using slug)
-- AI Builder
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Hello AI', 'Build a simple app that calls an AI API and returns a response.', 50, 1
FROM journeys WHERE slug = 'ai-builder';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Prompt in production', 'Deploy a small service that uses a prompt in a real endpoint.', 50, 2
FROM journeys WHERE slug = 'ai-builder';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'RAG pipeline', 'Implement a minimal RAG pipeline (ingest docs, query, return answers).', 100, 3
FROM journeys WHERE slug = 'ai-builder';

-- Prompt Engineering
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'System prompt', 'Write a system prompt that makes the model behave as a specific persona.', 50, 1
FROM journeys WHERE slug = 'prompt-engineering';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Structured output', 'Get the model to return valid JSON for a given schema.', 100, 2
FROM journeys WHERE slug = 'prompt-engineering';

-- Content Creator
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Blog post', 'Publish a short blog post written with AI assistance.', 50, 1
FROM journeys WHERE slug = 'content-creator';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Video script', 'Create a video script and share the first 2 minutes as a reel or short.', 100, 2
FROM journeys WHERE slug = 'content-creator';

-- Vibe Coding
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'CLI tool', 'Ship a small CLI tool built with AI assistance.', 50, 1
FROM journeys WHERE slug = 'vibe-coding';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Feature PR', 'Open a PR that adds one feature to an existing codebase, using AI.', 100, 2
FROM journeys WHERE slug = 'vibe-coding';

-- No-Code
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Automation', 'Build a workflow that automates a repetitive task (e.g. Zapier, Make).', 50, 1
FROM journeys WHERE slug = 'no-code';
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Landing page', 'Ship a landing page with a form and thank-you flow using a no-code builder.', 100, 2
FROM journeys WHERE slug = 'no-code';
