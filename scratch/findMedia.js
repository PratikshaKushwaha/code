const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Pratiksha/.gemini/antigravity/brain/c179068a-b40e-4a76-83a4-6ef005b56556/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.media && obj.media.length > 0) {
      console.log('step:', obj.step_index, 'source:', obj.source, 'media:', JSON.stringify(obj.media));
    }
  } catch (e) {}
}
