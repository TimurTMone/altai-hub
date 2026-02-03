-- Journey: AI for Teachers – tools for teaching life
INSERT INTO journeys (slug, name, description, order_index)
VALUES (
  'ai-for-teachers',
  'AI for Teachers',
  'Learn the essential AI and digital tools to use in your teaching: Canva, Coursera, lesson planning, quizzes, and more.',
  6
);

-- Challenges for AI for Teachers
INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Canva basics', 'Create a simple classroom poster or one-page handout in Canva. Submit a link to your design and one sentence on how you would use it with students.', 50, 1
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'Coursera for your subject', 'Complete one short course or module on Coursera (or similar) relevant to your subject. Share the course name, link, and one takeaway you will use in class.', 50, 2
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 1, 'AI lesson plan', 'Use an AI tool (e.g. ChatGPT, Claude, or a lesson-planning app) to draft a 30-minute lesson plan. Submit the prompt you used and the output (or link), plus one edit you made.', 50, 3
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Quiz or poll in class', 'Run a live quiz or poll with your students using a tool like Kahoot, Quizizz, or Google Forms. Share what you used, the topic, and one thing you learned from the results.', 100, 4
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'Canva Magic Design / AI', 'Use Canva’s AI features (e.g. Magic Design, Magic Write, or text-to-image) to create a teaching resource. Submit the resource and a short note on how it saved you time.', 100, 5
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 2, 'One LMS or classroom tool', 'Set up or improve one workflow in a tool like Google Classroom, Microsoft Teams, or another LMS (assignments, feedback, or announcements). Describe what you did and one tip for other teachers.', 100, 6
FROM journeys WHERE slug = 'ai-for-teachers';

INSERT INTO challenges (journey_id, level, title, description, xp_reward, order_index)
SELECT id, 3, 'Full resource pack', 'Create a small “resource pack” for one unit: at least a slide deck, one handout, and one quiz or reflection. Use at least two tools (e.g. Canva + Forms). Share links and a short overview.', 150, 7
FROM journeys WHERE slug = 'ai-for-teachers';
