import random
import string
from firebase import firebase
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

db_url = "https://chat-app-5cf99-default-rtdb.firebaseio.com/"
db_name = "Chats/"
firebase = firebase.FirebaseApplication(db_url, None)  # None is for auth

# Script Global Variables
userGmail = "intmain1221@gmail.com"
userGmailPassword = "intmain@11"
receiverGmail = "abhig0209@gmail.com"


def unique_token(lenght):
    return ''.join(random.choice(
        string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(lenght))


def generate_room(problem):
    """
    function to generate randomly unique room names
    """
    token_length = 16
    if problem == "delivery":
        end_str = "-del"
        room_name = unique_token(token_length - len(end_str)) + end_str
    elif problem == "quality":
        end_str = "-qual"
        room_name = unique_token(token_length - len(end_str)) + "-qual"
    elif problem == "other":
        end_str = "-oth"
        room_name = unique_token(token_length - len(end_str)) + "-oth"
    return room_name


def post_room_name_to_fb(email, problem):
    table_name = problem
    room_name = generate_room(problem)
    data = {
        "room_name": room_name,
        "email": email,
        "resolved_status": False
    }

    result = firebase.post(table_name, data)
    return room_name


def generate_link(email, room_name):
    link = "http://127.0.0.1:5500/chat.html?email=" + \
        email + "&room=" + room_name
    link = link.replace("@", "%40")
    return link


def mail_service(client_email, problem):

    gmail = userGmail
    password = userGmailPassword
    msg = MIMEMultipart()
    msg['Subject'] = "Chat Room Token"
    msg['From'] = gmail
    msg['To'] = client_email

    room_name = post_room_name_to_fb(client_email, problem)
    link = generate_link(client_email, room_name)
    # for body
    body = """<h2 style  = 'font-family = tahoma;'>Thankyou for contacting us, we will solve your use please copy the room name and then, click below link and paste the room name</h2>"""
    body += """<br>Room Token: """ + room_name
    body += """<br><a href='""" + link + \
        """'>Click here to chat with customer service representative </a>"""
    body = MIMEText(body, 'html')
    msg.attach(body)

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(gmail, password)
        smtp.send_message(msg)

    print("Token with room name send to: ", client_email)


def sample_testing():
    testing = {
        1: {
            "email": "abhishek@gmail.com",
            "problem": "delivery"
        },
        2: {
            "email": "abhishek2@gmail.com",
            "problem": "delivery"
        },
        3: {
            "email": "abhishek3@gmail.com",
            "problem": "delivery"
        },
        4: {
            "email": "abhishek4@gmail.com",
            "problem": "quality"
        },
        5: {
            "email": "abhishek5@gmail.com",
            "problem": "quality"
        },
        6: {
            "email": "abhishek6@gmail.com",
            "problem": "quality"
        },
        7: {
            "email": "abhishek7@gmail.com",
            "problem": "other"
        },
        8: {
            "email": "abhishek8@gmail.com",
            "problem": "other"
        },
        9: {
            "email": "abhishek9@gmail.com",
            "problem": "other"
        },
    }

    for key, test in testing.items():
        # print(test["email"], test["problem"])
        post_room_name_to_fb(test["email"], test["problem"])


if __name__ == "__main__":
    # sample_testing()
    mail_service("abhig0209@gmail.com", "delivery")
