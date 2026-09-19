import connectDB from './db';
import Project from '../models/Project';
import type { DesignItem } from '../type';

const mapToDesignItem = (doc: any) => ({
  id: doc.projectId,
  name: doc.name,
  sourceImage: doc.sourceImage,
  renderedImage: doc.renderedImage,
  isPublic: doc.isPublic,
  timestamp: doc.timestamp,
  ownerId: doc.userId,
  ownerName: doc.userName,
});

export async function getProjects(userId: string) {
  await connectDB();
  const docs = await Project.find({ userId }).sort({ timestamp: -1 }).lean();
  return docs.map(mapToDesignItem);
}

export async function getPublicProjects() {
  await connectDB();
  const docs = await Project.find({ isPublic: true }).sort({ timestamp: -1 }).lean();
  return docs.map(mapToDesignItem);
}

export async function createProject(data: Partial<DesignItem> & { userId: string, userName: string }) {
  await connectDB();
  
  const updateData = {
    userId: data.userId,
    userName: data.userName,
    name: data.name,
    sourceImage: data.sourceImage,
    renderedImage: data.renderedImage,
    isPublic: data.isPublic || false,
    timestamp: data.timestamp || Date.now(),
  };

  // Upsert allows both creating the initial entry and updating it later with the rendered image
  const doc = await Project.findOneAndUpdate(
    { projectId: data.id },
    { $set: updateData },
    { new: true, upsert: true }
  );
  return doc ? mapToDesignItem(doc) : null;
}

export async function updateProjectVisibility(projectId: string, isPublic: boolean, userId: string) {
  await connectDB();
  const doc = await Project.findOneAndUpdate(
    { projectId, userId },
    { isPublic },
    { new: true }
  );
  return doc ? mapToDesignItem(doc) : null;
}

export async function deleteProject(projectId: string, userId: string) {
  await connectDB();
  return await Project.findOneAndDelete({ projectId, userId });
}
