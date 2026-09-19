import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";
import type { CreateProjectParams, DesignItem } from "type";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
}

// Helper to attach Clerk token to all API requests
const authFetch = async (url: string, options: RequestInit = {}) => {
    let token = null;
    if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
        token = await (window as any).Clerk.session.getToken();
    }
    
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    return fetch(url, { ...options, headers });
}

export const createProject = async ({ item, visibility= 'private' }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    const projectId = item.id;
    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ?
        await uploadImageToHosting({
            hosting, url: item.sourceImage, projectId, label: 'source',
        }) : null;

    const hostedRender = projectId && item.renderedImage ?
        await uploadImageToHosting({
            hosting, url: item.renderedImage, projectId, label: 'rendered',
        }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : '');
    if(!resolvedSource) return null;

    const resolvedRender = hostedRender?.url ? hostedRender?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
        ? item.renderedImage 
        : undefined;

    const payload = {
        ...item,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
        isPublic: visibility === 'public'
    }

    try {
        const response = await authFetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify({ action: 'create', item: payload, userName: item.ownerName })
        });
        const data = await response.json();
        return data.project;
    } catch (e) {
        console.error('Failed to save to MongoDB', e);
        return null;
    }
} 

export const updateProjectVisibility = async ({ item, isPublic }: { item: DesignItem, isPublic: boolean }) => {
    try {
        const response = await authFetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify({ action: 'updateVisibility', projectId: item.id, isPublic })
        });
        const data = await response.json();
        return data.project;
    } catch (e) {
        return null;
    }
}

export const getProjects = async () => {
    try {
        const response = await authFetch('/api/projects');
        const data = await response.json();
        return data.projects || [];
    } catch (e) {
        return [];
    }
}

export const getProjectById = async ({ id }: { id: string }) => {
    // For simplicity, we fetch all and find, or we could add a specific API call
    const projects = await getProjects();
    return projects.find((p: any) => p.projectId === id || p.id === id) || null;
};

export const getPublicProjects = async () => {
    try {
        const response = await authFetch('/api/projects?type=community');
        const data = await response.json();
        return data.projects || [];
    } catch (e) {
        return [];
    }
}

export const deleteProject = async (id: string) => {
    try {
        const response = await authFetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', projectId: id })
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}
