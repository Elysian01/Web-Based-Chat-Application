import random
import string
from firebase import firebase

db_url = "https://chat-app-5cf99-default-rtdb.firebaseio.com/"
db_name = "Chats/"
firebase = firebase.FirebaseApplication(db_url, None)  # None is for auth


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
    print(result)  # Returns Key ID


if __name__ == "__main__":

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
