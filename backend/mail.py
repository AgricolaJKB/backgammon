import smtplib, ssl, os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


def create_message(message, subject, sender, receiver):
    message = EmailMessage()
    message.set_content(message)
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = receiver
    return message


def send_mail(receiver, message, subject):
    context = ssl.create_default_context()
    with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls(context=context)
        server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD"))
        message = create_message(message, subject, os.getenv("SMTP_USER"), receiver)
        server.send_message(message)


def notify(id, receiver, moves):
    subject = f"{id == 'w' and 'Black' or 'White'} hat gezogen"
    message = f"Es wurden folgende Züge gemacht:"
    for move in moves:
        message += f"\n{move.checker_id} von {move.start} nach {move.end}"
    message = f"Hier kannst du weiter spielen: https://agricolajkb.github.io?game={id}&user={id == 'w' and 'white' or 'black'}"
    send_mail(receiver, message, subject)
