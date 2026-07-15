exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const token = process.env.GITHUB_TOKEN;
  const owner = 'saminaakhtarabasi123-ops';
  const repo = 'Gmchs';
  const path = 'index.html';
  const branch = 'main';

  try {
    const { content, password } = JSON.parse(event.body);
    if (password !== 'nfz2026') {
      return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect password' }) };
    }

    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'edit-mode' }
    });
    const getData = await getRes.json();
    const sha = getData.sha;

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'User-Agent': 'edit-mode', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update site content via Edit Mode',
        content: Buffer.from(content).toString('base64'),
        sha: sha,
        branch: branch
      })
    });
    const putData = await putRes.json();

    if (putRes.ok) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 500, body: JSON.stringify({ error: putData.message }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
