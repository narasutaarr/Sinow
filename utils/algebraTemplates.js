// ---------- helper ----------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randSign = () => (Math.random() < 0.5 ? -1 : 1);
const randNonZero = (min, max) => {
  let n;
  do { n = randInt(min, max); } while (n === 0);
  return n;
};
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const isInt = Number.isInteger;

// ---------- format ekspresi ----------
const term = (n, v) => (n === 1 ? v : n === -1 ? `-${v}` : `${n}${v}`);
const addTerm = (n, v) =>
  n === 0 ? '' : n > 0 ? ` + ${n === 1 ? '' : n}${v}` : ` - ${n === -1 ? '' : -n}${v}`;
const addConst = (n) => (n === 0 ? '' : n > 0 ? ` + ${n}` : ` - ${-n}`);
const linear = (a, b) => `${term(a, 'x')}${addConst(b)}`;
const quad = (s, p) => `x²${addTerm(s, 'x')}${addConst(p)}`;

// susun soal: 1 jawaban benar + 3 pengecoh unik
const build = (question, correct, candidates, fallback) => {
  const wrong = [];
  for (const c of candidates) {
    if (c !== correct && !wrong.includes(c)) wrong.push(c);
  }
  let i = 1;
  while (wrong.length < 3) {
    const f = fallback(i++);
    if (f !== correct && !wrong.includes(f)) wrong.push(f);
  }
  return {
    question,
    options: shuffle([correct, ...shuffle(wrong).slice(0, 3)]),
    correct_answer: correct,
  };
};

// ---------- template ----------

// 1. Persamaan linear satu variabel: ax + b = c
const linearEq = () => {
  const x = randNonZero(-9, 9);
  const a = randInt(2, 9);
  const b = randNonZero(-12, 12);
  const c = a * x + b;
  const f = (v) => `x = ${v}`;
  const cand = [-x, x + 1, x - 1, c - b]; // c - b = lupa membagi dengan a
  if (isInt((c + b) / a)) cand.push((c + b) / a); // salah tanda b
  return build(
    `Tentukan nilai x dari persamaan ${linear(a, b)} = ${c}`,
    f(x), cand.map(f), (i) => f(x + i + 1)
  );
};

// 2. Variabel di kedua ruas: ax + b = cx + d
const bothSides = () => {
  const x = randNonZero(-8, 8);
  let a, c;
  do { a = randInt(1, 9); c = randInt(1, 9); } while (a === c);
  const b = randNonZero(-10, 10);
  const d = (a - c) * x + b;
  const f = (v) => `x = ${v}`;
  const cand = [-x, x + 1, x - 1];
  if (isInt((d + b) / (a - c))) cand.push((d + b) / (a - c));
  if (isInt((d - b) / (a + c))) cand.push((d - b) / (a + c));
  return build(
    `Nilai x yang memenuhi ${linear(a, b)} = ${linear(c, d)} adalah`,
    f(x), cand.map(f), (i) => f(x + i + 1)
  );
};

// 3. Menyederhanakan bentuk aljabar: p(x + a) + q(x + b)
const simplify = () => {
  let p, q;
  do { p = randInt(2, 5); q = randSign() * randInt(2, 5); } while (p + q === 0);
  const a = randNonZero(-6, 6);
  const b = randNonZero(-6, 6);
  const A = p + q;
  const B = p * a + q * b;
  const expr = `${p}(x${addConst(a)}) ${q > 0 ? '+' : '-'} ${Math.abs(q)}(x${addConst(b)})`;
  const cand = [
    linear(A, a + b),        // tidak mengalikan konstanta
    linear(A, p * a),        // suku kedua terlewat
    linear(A, p * a - q * b),// salah tanda
    linear(p - q, B),        // salah menjumlah koefisien x
  ];
  return build(
    `Bentuk paling sederhana dari ${expr} adalah`,
    linear(A, B), cand, (i) => linear(A, B + i)
  );
};

// 4. Substitusi: ax² + bx + c untuk x = k
const substitution = () => {
  const a = randInt(1, 4);
  const b = randNonZero(-6, 6);
  const c = randNonZero(-9, 9);
  const k = randNonZero(-4, 4);
  const val = a * k * k + b * k + c;
  const cand = [
    (a * k) ** 2 + b * k + c, // kuadrat ikut koefisien
    a * k * k - b * k + c,    // salah tanda suku b
    2 * a * k + b * k + c,    // x² dianggap 2x
    a * k * k + b * k - c,
  ].map(String);
  return build(
    `Nilai dari ${term(a, 'x²')}${addTerm(b, 'x')}${addConst(c)} untuk x = ${k} adalah`,
    String(val), cand, (i) => String(val + i)
  );
};

// 5. Pertidaksamaan linear: ax + b < c (tanda berbalik jika a negatif)
const inequality = () => {
  const a = randSign() * randInt(2, 7);
  const x0 = randInt(-6, 6);
  const b = randNonZero(-10, 10);
  const c = a * x0 + b;
  const op = Math.random() < 0.5 ? '<' : '>';
  const flip = (o) => (o === '<' ? '>' : '<');
  const rop = a > 0 ? op : flip(op);
  const f = (o, v) => `x ${o} ${v}`;
  const cand = [
    f(flip(rop), x0),  // tanda salah (lupa membalik / terbalik)
    f(rop, x0 + 1),
    f(rop, x0 - 1),
    f(rop, -x0),
  ];
  return build(
    `Penyelesaian dari pertidaksamaan ${linear(a, b)} ${op} ${c} adalah`,
    f(rop, x0), cand, (i) => f(rop, x0 + i + 1)
  );
};

// 6. SPLDV: x + y = s dan x - y = d
const system = () => {
  const x = randInt(1, 9);
  const y = randInt(1, 9);
  const askX = Math.random() < 0.5;
  const ans = askX ? x : y;
  const other = askX ? y : x;
  const cand = [other, ans + 1, ans - 1, x + y].map(String);
  return build(
    `Diketahui x + y = ${x + y} dan x - y = ${x - y}. Nilai ${askX ? 'x' : 'y'} adalah`,
    String(ans), cand, (i) => String(ans + i + 1)
  );
};

// 7. Perkalian bentuk aljabar: (x + a)(x + b)
const expand = () => {
  const a = randNonZero(-8, 8);
  const b = randNonZero(-8, 8);
  const s = a + b;
  const p = a * b;
  const cand = [
    quad(p, s),       // koefisien tertukar
    quad(s, -p),      // salah tanda konstanta
    quad(s, s),
    quad(a * b, a - b),
  ];
  return build(
    `Hasil penjabaran (x${addConst(a)})(x${addConst(b)}) adalah`,
    quad(s, p), cand, (i) => quad(s, p + i)
  );
};

const templates = {
  linear: linearEq,
  bothSides,
  simplify,
  substitution,
  inequality,
  system,
  expand,
};

const TOPICS = Object.keys(templates);

// buat `count` soal unik dari topik yang dipilih
const generateQuestions = (count = 5, topics = TOPICS) => {
  const valid = topics.filter((t) => templates[t]);
  if (valid.length === 0) {
    throw new Error(`Topik tidak dikenal. Pilihan: ${TOPICS.join(', ')}`);
  }
  const result = [];
  const seen = new Set();
  let tries = 0;
  while (result.length < count && tries < count * 20) {
    tries++;
    const q = templates[valid[randInt(0, valid.length - 1)]]();
    if (seen.has(q.question)) continue;
    seen.add(q.question);
    result.push(q);
  }
  return result;
};

module.exports = { generateQuestions, TOPICS };