import os
import random
import requests
from datetime import datetime
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Formilo 24/7 Traffic Engine")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
BASE_SITE_URL = os.getenv("BASE_SITE_URL", "https://formilo-jzcl.vercel.app")
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL")

CAMPAIGNS = [
    {
        "exam": "SSC CGL 2026",
        "slug": "ssc-cgl-passport-photo",
        "size": "50 KB",
        "tag": "#SSCCGL #GovtJobs"
    },
    {
        "exam": "UP Police Constable",
        "slug": "up-police-constable-passport-photo",
        "size": "50 KB",
        "tag": "#UPPolice #Bharti2026"
    },
    {
        "exam": "Railway RRB NTPC",
        "slug": "rrb-ntpc-passport-photo",
        "size": "50 KB",
        "tag": "#RRBNTPC #RailwayJobs"
    },
    {
        "exam": "SSC GD Constable",
        "slug": "ssc-gd-signature",
        "size": "20 KB",
        "tag": "#SSCGD #Constable"
    },
    {
        "exam": "UPSC Civil Services (CSE)",
        "slug": "upsc-cse-passport-photo",
        "size": "50 KB",
        "tag": "#UPSC #CSE2026"
    }
]

def send_telegram_broadcast():
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return {"error": "Credentials missing", "token_set": bool(TELEGRAM_BOT_TOKEN), "chat_id_set": bool(TELEGRAM_CHAT_ID)}

    campaign = random.choice(CAMPAIGNS)
    tool_url = f"{BASE_SITE_URL}/exam/{campaign['slug']}"

    message = (
        f"🚨 <b>{campaign['exam']} Document Alert!</b>\n\n"
        f"👉 Kya aapka photo ya signature upload error de raha hai?\n"
        f"⚡ <b>1-Click Instant Resizer</b> (Strictly &lt; {campaign['size']})\n"
        f"🔒 100% Free &amp; Private (Browser Memory Processing)\n\n"
        f"🔗 <b>Format Document Now:</b>\n{tool_url}\n\n"
        f"{campaign['tag']} #Formilo"
    )

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    try:
        res = requests.post(url, json=payload, timeout=10)
        return {"status_code": res.status_code, "response": res.json()}
    except Exception as e:
        return {"error": str(e)}

def keep_alive_ping():
    target_url = RENDER_EXTERNAL_URL
    if not target_url:
        return
    try:
        requests.get(f"{target_url.rstrip('/')}/ping", timeout=15)
    except Exception:
        pass

scheduler = BackgroundScheduler()
scheduler.add_job(keep_alive_ping, 'interval', minutes=10)
scheduler.add_job(send_telegram_broadcast, 'interval', hours=3)
scheduler.start()

@app.get("/")
def home():
    return {
        "status": "online",
        "env_check": {
            "token_configured": bool(TELEGRAM_BOT_TOKEN),
            "chat_id": TELEGRAM_CHAT_ID or "NOT_SET"
        }
    }

@app.get("/ping")
def ping():
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

@app.get("/trigger-broadcast")
def manual_broadcast():
    result = send_telegram_broadcast()
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
