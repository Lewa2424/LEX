-- Only neutral demo/draft records. None are verified legal or medical content.
insert into public.categories (id, slug, title, description, status) values
('10000000-0000-0000-0000-000000000001', 'demo-organization', 'Демо: організація роботи', 'Категорія для локальної перевірки інтерфейсу.', 'draft');

insert into public.legal_sources (
  id, source_kind, title, number, issuer, official_url, official_domain, current_status, publication_status
) values (
  '20000000-0000-0000-0000-000000000001',
  'other',
  'Демонстраційне джерело для перевірки редакційного workflow',
  'ДЕМО-БЕЗ-ЮРИДИЧНОЇ-СИЛИ',
  'Навчальна редакція LEX',
  'https://example.invalid/lex-demo-source',
  'example.invalid',
  'unknown',
  'draft'
);

insert into public.legal_source_versions (
  id, source_id, version_label, source_url, content_hash, parser_version, ingestion_status, review_status, notes
) values (
  '21000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'Демо-версія 1',
  'https://example.invalid/lex-demo-source',
  'demo-not-a-real-content-hash',
  'manual-demo',
  'completed',
  'draft',
  'Не використовувати як нормативне джерело.'
);

insert into public.source_fragments (
  id, source_version_id, fragment_type, ordinal, label, text_original, normalized_text, anchor, text_hash
) values (
  '22000000-0000-0000-0000-000000000001',
  '21000000-0000-0000-0000-000000000001',
  'paragraph',
  1,
  'Демо-фрагмент',
  '[ДЕМО] Текст призначений лише для перевірки зв’язку fragment → citation.',
  '[демо] текст призначений лише для перевірки зв’язку fragment citation',
  'demo-fragment-1',
  'demo-not-a-real-fragment-hash'
);

insert into public.citations (
  id, source_fragment_id, quote_text, editorial_note, status
) values (
  '23000000-0000-0000-0000-000000000001',
  '22000000-0000-0000-0000-000000000001',
  '[ДЕМО] Текст призначений лише для перевірки зв’язку fragment → citation.',
  'Це технічний плейсхолдер, а не перевірена правова цитата.',
  'draft'
);

insert into public.terms (
  id, slug, name, editorial_explanation, synonyms, status
) values (
  '30000000-0000-0000-0000-000000000001',
  'demo-term',
  'Демонстраційний термін',
  'Плейсхолдер для перевірки CRUD. Офіційне визначення відсутнє.',
  array['тестовий термін'],
  'draft'
);
insert into public.term_citations (term_id, citation_id, is_definition_source) values
('30000000-0000-0000-0000-000000000001', '23000000-0000-0000-0000-000000000001', false);

insert into public.situations (
  id, slug, title, summary, category_id, status
) values (
  '40000000-0000-0000-0000-000000000001',
  'demo-situation',
  'Демонстраційна робоча ситуація',
  'Локальний макет шести етапів без нормативних тверджень.',
  '10000000-0000-0000-0000-000000000001',
  'draft'
);
insert into public.situation_phases (situation_id, phase_type, position, title, description) values
('40000000-0000-0000-0000-000000000001','preparation',1,'Підготовка','Демонстраційний опис.'),
('40000000-0000-0000-0000-000000000001','identification',2,'Виявлення','Демонстраційний опис.'),
('40000000-0000-0000-0000-000000000001','prevention',3,'Запобігання','Демонстраційний опис.'),
('40000000-0000-0000-0000-000000000001','response',4,'Реагування','Демонстраційний опис.'),
('40000000-0000-0000-0000-000000000001','investigation',5,'Розслідування','Демонстраційний опис.'),
('40000000-0000-0000-0000-000000000001','recovery',6,'Відновлення','Демонстраційний опис.');

insert into public.first_aid_articles (
  id, slug, title, summary, disclaimer, status
) values (
  '50000000-0000-0000-0000-000000000001',
  'demo-first-aid-layout',
  'Демо-картка домедичної допомоги',
  'Порожній структурний макет без медичного алгоритму.',
  'Не використовувати для надання допомоги. Матеріал не пройшов медичну перевірку.',
  'draft'
);

insert into public.app_settings (key, public_value, description) values
('data_mode_notice', '{"uk":"Локальний демонстраційний режим"}', 'Безпечний публічний текст для mock/local середовища.');
