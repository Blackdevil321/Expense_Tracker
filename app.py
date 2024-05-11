# https://dev.to/kodark/creating-a-modern-gui-for-your-python-application-2mlp

import eel
import random
from datetime import datetime
import sqlite3
import pyautogui

from views.models.expense import showallrecords, save_newexpense, show_selectedExpense, update_expense, delete_expense, delete_records, delete_all_records

eel.init('views')

connector = sqlite3.connect("views/database/Expense Tracker.db")
cursor = connector.cursor()
connector.execute(
  'CREATE TABLE IF NOT EXISTS ExpenseTracker (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Date DATETIME, Payee TEXT, Description TEXT, Amount FLOAT, ModeOfPayment TEXT)'
)
connector.commit()

 

@eel.expose   # for calling JS function
def fetchalldata():
    select_record, total_expense = showallrecords()
    eel.action_out(select_record, total_expense)

@eel.expose 
def btn_save(date, description, amount, payee, mode):
    save_newexpense(date, description, amount, payee, mode)

@eel.expose
def get_expense(id):
    select_expense = show_selectedExpense(id)
    eel.action_edit(select_expense)

@eel.expose 
def btn_edit(id,date, description, amount, payee, mode):
    update_expense(id, date, description, amount, payee, mode)

@eel.expose 
def btn_delete(id):
    msg = delete_expense(id)
    eel.delete_return(msg)

@eel.expose 
def delete_data(ids):
    ids = [int(i) for i in ids]
    msg = delete_records(ids)
    eel.delete_return(msg)

@eel.expose 
def delete_all_data():
    msg = delete_all_records()
    eel.delete_return(msg)

eel.start('templates/index.html', size = pyautogui.size())
