import sqlite3

def showallrecords():
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
        cursor.execute('SELECT * FROM ExpenseTracker')
        registers = []


        for item in cursor.fetchall():
            registers.append(item)

        cursor.execute('SELECT SUM(Amount) FROM ExpenseTracker')
        total_expense = cursor.fetchone()

        return registers, total_expense

    except Exception as error:
        print(error)
        return "Error"
    
def save_newexpense(date, description, amount, payee, mode):
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
 
        if date != "" and description != "" and amount != "" and payee != "" and mode != "":
            cursor.execute("INSERT INTO ExpenseTracker (Date, Payee, Description, Amount, ModeOfPayment) VALUES (?, ?, ?, ?, ?)",(date, payee, description, amount, mode))
            connect.commit()
            connect.close()
            msg = "success"
            return msg
        else:
            msg = "failure"
            return msg
    except Exception as Error:
        print(Error)
        msg = "failure"
        return msg

def show_selectedExpense(id):
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
        cursor.execute("SELECT * FROM ExpenseTracker WHERE ID =?", (id,))
        editexpense = []
        for item in cursor.fetchone():
            editexpense.append(item)
        return editexpense
 
    except Exception as error:
        print(error)
        msg = "Error"
        return msg

def update_expense(id, date, description, amount, payee, mode):
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
 
        if date != "" and description != "" and amount != "" and payee != "" and mode != "":
            cursor.execute("UPDATE ExpenseTracker SET Date =?, Description =?, Amount =?, Payee =?, ModeOfPayment =? WHERE id =?",
                             (date, description, amount, payee, mode, id,))
            connect.commit()
            connect.close()
            msg = "success"
            return msg
        else:
            msg = "failure"
            return msg
    except Exception as Error:
        print(Error)
        msg = "failure"
        return msg

def delete_expense(id):
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
 
        cursor.execute("DELETE FROM ExpenseTracker WHERE ID =?", (id,))
        connect.commit()
        connect.close()
        msg = "success"
        return msg
       
    except Exception as Error:
        print(Error)
        msg = "failure"
        return msg

def delete_records(ids):
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
        cursor.execute("DELETE FROM ExpenseTracker WHERE ID IN ({seq})".format(seq=','.join(['?']*len(ids))), ids)

        connect.commit()
        connect.close()
        msg = "success"
        return msg
       
    except Exception as Error:
        print(Error)
        msg = "failure"
        return msg

def delete_all_records():
    try:
        connect = sqlite3.connect("views/database/Expense Tracker.db")
        cursor = connect.cursor()
        cursor.execute("DELETE FROM ExpenseTracker")

        connect.commit()
        connect.close()
        msg = "success"
        return msg
       
    except Exception as Error:
        print(Error)
        msg = "failure"
        return msg
