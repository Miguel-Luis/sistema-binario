// Estado principal: cada posición del arreglo representa un bit.
// Se dibuja de izquierda a derecha desde el bit más significativo hasta el menos significativo.
let bits = Array(8).fill(0);

const candlesContainer = document.getElementById('candlesContainer');
const binaryValue = document.getElementById('binaryValue');
const decimalValue = document.getElementById('decimalValue');
const activePowers = document.getElementById('activePowers');

document.getElementById('addBtn').addEventListener('click', () => {
  // Añade un nuevo bit a la izquierda (más significativo).
  bits.unshift(0);
  render();
});

document.getElementById('removeBtn').addEventListener('click', () => {
  // Nunca bajar de 1 vela.
  if (bits.length > 1) {
    bits.shift();
    render();
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  bits = bits.map(() => 0);
  render();
});

function toggleBit(index) {
  bits[index] = bits[index] === 1 ? 0 : 1;
  render();
}

function render() {
  candlesContainer.innerHTML = '';

  const totalBits = bits.length;
  const activeLabels = [];
  let decimal = 0n;

  bits.forEach((bit, index) => {
    const exponent = totalBits - 1 - index;
    const value = 2n ** BigInt(exponent);

    if (bit === 1) {
      decimal += value;
      activeLabels.push(formatBigInt(value));
    }

    const card = document.createElement('div');
    card.className = `candle-card ${bit === 1 ? 'on' : ''}`;

    card.innerHTML = `
      <div class="power">
        <div class="pow">2<sup>${exponent}</sup></div>
        <div class="value">${formatBigInt(value)}</div>
      </div>

      <div class="candle-area">
        <div class="flame" aria-hidden="true"></div>
        <div class="wick" aria-hidden="true"></div>
        <div class="candle" aria-hidden="true"></div>
        <div class="base" aria-hidden="true">
          <div class="ring"></div>
          <div class="plate"></div>
        </div>
      </div>

      <button
        class="switch ${bit === 1 ? 'on' : ''}"
        aria-label="${bit === 1 ? 'Apagar' : 'Encender'} vela ${index + 1}"
        title="Haz clic para ${bit === 1 ? 'apagar' : 'encender'} esta vela"
      ></button>

      <div class="bit-value">${bit}</div>
    `;

    const switchBtn = card.querySelector('.switch');
    switchBtn.addEventListener('click', () => toggleBit(index));

    // Permite alternar también al pulsar la vela completa.
    const candleArea = card.querySelector('.candle-area');
    candleArea.style.cursor = 'pointer';
    candleArea.title = 'Haz clic para cambiar este bit';
    candleArea.addEventListener('click', () => toggleBit(index));

    candlesContainer.appendChild(card);
  });

  binaryValue.textContent = bits.join('');
  decimalValue.textContent = formatBigInt(decimal);
  activePowers.textContent = activeLabels.length
    ? activeLabels.join(' + ')
    : 'Ninguno';
}

// Formatea BigInt en grupos legibles sin perder precisión.
function formatBigInt(number) {
  const str = number.toString();
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

render();
