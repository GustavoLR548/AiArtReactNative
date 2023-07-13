import requests
import json

url = "https://api.monsterapi.ai/apis/add-task"

payload = json.dumps({
    "model": "txt2img",
    "data": {
        "prompt": "A castle in the middle of a snowy forest",
        "negprompt": "",
        "samples": 1,
        "steps": 50,
        "aspect_ratio": "square",
        "guidance_scale": 7.5,
        "seed": 2414
    }
})
headers = {
    'x-api-key': 'kQbXy2azcA6vK8l9aNYzOa4gIylWTP2Q35gZw5yB',
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODUwMjU4MDYsImlhdCI6MTY4MjQzMzgwNiwic3ViIjoiYWRmZDk5NWZhMGVhMWIyZDdlN2I0ZDI4ODUxN2NkYWUifQ.u8sCfSBxbUGNaomOeb2s9-9afz7kZxyDQKRKTZpkN1k',
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
response_data = response.json()

url = "https://api.monsterapi.ai/apis/task-status"

payload = json.dumps({
    "process_id": response_data["process_id"]
})
headers = {
    'x-api-key': 'kQbXy2azcA6vK8l9aNYzOa4gIylWTP2Q35gZw5yB',
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODUwMjU4MDYsImlhdCI6MTY4MjQzMzgwNiwic3ViIjoiYWRmZDk5NWZhMGVhMWIyZDdlN2I0ZDI4ODUxN2NkYWUifQ.u8sCfSBxbUGNaomOeb2s9-9afz7kZxyDQKRKTZpkN1k',
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
response_data = response.json()

while response_data["response_data"]["status"] != "COMPLETED":
    response = requests.request("POST", url, headers=headers, data=payload)
    response_data = response.json()

print("Completed!")
print(response.text)
