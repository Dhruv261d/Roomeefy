import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  projectId: string;
  userId: string;
  userName: string;
  name: string;
  sourceImage: string;
  renderedImage?: string;
  isPublic: boolean;
  timestamp: number;
}

const ProjectSchema: Schema = new Schema({
  projectId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  name: { type: String, default: 'Modern Residence' },
  sourceImage: { type: String, required: true },
  renderedImage: { type: String },
  isPublic: { type: Boolean, default: false, index: true },
  timestamp: { type: Number, default: Date.now }
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
