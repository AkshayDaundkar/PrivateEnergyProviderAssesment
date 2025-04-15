from aiosmtplib import SMTP
from email.message import EmailMessage
import os

async def send_email_with_screenshot(email: str, subject: str, body: str, screenshot_bytes: bytes):
    message = EmailMessage()
    message["From"] = os.getenv("MAIL_USER")
    message["To"] = email
    message["Subject"] = subject

    message.set_content(body)
    message.add_attachment(
        screenshot_bytes,
        maintype="image",
        subtype="png",
        filename="dashboard.png"
    )

    smtp = SMTP(hostname="smtp.gmail.com", port=587, start_tls=True)
    await smtp.connect()
    await smtp.login(os.getenv("MAIL_USER"), os.getenv("MAIL_PASS"))
    await smtp.send_message(message)
    await smtp.quit()
