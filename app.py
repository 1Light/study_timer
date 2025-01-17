from flask import Flask, render_template, request, session, redirect
from flask_mysqldb import MySQL
import yaml
import os
import re

app = Flask(__name__)

# Get the absolute path to db.yaml
base_dir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(base_dir, 'db.yaml')

# Load database configuration from YAML file
with open(db_path) as f:
    db = yaml.safe_load(f)

# Configure database connection
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']

# Initialize MySQL
mysql = MySQL(app)

# Secret key for session management
app.secret_key = "12345"

# Signup route for handling user registration
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    message = ""

    if request.method == 'POST':
        userDetails = request.form

        name = userDetails['name']
        email = userDetails['email']
        username = userDetails['username']
        password = userDetails['password']
        confirm_password = userDetails['confirm_password']

        # Validate user input
        if not name or not email or not username or not password or not confirm_password:
            message = 'Please fill out all fields!'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            message = 'Invalid email address!'
        elif not name.isalpha():
            message = 'Name must contain only letters!'
        elif not username.isalpha():
            if username.isdigit():
                message = 'Username must contain at least 3 letters!'
            else:
                message = 'Username must contain only letters!'
        elif len(password) < 5:
            message = 'Password must be at least 5 characters long!'
        elif password != confirm_password:
            message = 'Passwords do not match!'
        else:
            # Check if user already exists
            cur = mysql.connection.cursor()
            cur.execute('SELECT * FROM users WHERE email = %s', (email,))
            record = cur.fetchone()

            if record:
                message = 'Account already exists!'
            else:
                # Insert new user into the database
                cur.execute('INSERT INTO users (name, email, username, password) VALUES (%s, %s, %s, %s)', (name, email, username, password))
                mysql.connection.commit()
                message = 'You have successfully registered!'
                cur.close()

                # Redirect to main page upon successful registration
                return render_template('main.html', message=message)

            cur.close()

    return render_template('signup.html', message=message)

# Login route for handling user login
@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ""

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Validate user credentials
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users WHERE email=%s AND password=%s', (email, password))
        record = cur.fetchone()
        cur.close()

        if record:
            # Store user session upon successful login
            session['loggedin'] = True
            session['email'] = record[2]
            session['password'] = record[4]
            message = 'Logged in successfully!'
            return render_template('main.html', message=message)
        else:
            message = 'Invalid email or password!'

    return render_template('login.html', message=message)

# Route for home page
@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template('home.html')

# Route for landing page
@app.route('/landing', methods=['GET', 'POST'])
def landing():
    return render_template('landing.html')

# Route for main page
@app.route('/main', methods=['GET', 'POST'])
def main():
    return render_template('main.html')

# Run the application
if __name__ == '__main__':
    app.run(debug=True)