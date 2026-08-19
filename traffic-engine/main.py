# main.py
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
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL")  # e.g., https://formilo-traffic-engine.onrender.com

# 1. High-Traffic Exam Presets Pool
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

# 2. Self-Ping Keep-Alive Worker (Prevents Render Free Tier Sleep)
def keep_alive_ping():
    target_url = RENDER_EXTERNAL_URL or os.getenv("RENDER_APP_URL")
    if not target_url:
        print("[Keep-Alive] RENDER_EXTERNAL_URL not configured. Local ping running.")
        return

    try:
        ping_url = f"{target_url.rstrip('/')}/ping"
        res = requests.get(ping_url, timeout=15)
        print(f"[Keep-Alive Ping] {datetime.now().strftime('%H:%M:%S')} -> Status: {res.status_code}")
    except Exception as e:
        print(f"[Keep-Alive Error] {e}")

# 3. Automated Telegram Traffic Broadcast Worker
def send_telegram_broadcast():
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[!] Telegram credentials missing. Skipping broadcast.")
        return

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
        print(f"[+] Broadcast sent for {campaign['exam']}: Status {res.status_code}")
    except Exception as e:
        print(f"[!] Broadcast failed: {e}")

# 4. Multi-Task Background Scheduler
scheduler = BackgroundScheduler()

# Render 15 min inactivity par sota hai, isliye har 10 min par self-ping
scheduler.add_job(keep_alive_ping, 'interval', minutes=10)

# Har 3 ghante me Telegram broadcast push
scheduler.add_job(send_telegram_broadcast, 'interval', hours=3)

scheduler.start()

# 5. API Endpoints
@app.get("/")
def home():
    return {
        "status": "online",
        "service": "Formilo Autonomous Traffic Engine",
        "uptime": "24/7 Keep-Alive Active",
        "self_ping_interval": "Every 10 minutes",
        "broadcast_interval": "Every 3 hours"
    }

@app.get("/ping")
def ping():
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/trigger-broadcast")
def manual_broadcast():
    send_telegram_broadcast()
    return {"message": "Broadcast triggered successfully."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
