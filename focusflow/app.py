from flask import Flask, render_template, request, redirect, url_for, session, flash
import firebase_admin
from firebase_admin import credentials, firestore, auth
import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Make sure to change this!

# Initialize Firebase Admin using your service account key
cred = credentials.Certificate('firebase_config.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# ---------------------
# User Login
# ---------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # Dummy implementation for login.
        # In production, consider using Firebase Authentication REST API or client SDK.
        try:
            user = auth.get_user_by_email(email)
            # Password verification would occur on the client-side or via a secure endpoint.
            session['user'] = email  # Store user identifier in session
            return redirect(url_for('dashboard'))
        except Exception as e:
            flash("Invalid credentials. Please try again.")
            return redirect(url_for('login'))
    return render_template('login.html')


# ---------------------
# Dashboard with Today's Sessions and Weekly Stats
# ---------------------
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    user_email = session['user']
    today = datetime.datetime.now().date()
    todays_sessions = []
    weekly_stats = {}
    
    # Retrieve all sessions for the logged-in user
    sessions_ref = db.collection('sessions')
    query = sessions_ref.where('user', '==', user_email).stream()
    
    for doc in query:
        data = doc.to_dict()
        session_timestamp = data.get('timestamp')
        if session_timestamp:
            session_date = session_timestamp.date()
            # Filter sessions for today
            if session_date == today:
                todays_sessions.append(data)
            # Aggregate session data for the last 7 days
            if (today - session_date).days < 7:
                day_str = session_date.strftime("%A")
                if day_str not in weekly_stats:
                    weekly_stats[day_str] = {'total_study_time': 0, 'session_count': 0}
                weekly_stats[day_str]['total_study_time'] += data.get('study_time', 0)
                weekly_stats[day_str]['session_count'] += 1

    return render_template('dashboard.html', sessions=todays_sessions, weekly_stats=weekly_stats)


# ---------------------
# Session Input and Timer Page
# ---------------------
@app.route('/')
def index():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')


# ---------------------
# Logging a New Session
# ---------------------
@app.route('/start_session', methods=['POST'])
def start_session():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    subject = request.form.get('subject')
    duration = int(request.form.get('duration', 60))  # Duration in minutes; default is 60
    user_email = session['user']
    
    # Break the duration into cycles.
    # Here we assume one cycle is roughly 30 minutes (25 min study + 5 min break)
    num_cycles = duration // 30
    
    # Log each cycle as a separate 25-minute study session.
    for i in range(num_cycles):
        session_data = {
            'user': user_email,
            'subject': subject,
            'study_time': 25,  # Each cycle contributes 25 minutes of study time
            'timestamp': datetime.datetime.now()
        }
        db.collection('sessions').add(session_data)
    
    flash(f"Session for '{subject}' started. Logged {num_cycles} cycle(s).")
    return redirect(url_for('dashboard'))


# ---------------------
# Detailed Stats Page
# ---------------------
@app.route('/stats')
def stats():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    user_email = session['user']
    sessions_ref = db.collection('sessions')
    today = datetime.datetime.now().date()
    week_sessions = []
    weekly_stats = {}
    
    query = sessions_ref.where('user', '==', user_email).stream()
    
    for doc in query:
        data = doc.to_dict()
        session_timestamp = data.get('timestamp')
        if session_timestamp:
            session_date = session_timestamp.date()
            if (today - session_date).days < 7:
                week_sessions.append(data)
                day_str = session_date.strftime("%A")
                if day_str not in weekly_stats:
                    weekly_stats[day_str] = {'total_study_time': 0, 'session_count': 0}
                weekly_stats[day_str]['total_study_time'] += data.get('study_time', 0)
                weekly_stats[day_str]['session_count'] += 1
    
    return render_template('stats.html', sessions=week_sessions, weekly_stats=weekly_stats)


# ---------------------
# User Logout
# ---------------------
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
    