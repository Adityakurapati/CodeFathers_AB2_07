# firebase_realtime_data_loader.py
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import datetime
import json

# Setup
# 1. Install dependencies: pip install firebase-admin
# 2. Download your Firebase service account key (JSON file) from Firebase Console
#    (Project Settings > Service accounts > Generate new private key)
# 3. Make sure your info.json file is in the same directory as this script
# 4. Run this script: python firebase_realtime_data_loader.py

# Initialize Firebase with the correct database URL
cred = credentials.Certificate('./info.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://thirdeye-c5b2e-default-rtdb.firebaseio.com'
})

# Helper function to add data with specified ID
def add_with_id(path, data_list):
    ref = db.reference(path)
    
    for item in data_list:
        item_id = item.pop('id')  # Extract and remove id field
        
        # Convert fields that would be server timestamps in Firestore
        # For Realtime DB, we'll use the current timestamp
        if path == "bloodRequests":
            if 'createdAt' not in item or item['createdAt'] is None:
                item['createdAt'] = datetime.datetime.now().isoformat()
            if 'updatedAt' not in item:
                item['updatedAt'] = datetime.datetime.now().isoformat()
        
        child_ref = ref.child(item_id)
        child_ref.set(item)
    
    print(f"Added {len(data_list)} records to '{path}' path")

# Sample data - modified to match the TS access patterns
blood_requests = [
    {
        "id": "req1",
        "fullName": "John Smith",
        "bloodType": "O+",
        "contactNumber": "+1 (555) 123-4567",
        "hospitalName": "Ruby Hall Clinic",
        "reason": "surgery",
        "urgencyLevel": "within24Hours",
        "address": "40 Sassoon Road, Pune, Maharashtra, India",
        "createdAt": datetime.datetime(2025, 3, 6, 10, 30).isoformat(),
        "status": "pending",
        "location": {
            "lat": 18.5308,
            "lng": 73.8475
        },
        "requesterId": "user123"
    },
    {
        "id": "req2",
        "fullName": "Sarah Johnson",
        "bloodType": "A-",
        "contactNumber": "+1 (555) 987-6543",
        "hospitalName": "Jehangir Hospital",
        "reason": "accident",
        "urgencyLevel": "immediate",
        "address": "32 Sassoon Road, Pune, Maharashtra, India",
        "createdAt": datetime.datetime(2025, 3, 7, 8, 15).isoformat(),
        "status": "pending",
        "location": {
            "lat": 18.5193,
            "lng": 73.8567
        },
        "requesterId": "user456"
    },
    {
        "id": "req3",
        "fullName": "Robert Williams",
        "bloodType": "B+",
        "contactNumber": "+1 (555) 234-5678",
        "hospitalName": "Aditya Birla Memorial Hospital",
        "reason": "chronic condition",
        "urgencyLevel": "within12Hours",
        "address": "Aditya Birla Hospital Road, Thergaon, Pune, Maharashtra, India",
        "createdAt": datetime.datetime(2025, 3, 6, 15, 45).isoformat(),
        "status": "accepted",
        "location": {
            "lat": 18.6210,
            "lng": 73.7868
        },
        "requesterId": "user789",
        "donorId": "user001"
    },
    {
        "id": "req4",
        "fullName": "Maria Garcia",
        "bloodType": "AB+",
        "contactNumber": "+1 (555) 345-6789",
        "hospitalName": "Sahyadri Hospital",
        "reason": "childbirth",
        "urgencyLevel": "within24Hours",
        "address": "Plot No. 30-C, Karve Road, Pune, Maharashtra, India",
        "createdAt": datetime.datetime(2025, 3, 6, 20, 10).isoformat(),
        "status": "pending",
        "location": {
            "lat": 18.5073,
            "lng": 73.8289
        },
        "requesterId": "user234"
    },
    {
        "id": "req5",
        "fullName": "David Brown",
        "bloodType": "O-",
        "contactNumber": "+1 (555) 456-7890",
        "hospitalName": "KEM Hospital",
        "reason": "emergency",
        "urgencyLevel": "immediate",
        "address": "489, Rasta Peth, Pune, Maharashtra, India",
        "createdAt": datetime.datetime(2025, 3, 7, 7, 30).isoformat(),
        "status": "pending",
        "location": {
            "lat": 18.5233,
            "lng": 73.8717
        },
        "requesterId": "user567"
    }
]

campaigns = [
    {
        "id": "camp1",
        "title": "City General Hospital Blood Drive",
        "organizer": "City General Hospital",
        "date": "2025-03-15",
        "time": "9:00 AM - 5:00 PM",
        "location": "City General Hospital Auditorium",
        "description": "Annual blood drive to replenish hospital blood bank supplies. All blood types needed, especially O- and B-.",
        "bloodTypesNeeded": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
        "image": "https://firebasestorage.googleapis.com/v0/b/bloodlink-app.appspot.com/o/campaigns%2Fhospital-drive.jpg",
        "registeredDonors": 45,
        "targetDonors": 100,
        "coordinates": {  # Match TS code which expects coordinates not location
            "lat": 40.7128,
            "lng": -74.0060
        }
    },
    {
        "id": "camp2",
        "title": "Red Cross Mobile Blood Drive",
        "organizer": "American Red Cross",
        "date": "2025-03-20",
        "time": "10:00 AM - 4:00 PM",
        "location": "Central Park Community Center",
        "description": "Mobile blood drive with the Red Cross bloodmobile. Walk-ins welcome, but appointments preferred.",
        "bloodTypesNeeded": ["O+", "O-", "B+", "B-"],
        "image": "https://firebasestorage.googleapis.com/v0/b/bloodlink-app.appspot.com/o/campaigns%2Fredcross-drive.jpg",
        "registeredDonors": 28,
        "targetDonors": 50,
        "coordinates": {  # Match TS code which expects coordinates not location
            "lat": 40.7729,
            "lng": -73.9712
        }
    },
    {
        "id": "camp3",
        "title": "University Campus Blood Donation Week",
        "organizer": "University Medical School",
        "date": "2025-03-25",
        "time": "11:00 AM - 7:00 PM",
        "location": "University Student Center",
        "description": "Week-long blood drive at the university campus. Special focus on reaching young donors. Free refreshments provided.",
        "bloodTypesNeeded": ["A+", "A-", "AB+", "AB-"],
        "image": "https://firebasestorage.googleapis.com/v0/b/bloodlink-app.appspot.com/o/campaigns%2Funiversity-drive.jpg",
        "registeredDonors": 75,
        "targetDonors": 200,
        "coordinates": {  # Match TS code which expects coordinates not location
            "lat": 40.7291,
            "lng": -73.9965
        }
    }
]

# Add campaign registrations
campaign_registrations = [
    {
        "id": "creg1",
        "campaignId": "camp2",
        "userId": "user001",
        "status": "registered",
        "createdAt": datetime.datetime.now().isoformat()
    }
]

# Qualification questions - from TypeScript code
qualification_questions = [
    {
        "id": "q1",
        "text": "Have you donated blood in the last 8 weeks?",
        "order": 1
    },
    {
        "id": "q2",
        "text": "Do you weigh at least 110 pounds (50 kg)?",
        "order": 2
    },
    {
        "id": "q3",
        "text": "Have you been feeling well and in good health?",
        "order": 3
    },
    {
        "id": "q4",
        "text": "Have you had a tattoo in the last 3 months?",
        "order": 4
    },
    {
        "id": "q5",
        "text": "Have you traveled to malaria-risk areas in the last year?",
        "order": 5
    }
]

# Donor qualifications - matching donorQualifications collection in TS
donor_qualifications = [
    {
        "id": "dq1", 
        "requestId": "req3",
        "donorId": "user001",
        "status": "qualified",
        "responses": {
            "q1": False,
            "q2": True,
            "q3": True,
            "q4": False,
            "q5": False
        },
        "createdAt": datetime.datetime(2025, 3, 6, 16, 0).isoformat(),
        "updatedAt": datetime.datetime(2025, 3, 6, 16, 15).isoformat()
    }
]

# Add increment function similar to the one in TS code
def add_increment_function():
    increment_ref = db.reference('/__increment')
    increment_ref.set({
        "description": "Simulates Firestore's increment function for the Realtime Database",
        "function": "function(current, amount) { return (current || 0) + amount; }"
    })
    print("Added increment function to the database")

# Add all data to Realtime Database
def load_all_data():
    print("Starting data upload to Firebase Realtime Database...")
    
    # Add data to each path
    add_with_id("bloodRequests", blood_requests)
    add_with_id("campaigns", campaigns)
    add_with_id("campaignRegistrations", campaign_registrations)
    add_with_id("qualificationQuestions", qualification_questions)
    add_with_id("donorQualifications", donor_qualifications)
    
    # Add the increment function
    add_increment_function()
    
    print("Data upload complete!")

if __name__ == "__main__":
    load_all_data()