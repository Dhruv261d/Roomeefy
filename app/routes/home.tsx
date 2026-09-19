import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Button from "components/ui/Button";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "lib/puter.action";
import type { DesignItem } from "type";

import { useUser } from "@clerk/react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomeefy - AI-Powered Architectural Visualization" },
    { name: "description", content: "Build beautiful spaces at the speed of thought. Roomeefy uses AI to visualize and render architectural projects in seconds." },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  const handleUploadComplete = async(base64Image: string) => {
    try {
      if(isCreatingProjectRef.current || !user) return false;
      isCreatingProjectRef.current = true;
      
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;
  
      const newItem = {
        id: newId, 
        name, 
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
        ownerId: user.id,
        ownerName: user.fullName || user.username || 'User'
      }
  
      const saved = await createProject({ item: newItem, visibility: 'private'});
  
      if(!saved) {
        console.warn("Failed to create project");
        return false;
      }
  
      setProjects((prev) => [saved, ...prev]);
  
      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name
        }
      });
  
      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  }

  useEffect(() => {
    const fetchedProject = async () => {
      if (!user) return;
      const items = await getProjects();
      setProjects(items);
    }
    
    fetchedProject();
  }, [user])

  return (
    <div className="home">
      <Navbar />
      
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Roomeefy</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Roomeefy</h1>

        <p className="subtitle">
          Roomeefy is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className='icon' />
          </a>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>

                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG, formats up to 10MB</p>
              </div>

              <Upload onComplete={handleUploadComplete}/>
            </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.length > 0 ? projects.map(({id, name, renderedImage, sourceImage, timestamp, isPublic, ownerName, ownerId}) => (
              <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)}>
                <div className="preview">
                  <img
                    src={renderedImage || sourceImage} 
                    alt={name || "Project"}
                  />

                  <div className={`badge ${isPublic ? 'public' : 'private'}`}>
                    <span>{isPublic ? 'Community' : 'Private'}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div>
                    <h3>{name || "Untitled Residence"}</h3>

                    <div className="meta">
                      <Clock size={12}  />
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By {ownerName || 'You'}</span>
                    </div>
                  </div>

                  <div className="actions flex gap-2">
                    {user?.id === ownerId && (
                       <button 
                         className="delete-btn p-2 hover:text-red-500 transition-colors"
                         title="Delete Project"
                         onClick={async (e) => {
                           e.stopPropagation();
                           if(window.confirm('Are you sure you want to delete this project?')) {
                             const success = await import('lib/puter.action').then(m => m.deleteProject(id));
                             if(success) {
                               setProjects(prev => prev.filter(p => p.id !== id));
                             }
                           }
                         }}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                       </button>
                    )}
                    <div className="arrow p-2">
                      <ArrowUpRight size={18}/>
                    </div>
                  </div>
                </div>
              </div>

            )) : (
                <div className="empty-projects">
                    <p>No projects found. Start by uploading a floor plan!</p>
                </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
