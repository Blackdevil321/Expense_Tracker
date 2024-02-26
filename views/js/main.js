$(document).ready(function () {
  eel.fetchalldata()

  $('#tableData').on('change', '.table_check', function () {
    if ($('.table_check:checked').length > 0) {
      document.getElementById("delete_select_expense").disabled = false;
    }
    else {
      document.getElementById("delete_select_expense").disabled = true;
    }
    if ($('.table_check:checked').length == $('.table_check').length) {
      $('#all_checked').prop('checked', true);
    } else {
      $('#all_checked').prop('checked', false);
    }
  });

  $("#all_checked").change(function () {
    if ($(this).prop('checked')) {
      $('.table_check').not(this).prop('checked', true);
      document.getElementById("delete_select_expense").disabled = false;
    } else {
      $('.table_check').not(this).prop('checked', false);
      document.getElementById("delete_select_expense").disabled = true;
    }
  })

  $('#download_expense').on('click', function () {
    const expense_table = document.getElementById('tableData');
    debugger
    var style = {
      margin: 0.2,
      filename: 'MyExpense.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(expense_table).set(style).save();
  })
});

const select_month = () => {
  let selector = document.getElementById('selectmonth').value;
  let myexpense = document.getElementById("tableData");
  let tr = myexpense.getElementsByTagName('tr');
  let total_amount = 0;
  let currentDate = new Date();

  for (var i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName('td')[1];
    let amount = tr[i].getElementsByTagName('td')[4]

    if (td || amount) {
      let textValue = td.textContent || td.innerHTML;
      let amountValue = parseInt(amount.textContent || amount.innerHTML);
      let recordDate = new Date(textValue);

      if (selector == -1) {
        // Show records from the last month
        let lastMonth = new Date(currentDate);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        if (
          recordDate.getMonth() === lastMonth.getMonth() &&
          recordDate.getFullYear() === lastMonth.getFullYear()
        ) {
          total_amount += amountValue;
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } else if (selector == 0) {
        // Show records for the selected month
        if (
          currentDate.getMonth() + parseInt(selector) === recordDate.getMonth() &&
          currentDate.getFullYear() === recordDate.getFullYear()
        ) {
          total_amount += amountValue;
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
      else {
        total_amount += amountValue;
        tr[i].style.display = "";
      }
    }
  }
  document.getElementById("total_expense").value = total_amount;
}

const search_expenses = () => {
  let filter = document.getElementById('search').value.toUpperCase();
  let selector = document.getElementById('selectsearch').value;

  let myexpense = document.getElementById("tableData");
  let tr = myexpense.getElementsByTagName('tr');

  for (var i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName('td')[selector];

    if (td) {
      let textvalue = td.textContent || td.innerHTML;

      if (textvalue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function getCheckRecords() {
  var res = []
  $('.table_check:checked').each(function () {
    if ($(this).prop('checked')) {
      res.push($(this).attr("data-id"));
    }
  });
  return res
}

eel.expose(action_out)
function action_out(registers, total_expense) {
  registers.forEach(showdata)
  document.getElementById("total_expense").value = total_expense;
}

eel.expose(action_out_1)
function action_out_1(registers, total_expense) {
  alert(registers)
  registers.forEach(showdata)
  document.getElementById("total_expense").value = total_expense;
}
eel.expose(action_edit)
function action_edit(editexpense) {
  editexpense.forEach(get_array_values)
}

function get_array_values(item, index) {
  if (index == 1) {
    document.getElementById("Date_range").value = item;
  } else if (index == 2) {
    document.getElementById("payee").value = item;
  } else if (index == 3) {
    document.getElementById("description").value = item;
  } else if (index == 4) {
    document.getElementById("amount").value = item;
  } else if (index == 5) {
    document.getElementById("payment_mode").value = item;
  } else if (index == 0) {
    document.getElementById("id").value = item;
  } else { }
  document.getElementById("add_expense").style.display = 'none';
  document.getElementById("edit_expense").style.display = 'block';
}


function showdata(item, index) {
  var get_table = document.getElementById("expense_tbody");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");

  var id = item[0]
  td.innerHTML = '<input class="form-check-input table_check" type="checkbox" data-id="' + id + '" id="data_check"/>'
  td2.innerText = item[1]
  td3.innerText = item[2]
  td4.innerText = item[3]
  td5.innerText = item[4]
  td6.innerText = item[5]

  td7.innerHTML = '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="btn_edit(' + id + ')">Edit</button> | <button type="button" class="btn btn-sm btn-outline-danger" onclick="buttondelete((' + id + '))">Delete</button>'

  get_table.appendChild(tr)
  tr.appendChild(td)
  tr.appendChild(td2)
  tr.appendChild(td3)
  tr.appendChild(td4)
  tr.appendChild(td5)
  tr.appendChild(td6)
  tr.appendChild(td7)
}

// NEW EXPENSE
async function save_expense_js() {
  eel.btn_save($('#Date_range').val(), $('#description').val(), $('#amount').val(), $('#payee').val(), $('#payment_mode').val())
};

async function edit_expense_js() {
  eel.btn_edit($('#id').val(), $('#Date_range').val(), $('#description').val(), $('#amount').val(), $('#payee').val(), $('#payment_mode').val())
};

async function btn_edit(id) {
  eel.get_expense(id)
}

async function buttondelete(id) {
  if (confirm("Are you sure you want to delete the data?")) {
    eel.btn_delete(id)
  }
}

eel.expose(delete_return)
function delete_return(status) {
  if (status == "success") {
    location.href = "index.html";
  }
}
function delete_select_expense_js() {
  if (confirm("Are you sure you want to delete the data?")) {
    let ids = this.getCheckRecords()
    eel.delete_data(ids)
  }
}

function compute_amount() {
  var paid_amount = parseInt(document.getElementById("paid_amount").value);
  var total_person = parseInt(document.getElementById("total_person").value);
  var extra_amount = parseInt(document.getElementById("extra_amount").value);
  var split_amount = parseInt(0)
  if (paid_amount && total_person) {
    split_amount = paid_amount / total_person;
  }
  if (extra_amount) {
    split_amount += extra_amount
  }
  document.getElementById("split_amount").value = split_amount.toFixed(0);
}

function add_split_amount() {
  let split_amount = parseInt(document.getElementById("split_amount").value);
  if (split_amount) {
    document.getElementById("amount").value = split_amount;
  }
}
