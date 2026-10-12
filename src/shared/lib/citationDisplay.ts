/**
 * Відображення цитат без службових префіксів (демо / архівна лекція)
 * та легке вирівнювання «злиплого» тексту зі слайдів PDF.
 */

const SERVICE_PREFIX_RE =
  /^\s*\[(?:Демонстраційний текст[^\]]*|Цитата з архівної лекції[^\]]*)\]\s*/u;

/** Маркери списку зі слайдів (без ASCII «-», щоб не рвати слова на кшталт об'єктів-аналогів). */
const BULLET_SPLIT_RE = /\s*(?:❑|□|■|●|•|▪|▸|►|✓|✔|−|–|—)\s*/gu;

/** Нумеровані пункти на кшталт «1) … 2) …» в одному абзаці. */
const NUMBERED_PAREN_RE = /\s+(\d+\))\s+/gu;

export type CitationDisplayBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] };

/** Прибирає службову позначку на початку тексту цитати. */
export function stripCitationServicePrefix(text: string): string {
  return text.replace(SERVICE_PREFIX_RE, '').trim();
}

function isHeadingLine(line: string): boolean {
  return (
    /^[А-ЯІЇЄҐA-Z0-9][А-ЯІЇЄҐA-Z0-9\s.«»"'-]{2,}$/u.test(line) &&
    line === line.toLocaleUpperCase('uk-UA') &&
    /[А-ЯІЇЄҐA-Z]/u.test(line)
  );
}

function isSectionNumLine(line: string): boolean {
  return /^\d+\.\d+(?:\.\d+)*\b/.test(line);
}

function isListStartLine(line: string): boolean {
  return line.startsWith('• ') || /^\d+\)\s+\S/u.test(line);
}

/**
 * Зливає «м'які» переноси PDF: продовження пункту не стає новим елементом списку.
 * Приклади: «…або\nпідприємцем…», «70\n80 %».
 */
function mergeSoftLineBreaks(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];

  const shouldMerge = (prev: string, next: string): boolean => {
    if (!prev || !next) return false;
    if (isListStartLine(next) || isHeadingLine(next) || isSectionNumLine(next)) return false;

    const prevEnd = prev.trimEnd();

    // Нове речення після кінця попереднього
    if (/[.!?]$/u.test(prevEnd) && /^[А-ЯІЇЄҐA-Z]/u.test(next)) return false;

    // Завершений пункт списку (;), далі новий зміст з великої
    if (/;$/u.test(prevEnd) && /^[А-ЯІЇЄҐA-Z•]/u.test(next)) return false;

    // Розрив числа: 70 + 80 % → 70-80 %
    if (/\d$/u.test(prevEnd) && /^\d/u.test(next)) return true;

    // Обрив на сполучнику / комі
    if (/(?:,|або|та|чи|-|–|—)$/iu.test(prevEnd)) return true;

    // Продовження з малої літери / дужки / лапок
    if (/^[а-яіїєґa-z(«"']+/u.test(next)) return true;

    // Попередній рядок явно не завершений розділовим знаком
    if (!/[.!;:]$/u.test(prevEnd) && !isListStartLine(next)) return true;

    return false;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      out.push('');
      continue;
    }
    if (out.length === 0) {
      out.push(line);
      continue;
    }

    // пропускаємо «порожні» маркери злиття через ''
    let prevIdx = out.length - 1;
    while (prevIdx >= 0 && out[prevIdx] === '') prevIdx -= 1;
    if (prevIdx < 0) {
      out.push(line);
      continue;
    }

    const prev = out[prevIdx];
    if (shouldMerge(prev, line)) {
      const joiner = /\d$/u.test(prev.trimEnd()) && /^\d/u.test(line) ? '-' : ' ';
      out[prevIdx] = `${prev}${joiner}${line}`.replace(/\s+/g, ' ').trim();
    } else {
      out.push(line);
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Розклинює типові артефакти extract зі слайдів:
 * злиплі слова, маркери списку в рядок, номери розділів посеред абзацу.
 */
export function normalizeCitationTypography(text: string): string {
  // Зберігаємо навмисні переноси; стискаємо лише пробіли всередині рядка.
  let t = text
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // пробіл між малою/цифрою/дужкою і великою (кирилиця/латиниця) — у межах рядка
  t = t.replace(/([а-яіїєґa-z0-9»)%])([А-ЯІЇЄҐA-Z])/gu, '$1 $2');

  // маркери списку — з нового рядка
  t = t.replace(BULLET_SPLIT_RE, '\n• ');

  // нумеровані пункти «1) 2) 3)» — кожен з нового рядка (зберігаємо номер)
  t = t.replace(/:\s*(?=\d+\)\s)/gu, ':\n');
  t = t.replace(NUMBERED_PAREN_RE, '\n$1 ');

  // нова речення після крапки — окремий абзац
  t = t.replace(/([а-яіїєґa-z»")\]])\.\s+(?=[А-ЯІЇЄҐA-Z])/gu, '$1.\n\n');

  // тире-список після : або ; (окремо від ASCII «-», щоб не ламати слова)
  t = t.replace(/([:;])\s*(?:−|–|—)\s+/gu, '$1\n• ');
  t = t.replace(/(?<=[а-яіїєґa-z»)]|\d)\s+(?:−|–|—)\s+(?=[А-ЯІЇЄҐA-Zа-яіїєґ])/gu, '\n• ');

  // номери розділів на кшталт 4.2 / 4.2.1 посеред тексту
  t = t.replace(/([а-яіїєґa-z».])\s+(\d+\.\d+(?:\.\d+)*)\s+/gu, '$1\n\n$2 ');

  // заголовки ВЕЛИКИМИ (2+ слова або одне довге)
  t = t.replace(
    /\s+((?:[А-ЯІЇЄҐ]{3,}(?:\s+[А-ЯІЇЄҐ]{3,})+|[А-ЯІЇЄҐ]{8,}))(?=\s|$)/gu,
    '\n\n$1\n',
  );

  t = t
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // після всіх розбиттів — злити продовження рядків PDF
  return mergeSoftLineBreaks(t);
}

/** Перетворює нормалізований текст на блоки для рендеру. */
export function citationTextToBlocks(text: string): CitationDisplayBlock[] {
  const normalized = normalizeCitationTypography(stripCitationServicePrefix(text));
  if (!normalized) return [];

  const blocks: CitationDisplayBlock[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length === 0) return;
    blocks.push({ type: 'ul', items: [...listBuf] });
    listBuf = [];
  };

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('• ')) {
      listBuf.push(line.slice(2).trim());
      continue;
    }

    if (/^\d+\)\s+\S/u.test(line)) {
      listBuf.push(line);
      continue;
    }

    flushList();

    if (isHeadingLine(line) || isSectionNumLine(line)) {
      blocks.push({ type: 'h', text: line });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }
  flushList();
  return blocks;
}

/** Збирає тексти цитат у блоки для читання (з нормалізацією). */
export function joinCitationTexts(texts: string[]): string[] {
  const blocks = texts.flatMap((t) => citationTextToBlocks(t));
  const paragraphs: string[] = [];
  for (const b of blocks) {
    if (b.type === 'p' || b.type === 'h') paragraphs.push(b.text);
    else {
      paragraphs.push(
        b.items
          .map((item) => (/^\d+\)\s/.test(item) ? item : `• ${item}`))
          .join('\n'),
      );
    }
  }
  return paragraphs.filter(Boolean);
}

/** Усі блоки цитат підрозділу (для структурованого UI). */
export function joinCitationBlocks(texts: string[]): CitationDisplayBlock[] {
  return texts.flatMap((t) => citationTextToBlocks(t));
}
