-- Drop only these tables if they exist (safe order)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.production_assets CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.episodes CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.daily_broadcasts CASCADE;
DROP TABLE IF EXISTS public.episode_ideas CASCADE;

-- Create tables
CREATE TABLE public.daily_broadcasts (
  id serial PRIMARY KEY,
  title text NOT NULL,
  audio_url text NOT NULL,
  type text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.episode_ideas (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  suggested_by text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.episodes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  theme text NOT NULL,
  sfx_requirements text,
  ambience_goals text,
  emotional_arc text,
  audio_url text,
  duration integer,
  status text DEFAULT 'planning' NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.production_assets (
  id serial PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  episode_id integer,
  version text NOT NULL,
  url text,
  status text DEFAULT 'draft',
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.team_members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  category text NOT NULL,
  is_ai boolean DEFAULT true NOT NULL
);

CREATE TABLE public.tasks (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  assigned_to_id integer,
  episode_id integer,
  status text DEFAULT 'pending' NOT NULL,
  priority text DEFAULT 'medium' NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.conversations (
  id serial PRIMARY KEY,
  title text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.messages (
  id serial PRIMARY KEY,
  conversation_id integer NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add foreign keys
ALTER TABLE public.production_assets
  ADD CONSTRAINT production_assets_episode_id_fkey FOREIGN KEY (episode_id)
    REFERENCES public.episodes (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_assigned_to_id_fkey FOREIGN KEY (assigned_to_id)
    REFERENCES public.team_members (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_episode_id_fkey FOREIGN KEY (episode_id)
    REFERENCES public.episodes (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id)
    REFERENCES public.conversations (id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- Row Level Security (RLS) Configuration
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Default Policies (Public Read)
CREATE POLICY "Public Read Access" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.production_assets FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.daily_broadcasts FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.episode_ideas FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.messages FOR SELECT USING (true);

-- Authenticated Insert
CREATE POLICY "Authenticated Insert" ON public.episode_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated Insert" ON public.messages FOR INSERT WITH CHECK (true);
