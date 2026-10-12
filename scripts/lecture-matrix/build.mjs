import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { REFERENCE_SECTIONS } from '../../src/domain/referenceSections.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const cacheRoot = path.join(root, 'development data/lecture-work/maps/_extract_cache');
const output = path.join(root, 'development data/lecture-work/matrix');
const review = JSON.parse(fs.readFileSync(path.join(output, 'reviewed.json'), 'utf8'));

/** RU: Перечисляет файлы извлечений. EN: Lists extraction files recursively. */
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
/** RU: Нормализует текст для поиска. EN: Normalizes text for matching. */
function normalize(text) {
  return text.toLocaleLowerCase('uk-UA').replace(/[’ʼ`']/g, '').replace(/\s+/g, ' ').trim();
}
/** RU: Возвращает путь относительно проекта. EN: Returns a project-relative path. */
function relative(file) { return path.relative(root, file).replaceAll('\\', '/'); }
/** RU: Создаёт устойчивый отпечаток. EN: Creates a stable digest. */
function hash(text) { return crypto.createHash('sha256').update(text).digest('hex'); }
/** RU: Экранирует ячейку Markdown. EN: Escapes a Markdown table cell. */
function cell(text) { return text.replaceAll('|', '\\|').replace(/\s+/g, ' '); }
/** RU: Создаёт относительную ссылку на файл. EN: Creates a relative file link. */
function link(from, target, label) {
  return `[${label}](${path.relative(from, target).replaceAll('\\', '/').split('/').map(encodeURIComponent).join('/')})`;
}

const sources = [];
const byHash = new Map();
const errors = [];
let cacheFiles = 0;
for (const file of files(cacheRoot).filter(file => file.endsWith('.json')).sort()) {
  cacheFiles++;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const pages = (data.pages ?? []).map(page => ({ page: page.page, text: page.text ?? '' }));
  const fingerprint = hash(JSON.stringify(pages.map(page => [page.page, normalize(page.text)])));
  const original = path.join(root, 'development data/Lessons', data.source);
  const alias = { sourcePath: relative(original), cachePath: relative(file), originalExists: fs.existsSync(original) };
  if (data.meta?.error || !pages.some(page => page.text.trim())) {
    errors.push({ ...alias, error: data.meta?.error ?? 'empty_extraction' });
    continue;
  }
  if (byHash.has(fingerprint)) { byHash.get(fingerprint).aliases.push(alias); continue; }
  const source = {
    id: `source-${fingerprint.slice(0, 16)}`, fingerprint,
    ...alias, format: data.meta?.format, extractor: data.meta?.extractor,
    cachedAt: data.cachedAt, aliases: [], pages,
  };
  sources.push(source);
  byHash.set(fingerprint, source);
}

const stop = new Set(['та', 'і', 'з', 'за', 'до', 'на', 'у', 'в', 'від', 'при', 'для', 'із', 'після', 'під', 'без']);
const pageIndex = sources.flatMap(source => source.pages.filter(page => page.text.trim()).map(page => ({
  sourceId: source.id, page: page.page, text: page.text, normalized: normalize(page.text),
})));

/** RU: Ищет кандидатов, не подтверждая наличие ответа. EN: Finds candidates without asserting answer coverage. */
function candidates(title) {
  const phrase = normalize(title);
  const tokens = phrase.split(/[^\p{L}\p{N}]+/u).filter(token => token.length > 2 && !stop.has(token));
  const stems = [...new Set(tokens.map(token => token.length > 5 ? token.slice(0, -2) : token))];
  if (!stems.length) return [];
  return pageIndex.flatMap(page => {
    const exact = page.normalized.includes(phrase);
    const matched = stems.filter(stem => page.normalized.includes(stem));
    if (!exact && matched.length !== stems.length) return [];
    const position = exact ? page.normalized.indexOf(phrase) : page.normalized.indexOf(matched[0]);
    return [{ sourceId: page.sourceId, page: page.page, method: exact ? 'phrase' : 'all_title_stems',
      score: (exact ? 100 : 20) + matched.length,
      excerpt: page.normalized.slice(Math.max(0, position - 120), position + 650),
      status: 'candidate_unreviewed' }];
  }).sort((a, b) => b.score - a.score || a.sourceId.localeCompare(b.sourceId) || a.page - b.page).slice(0, 12);
}

/** RU: Проверяет привязки редактора и сохраняет полный текст страницы. EN: Validates reviewed anchors and preserves page text. */
function anchor(ref) {
  const source = sources.find(source => source.cachePath === ref.cachePath || source.aliases.some(alias => alias.cachePath === ref.cachePath));
  if (!source) throw new Error(`Unknown reviewed source: ${ref.cachePath}`);
  const page = source.pages.find(page => page.page === ref.page);
  if (!page || !page.text.includes(ref.quote)) throw new Error(`Invalid quote on page ${ref.page}`);
  return { ...ref, sourceId: source.id, pageText: page.text };
}

const topics = REFERENCE_SECTIONS.flatMap(section => section.topics.map(topic => {
  const reviewed = review.topics.find(item => item.topicId === topic.id);
  return {
    sectionId: section.id, sectionTitle: section.title, topicId: topic.id, title: topic.title,
    reviewStatus: reviewed ? 'partial_review' : 'not_reviewed',
    coverage: reviewed ? 'partial' : 'unknown',
    reviewedUnits: (reviewed?.units ?? []).map(unit => ({ ...unit, anchors: unit.anchors.map(anchor) })),
    gaps: reviewed?.gaps ?? [], notes: reviewed?.notes ?? [], candidates: candidates(topic.title),
  };
}));
for (const item of review.topics) if (!topics.some(topic => topic.topicId === item.topicId)) throw new Error(`Unknown topic ${item.topicId}`);
const stats = { sections: REFERENCE_SECTIONS.length, topics: topics.length, cacheFiles,
  uniqueExtracts: sources.length, duplicateExtracts: sources.reduce((n, source) => n + source.aliases.length, 0),
  extractionErrors: errors.length, pages: pageIndex.length,
  topicsWithCandidates: topics.filter(topic => topic.candidates.length).length,
  partiallyReviewedTopics: topics.filter(topic => topic.reviewStatus === 'partial_review').length,
  reviewedUnits: topics.reduce((n, topic) => n + topic.reviewedUnits.length, 0) };
fs.mkdirSync(path.join(output, 'sections'), { recursive: true });
fs.writeFileSync(path.join(output, 'matrix.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), stats, topics }, null, 2) + '\n');
fs.writeFileSync(path.join(output, 'sources.json'), JSON.stringify({ sources: sources.map(({ pages, ...source }) => ({ ...source, pageCount: pages.length })), errors }, null, 2) + '\n');

for (const section of REFERENCE_SECTIONS) {
  const directory = path.join(output, 'sections');
  const lines = [`# ${section.title}`, '', 'Кандидаты получены поиском по извлечениям и требуют чтения. Проверенная привязка подтверждает содержание лекции, а не актуальность нормативного требования.', ''];
  for (const topic of topics.filter(topic => topic.sectionId === section.id)) {
    lines.push(`## ${topic.title}`, '', `ID: \`${topic.topicId}\` · Проверка: ${topic.reviewStatus} · Покрытие: ${topic.coverage}`, '');
    for (const unit of topic.reviewedUnits) {
      lines.push(`### ${unit.title}`, '', unit.summary, '');
      for (const ref of unit.anchors) {
        const source = sources.find(source => source.id === ref.sourceId);
        lines.push(`- ${link(directory, path.join(root, source.sourcePath), path.basename(source.sourcePath))}, страница/слайд ${ref.page}; ${link(directory, path.join(root, ref.cachePath), 'извлечение')}.`, `  > ${cell(ref.quote)}`);
      }
      lines.push('');
    }
    if (topic.gaps.length) lines.push('Ещё найти: ' + topic.gaps.join('; ') + '.', '');
    if (topic.notes.length) lines.push('Замечания: ' + topic.notes.join('; '), '');
    lines.push('| Кандидат: источник | Страница / слайд | Фрагмент для проверки |', '|---|---:|---|');
    for (const candidate of topic.candidates) {
      const source = sources.find(source => source.id === candidate.sourceId);
      lines.push(`| ${link(directory, path.join(root, source.sourcePath), cell(path.basename(source.sourcePath)))} | ${candidate.page} | ${cell(candidate.excerpt)} |`);
    }
    if (!topic.candidates.length) lines.push('| Поиск по названию не дал кандидатов; нужен поиск синонимов и чтение | — | Это не означает отсутствия материала |');
    lines.push('');
  }
  fs.writeFileSync(path.join(directory, `${section.id}.md`), lines.join('\n'));
}
const index = ['# Матрица подразделов и лекций LEX', '',
  'Рабочая карта для подготовки ответов. Полные тексты проверенных страниц находятся в matrix.json; оригиналы и дубликаты перечислены в sources.json. Редакторские привязки хранятся отдельно в reviewed.json и сохраняются при пересборке.', '',
  '## Состояние первого прохода', '',
  `- Разделов: ${stats.sections}; подразделов: ${stats.topics}.`,
  `- Файлов извлечений: ${stats.cacheFiles}; уникальных непустых извлечений: ${stats.uniqueExtracts}; повторных копий: ${stats.duplicateExtracts}.`,
  `- Страниц/слайдов с текстом: ${stats.pages}; файлов с ошибками или без текста: ${stats.extractionErrors}.`,
  `- Подразделов с поисковыми кандидатами: ${stats.topicsWithCandidates}. Их содержательная пригодность ещё не подтверждена.`,
  `- Частично проверено подразделов: ${stats.partiallyReviewedTopics}; проверенных смысловых единиц: ${stats.reviewedUnits}.`, '',
  '## Разделы', '', '| Раздел | Подразделов | С кандидатами | Частично проверено |', '|---|---:|---:|---:|'];
for (const section of REFERENCE_SECTIONS) {
  const subset = topics.filter(topic => topic.sectionId === section.id);
  index.push(`| [${section.title}](sections/${section.id}.md) | ${subset.length} | ${subset.filter(topic => topic.candidates.length).length} | ${subset.filter(topic => topic.reviewStatus === 'partial_review').length} |`);
}
index.push('', '## Подразделы без поисковых кандидатов', '',
  ...topics.filter(topic => !topic.candidates.length).map(topic => `- ${topic.sectionTitle} → ${topic.title}`), '',
  '## Извлечения, требующие отдельной проверки', '',
  ...errors.map(error => `- ${link(output, path.join(root, error.sourcePath), path.basename(error.sourcePath))}: ${error.error}`), '',
  '## Порядок продолжения', '',
  '1. Читать извлечение целиком по теме, проверяя соседние страницы и область применения.',
  '2. В reviewed.json добавлять смысловые единицы с точными цитатами и страницами; ситуации выделять только при наличии самостоятельного содержания.',
  '3. Фиксировать недостающие аспекты и противоречия. Полноту подраздела не выводить из количества совпадений.',
  '4. Для слайдов без содержательного текста смотреть оригинал: изображения и схемы могли не попасть в извлечение.',
  '5. Пересобрать: node --import tsx scripts/lecture-matrix/build.mjs', '',
  '## Ограничения', '',
  'Поиск кандидатов: точная фраза или все укороченные слова названия на одной странице; максимум 12 находок на подраздел. Это начальный указатель, не исчерпывающий смысловой поиск. Дубликаты объединены только при совпадении нормализованного текста всех страниц. Отсутствие кандидатов не означает отсутствие ответа. Кэш может отличаться от текущего оригинала; наличие файла проверено, содержимое оригиналов пока не сверялось.', '');
fs.writeFileSync(path.join(output, 'INDEX.md'), index.join('\n'));
console.log(JSON.stringify(stats, null, 2));
