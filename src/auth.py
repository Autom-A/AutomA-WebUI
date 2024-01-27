from flask import Blueprint, render_template, redirect, url_for, request    
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User
from flask_login import login_user, login_required, logout_user
from src.utils.configuration import Configuration
from . import db

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    # This code only create user specified in config
    config = Configuration()
    config.read_configuration()
    username = config.get("server_user")
    password = config.get("server_password")

    user = User.query.filter_by(name=username).first() 

    if not user: 
        new_user = User(name=username, password=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')

    user = User.query.filter_by(name=username).first()

    if not user or not check_password_hash(user.password, password):
        return redirect(url_for('auth.login'))
    login_user(user)
    return redirect(url_for('main.app'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))