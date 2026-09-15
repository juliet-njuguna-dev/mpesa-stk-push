const payBtn = document.getElementById('payBtn');
const statusEl = document.getElementById('status');
const phoneInput = document.getElementById('phone');
const amountInput = document.getElementById('amount');

const API_URL = 'http://localhost:5000'; // we'll change this after deploying

function formatPhone(raw) {
  let p = raw.trim();
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('+')) p = p.slice(1);
  return p;
}

payBtn.addEventListener('click', async () => {
  const phone = formatPhone(phoneInput.value);
  const amount = amountInput.value;

  if (!/^254(7|1)\d{8}$/.test(phone)) {
    statusEl.textContent = 'Enter a valid Kenyan phone number.';
    return;
  }
  if (!amount || amount < 1) {
    statusEl.textContent = 'Enter an amount of at least 1.';
    return;
  }

  payBtn.disabled = true;
  statusEl.textContent = 'Check your phone for the M-Pesa prompt...';

  try {
    const res = await fetch(`${API_URL}/stkpush`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount }),
    });
    const data = await res.json();

    if (data.ResponseCode === '0') {
      statusEl.textContent = 'Request sent! Complete it on your phone.';
    } else {
      statusEl.textContent = 'Something went wrong. Try again.';
    }
  } catch (err) {
    statusEl.textContent = 'Could not reach the server.';
  } finally {
    payBtn.disabled = false;
  }
});