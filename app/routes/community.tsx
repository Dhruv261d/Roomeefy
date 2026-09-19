import type { Route } from "./+types/community";
import Navbar from "../../components/Navbar";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getPublicProjects } from "lib/puter.action";
import { useNavigate } from "react-router";
import type { DesignItem } from "type";
import Button from "components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community - Roomeefy" },
    { name: "description", content: "Explore amazing architectural designs created by the Roomeefy community." },
  ];
}

export default function Community() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityProjects = async () => {
      setIsLoading(true);
      try {
        const items = await getPublicProjects();
        setProjects(items);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunityProjects();
  }, []);

  return (
    <div className="community-page">
      <Navbar />
      
      <main className="container">
        <header className="page-header">
          <div className="icon-wrapper">
            <Users size={32} />
          </div>
          <h1>Community Showcase</h1>
          <p className="subtitle">Discover how others are using Roomeefy to reimagine their spaces.</p>
        </header>

        <section className="community-content">
          {isLoading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card animate-pulse">
                  <div className="skeleton-img bg-zinc-200 aspect-4/3 rounded-3xl mb-4"></div>
                  <div className="skeleton-line bg-zinc-200 h-6 w-3/4 rounded-lg mb-2"></div>
                  <div className="skeleton-line bg-zinc-200 h-4 w-1/2 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="masonry-grid">
              {projects
                .filter(p => p.isPublic) // Strict frontend filtering
                .map(({id, name, renderedImage, sourceImage, timestamp, ownerName}) => (
                <div key={id} className="community-card group" onClick={() => navigate(`/visualizer/${id}`)}>
                  <div className="card-image">
                    <img
                      src={renderedImage || sourceImage} 
                      alt={name || "Project"}
                    />
                    <div className="hover-overlay">
                        <div className="action-pill">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>
                    </div>
                  </div>

                  <div className="card-info">
                    <div className="main-meta">
                      <h3>{name || "Modern Residence"}</h3>
                      <p className="owner">Architected by {ownerName || "Roomeefy User"}</p>
                    </div>
                    
                    <div className="sub-meta">
                        <span className="date">
                            {new Date(timestamp).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No public designs yet</h3>
              <p>Be the first to share your vision with the community!</p>
              <button onClick={() => navigate('/')} className="cta-button">
                Create a Design
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
