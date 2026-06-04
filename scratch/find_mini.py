import json

log_path = "/Users/skaissts/.gemini/antigravity/brain/762db382-66a8-4615-a9d8-625d83cef64c/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            content = step.get("content", "")
            if not content:
                continue
            if "мини" in content.lower() or "контейнер" in content.lower():
                print(f"Step {step.get('step_index')}: {content[:200]}...")
        except Exception as e:
            pass
