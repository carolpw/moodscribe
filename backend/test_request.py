import requests

url = "https://7yx5ndt6qaclpxjy3vfajtwpaa0krylu.lambda-url.eu-north-1.on.aws/analyze"
payload = {
    "entry": "Today was a productive day. I felt motivated and accomplished my goals."
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    print("Response JSON:", response.json())
except requests.RequestException as e:
    print("Request failed:", e)
