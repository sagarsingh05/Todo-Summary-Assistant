const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.getTodos = async (req, res) => {
  const { data, error } = await supabase.from('todos').select();
  if (error) return res.status(500).send(error);
  res.json(data);
};

exports.addTodo = async (req, res) => {
  try {
    console.log("POST /todos", req.body);

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Missing todo title' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Error in addTodo:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) return res.status(500).send(error);
  res.sendStatus(204);
};

exports.summarizeTodos = async (req, res) => {
  try {
    const { data: todos, error: fetchError } = await supabase.from('todos').select();
    if (fetchError) throw fetchError;

    if (!todos || todos.length === 0) {
      return res.status(400).json({ error: "No todos to summarize." });
    }

    const todoText = todos.map(t => `• ${t.title}`).join('\n');

    
    const prompt = ` summarize all pending to-dos which will be sent to my slack channel automatically:\n\n${todoText}\n\nSummary:`;

    const cohereResponse = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const message = cohereResponse.data.generations[0].text.trim();

    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `📝 Todo Summary:\n${message}`
    });

    console.log("Slack response sent.");
    res.status(200).json({ message: "Summary sent to Slack!" });

  } catch (err) {
    console.error("Error in summarizeTodos:", err);
    res.status(500).json({ error: err.message });
  }
};
