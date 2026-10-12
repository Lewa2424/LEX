-- LEX initial local schema scaffold. It contains no verified legal or medical corpus.
create extension if not exists pgcrypto;

create type public.publication_status as enum (
  'draft', 'under_review', 'published', 'needs_review', 'archived', 'rejected'
);
create type public.app_role as enum (
  'user', 'editor', 'reviewer', 'medical_reviewer', 'admin'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'user',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select coalesce((select role from public.profiles where id = auth.uid()), 'user'::public.app_role) $$;

create or replace function public.is_editorial()
returns boolean language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('editor', 'reviewer', 'medical_reviewer', 'admin') $$;

create or replace function public.is_reviewer()
returns boolean language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('reviewer', 'admin') $$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.legal_sources (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null default 'UA' check (jurisdiction = 'UA'),
  source_kind text not null check (source_kind in ('law','resolution','order','register','guidance','standard','other')),
  title text not null,
  number text,
  issuer text,
  adoption_date date,
  official_url text,
  official_domain text,
  external_identifier text,
  current_status text not null default 'unknown' check (current_status in ('active','future','repealed','unknown')),
  publication_status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

create table public.legal_source_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.legal_sources(id) on delete restrict,
  version_label text not null,
  effective_from date,
  effective_to date,
  status_at_source text,
  retrieved_at timestamptz,
  source_url text,
  content_hash text,
  raw_file_path text,
  raw_text text,
  parser_version text,
  ingestion_status text,
  review_status public.publication_status not null default 'draft',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  unique (source_id, version_label),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create table public.source_fragments (
  id uuid primary key default gen_random_uuid(),
  source_version_id uuid not null references public.legal_source_versions(id) on delete cascade,
  parent_id uuid references public.source_fragments(id) on delete cascade,
  fragment_type text not null check (fragment_type in ('title','section','article','part','paragraph','appendix','table','note')),
  ordinal integer not null,
  label text,
  text_original text not null,
  normalized_text text not null,
  anchor text,
  text_hash text,
  is_searchable boolean not null default true,
  created_at timestamptz not null default now(),
  unique (source_version_id, anchor)
);

create table public.citations (
  id uuid primary key default gen_random_uuid(),
  source_fragment_id uuid not null references public.source_fragments(id) on delete restrict,
  quote_text text not null,
  quote_start integer,
  quote_end integer,
  editorial_note text,
  applicability_note text,
  status public.publication_status not null default 'draft',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quote_start is null or quote_start >= 0),
  check (quote_end is null or quote_start is null or quote_end >= quote_start)
);

create table public.situations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  category_id uuid references public.categories(id),
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.situation_phases (
  id uuid primary key default gen_random_uuid(),
  situation_id uuid not null references public.situations(id) on delete cascade,
  phase_type text not null check (phase_type in ('preparation','identification','prevention','response','investigation','recovery')),
  position smallint not null check (position between 1 and 6),
  title text not null,
  description text not null default '',
  is_applicable boolean not null default true,
  unique (situation_id, phase_type),
  unique (situation_id, position)
);

create table public.situation_sections (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.situation_phases(id) on delete cascade,
  title text not null,
  content text not null,
  responsible_role text,
  deadline_text text,
  is_required boolean not null default false,
  position integer not null default 1
);

create table public.situation_section_citations (
  section_id uuid not null references public.situation_sections(id) on delete cascade,
  citation_id uuid not null references public.citations(id) on delete restrict,
  position integer not null default 1,
  primary key (section_id, citation_id)
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  official_definition text,
  editorial_explanation text,
  synonyms text[] not null default '{}',
  status public.publication_status not null default 'draft',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.term_citations (
  term_id uuid not null references public.terms(id) on delete cascade,
  citation_id uuid not null references public.citations(id) on delete restrict,
  is_definition_source boolean not null default false,
  primary key (term_id, citation_id)
);

create table public.learning_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  estimated_minutes integer,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.learning_sections (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.learning_topics(id) on delete cascade,
  heading text not null,
  body_text text not null,
  position integer not null default 1
);
create table public.learning_cases (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.learning_topics(id) on delete cascade,
  title text not null,
  scenario_text text not null,
  recommended_action text not null,
  position integer not null default 1
);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category_id uuid references public.categories(id),
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.form_files (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  content_hash text,
  version_label text not null,
  license_status text,
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz not null default now(),
  unique (form_id, version_label)
);
create table public.form_citations (
  form_id uuid not null references public.forms(id) on delete cascade,
  citation_id uuid not null references public.citations(id) on delete restrict,
  primary key (form_id, citation_id)
);

create table public.first_aid_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  disclaimer text not null,
  status public.publication_status not null default 'draft',
  medical_reviewed_at timestamptz,
  medical_reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.first_aid_steps (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.first_aid_articles(id) on delete cascade,
  instruction text not null,
  step_kind text not null default 'action' check (step_kind in ('action','warning','prohibited')),
  position integer not null
);
create table public.first_aid_sources (
  article_id uuid not null references public.first_aid_articles(id) on delete cascade,
  source_version_id uuid not null references public.legal_source_versions(id) on delete restrict,
  notes text,
  primary key (article_id, source_version_id)
);

create table public.material_relations (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id uuid not null,
  target_type text not null,
  target_id uuid not null,
  relation_type text not null default 'related',
  unique (source_type, source_id, target_type, target_id, relation_type)
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  material_type text not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, material_type, target_id)
);

create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  material_type text,
  material_id uuid,
  material_version text,
  page_url text,
  problem_type text not null,
  comment text not null,
  contact_email text,
  status text not null default 'new' check (status in ('new','triaged','resolved','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  correlation_id uuid,
  old_value jsonb,
  new_value jsonb,
  action_source text not null default 'ui',
  result text not null default 'success',
  created_at timestamptz not null default now()
);

create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.legal_sources(id) on delete restrict,
  job_type text not null,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','cancelled')),
  parser_version text,
  started_at timestamptz,
  finished_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.ingestion_errors (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.ingestion_jobs(id) on delete cascade,
  error_code text not null,
  safe_message text not null,
  fragment_reference text,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  public_value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

-- Published records must additionally satisfy reviewer/time invariants in server-side
-- publication functions before production. Direct table writes are only scaffolding.
create index citations_status_idx on public.citations(status);
create index situations_status_idx on public.situations(status);
create index terms_status_idx on public.terms(status);
create index learning_topics_status_idx on public.learning_topics(status);
create index forms_status_idx on public.forms(status);
create index first_aid_articles_status_idx on public.first_aid_articles(status);
create index source_fragments_version_ordinal_idx on public.source_fragments(source_version_id, ordinal);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.legal_sources enable row level security;
alter table public.legal_source_versions enable row level security;
alter table public.source_fragments enable row level security;
alter table public.citations enable row level security;
alter table public.situations enable row level security;
alter table public.situation_phases enable row level security;
alter table public.situation_sections enable row level security;
alter table public.situation_section_citations enable row level security;
alter table public.terms enable row level security;
alter table public.term_citations enable row level security;
alter table public.learning_topics enable row level security;
alter table public.learning_sections enable row level security;
alter table public.learning_cases enable row level security;
alter table public.forms enable row level security;
alter table public.form_files enable row level security;
alter table public.form_citations enable row level security;
alter table public.first_aid_articles enable row level security;
alter table public.first_aid_steps enable row level security;
alter table public.first_aid_sources enable row level security;
alter table public.material_relations enable row level security;
alter table public.favorites enable row level security;
alter table public.content_reports enable row level security;
alter table public.audit_log enable row level security;
alter table public.ingestion_jobs enable row level security;
alter table public.ingestion_errors enable row level security;
alter table public.app_settings enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using (id = auth.uid() or public.is_editorial());
create policy "profiles update own non-role fields" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin all" on public.profiles for all to authenticated
  using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

-- Role mutation still requires a column-level grant/trigger or privileged RPC before
-- production. Client code must never treat localStorage/JWT metadata as authority.
revoke update (role) on public.profiles from authenticated;

create or replace function public.admin_set_role(target_user_id uuid, new_role public.app_role)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_app_role() <> 'admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update public.profiles set role = new_role, updated_at = now() where id = target_user_id;
end;
$$;
revoke all on function public.admin_set_role(uuid, public.app_role) from public, anon;
grant execute on function public.admin_set_role(uuid, public.app_role) to authenticated;

create policy "published categories public" on public.categories for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published sources public" on public.legal_sources for select to anon, authenticated using (publication_status in ('published','needs_review','archived'));
create policy "published citations public" on public.citations for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published situations public" on public.situations for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published terms public" on public.terms for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published learning public" on public.learning_topics for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published forms public" on public.forms for select to anon, authenticated using (status in ('published','needs_review','archived'));
create policy "published first aid public" on public.first_aid_articles for select to anon, authenticated using (status in ('published','needs_review','archived'));

-- Child-table public policies are parent-scoped, so draft children cannot leak.
create policy "published versions public" on public.legal_source_versions for select to anon, authenticated using (
  review_status in ('published','needs_review','archived')
  and exists (select 1 from public.legal_sources s where s.id = source_id and s.publication_status in ('published','needs_review','archived'))
);
create policy "published fragments public" on public.source_fragments for select to anon, authenticated using (
  exists (select 1 from public.legal_source_versions v where v.id = source_version_id and v.review_status in ('published','needs_review','archived'))
);
create policy "published phases public" on public.situation_phases for select to anon, authenticated using (
  exists (select 1 from public.situations s where s.id = situation_id and s.status in ('published','needs_review','archived'))
);
create policy "published sections public" on public.situation_sections for select to anon, authenticated using (
  exists (select 1 from public.situation_phases p join public.situations s on s.id = p.situation_id where p.id = phase_id and s.status in ('published','needs_review','archived'))
);
create policy "published situation citation links" on public.situation_section_citations for select to anon, authenticated using (
  exists (select 1 from public.citations c where c.id = citation_id and c.status in ('published','needs_review','archived'))
);
create policy "published term citation links" on public.term_citations for select to anon, authenticated using (
  exists (select 1 from public.terms t where t.id = term_id and t.status in ('published','needs_review','archived'))
);
create policy "published learning sections" on public.learning_sections for select to anon, authenticated using (
  exists (select 1 from public.learning_topics t where t.id = topic_id and t.status in ('published','needs_review','archived'))
);
create policy "published learning cases" on public.learning_cases for select to anon, authenticated using (
  exists (select 1 from public.learning_topics t where t.id = topic_id and t.status in ('published','needs_review','archived'))
);
create policy "published form files" on public.form_files for select to anon, authenticated using (
  exists (select 1 from public.forms f where f.id = form_id and f.status in ('published','needs_review','archived'))
);
create policy "published form citation links" on public.form_citations for select to anon, authenticated using (
  exists (select 1 from public.forms f where f.id = form_id and f.status in ('published','needs_review','archived'))
);
create policy "published first aid steps" on public.first_aid_steps for select to anon, authenticated using (
  exists (select 1 from public.first_aid_articles a where a.id = article_id and a.status in ('published','needs_review','archived'))
);
create policy "published first aid sources" on public.first_aid_sources for select to anon, authenticated using (
  exists (select 1 from public.first_aid_articles a where a.id = article_id and a.status in ('published','needs_review','archived'))
);
create policy "public app settings" on public.app_settings for select to anon, authenticated using (true);

create policy "favorites own" on public.favorites for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reports create" on public.content_reports for insert to anon, authenticated with check (reporter_id is null or reporter_id = auth.uid());
create policy "reports editorial read" on public.content_reports for select to authenticated using (public.is_editorial());
create policy "audit reviewer read" on public.audit_log for select to authenticated using (public.is_reviewer());

-- Editorial policies intentionally exclude profiles.role. Publishing must later move
-- behind validated RPCs that enforce required reviewer and reviewed_at fields.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'categories','legal_sources','legal_source_versions','source_fragments','citations',
    'situations','situation_phases','situation_sections','situation_section_citations',
    'terms','term_citations','learning_topics','learning_sections','learning_cases',
    'forms','form_files','form_citations','first_aid_articles','first_aid_steps',
    'first_aid_sources','material_relations','content_reports',
    'ingestion_jobs','ingestion_errors','app_settings'
  ]
  loop
    execute format(
      'create policy "editorial manage %1$s" on public.%1$I for all to authenticated using (public.is_editorial()) with check (public.is_editorial())',
      table_name
    );
  end loop;
end $$;
