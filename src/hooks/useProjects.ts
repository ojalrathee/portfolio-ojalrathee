import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export interface Technology {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  sort_order: number;
}

export interface ArchitectureItem {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface DeploymentStep {
  id: string;
  step_number: number;
  description: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  long_description: string | null;
  tech_stack: string[];
  year: string;
  demo_video_url: string;
  github_url: string;
  live_demo_url: string;
  overview: string;
  system_architecture: string[];
  technical_challenges: string[];
  deployment_details: string[];
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
  technologies: Technology[];
  architecture: ArchitectureItem[];
  challenges: ChallengeItem[];
  deployment: DeploymentStep[];
}

const projectSelect = `
  *,
  technologies:project_technologies(id, name, category, icon, sort_order),
  architecture:project_architecture(id, title, description, sort_order),
  challenges:project_challenges(id, title, description, sort_order),
  deployment:project_deployment(id, step_number, description, sort_order)
`;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(projectSelect)
        .order('sort_order', { ascending: true });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load projects.'));
      } else if (data) {
        setProjects((data as unknown as Project[]).map(normalizeProject));
      }
      setLoading(false);
    })();
  }, []);

  return { projects, loading, error };
}

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(projectSelect)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load project details.'));
      } else if (data) {
        setProject(normalizeProject(data as unknown as Project));
      }
      setLoading(false);
    })();
  }, [id]);

  return { project, loading, error };
}

function normalizeProject(p: Project): Project {
  return {
    ...p,
    tech_stack: p.tech_stack ?? [],
    system_architecture: p.system_architecture ?? [],
    technical_challenges: p.technical_challenges ?? [],
    deployment_details: p.deployment_details ?? [],
    technologies: p.technologies ?? [],
    architecture: p.architecture ?? [],
    challenges: p.challenges ?? [],
    deployment: p.deployment ?? [],
  };
}
