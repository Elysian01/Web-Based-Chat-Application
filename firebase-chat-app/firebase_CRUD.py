import requests
from firebase import firebase

db_url = "https://friendsunited-18244.firebaseio.com/"
db_name = "friendsunited-18244/"
firebase = firebase.FirebaseApplication(db_url, None)  # None is for auth

data = {
    "Name": "Abhishek Gupta",
    "Email": "abhishek@gmail.com",
    "Phone": "1234567890"
}

# Customer is table name
#result = firebase.post(db_name + "Customer", data)
# print(result)  # Returns Key ID


# For Retrieving Data
result = firebase.get(db_name + "Customer", "")
print(result)

# For Updating Data (key is require)
result = firebase.put(db_name + "Customer/" +
                      "-MWoxFMpENFLBjjrVXz_", "Name", "Jay")
print(result)

# For Deleting
result = firebase.delete(db_name + "Customer/",
                         "-MWoxFMpENFLBjjrVXz_")
print(result)
