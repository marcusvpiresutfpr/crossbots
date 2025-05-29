import Image from "next/image";
import React, { useMemo, useState } from "react";
import { projects } from "../app/projects";

// Get all unique tags from projects
const allTags = Array.from(new Set(projects.flatMap((project) => project.tags)));

const ProjectsSection = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;

    return projects.filter((project) => project.tags.includes(selectedTag));
  }, [selectedTag]);

  const projectsPerPage = 6;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );

  // Reset to first page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedTag]);

  return (
    <section className="bg-base-300 min-h-screen p-10">
      <div className="flex justify-center w-full">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold text-center py-6">PROJETOS</h2>
          <p className="py-6 text-2xl text-center">
            Aqui estão alguns dos nossos projetos mais recentes. Estamos sempre trabalhando em novos desafios
            e inovações, então fique ligado para mais atualizações!
          </p>
        </div>
      </div>
      <div className="flex justify-center w-full p-8">
        <div className="filter">
          <input
            onClick={() => setSelectedTag(null)}
            className="btn filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="All"
          />
          {allTags.map((tag) => (
            <input
              key={tag}
              className="btn"
              type="radio"
              name="metaframeworks"
              aria-label={tag}
              onClick={() => setSelectedTag(tag)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto cursor-pointer">
        {paginatedProjects.map((project) => (
          <div
            key={project.title}
            className="card bg-base-100 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <figure>
              <Image width={500} height={500} src={project.image} alt={project.title} />
            </figure>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {project.title}
                  </a>
                </h2>
              </div>
              <p>{project.description}</p>

              <div className="card-actions mt-2">
                <div
                  className={`badge ${
                    project.status === "Ativo"
                      ? "badge-success"
                      : project.status === "Novo"
                      ? "badge-primary"
                      : "badge-neutral"
                  }`}
                >
                  {project.status}
                </div>
                {project.tags.map((tag) => (
                  <div key={tag} className="badge badge-outline">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={`join-item btn${page === idx + 1 ? " btn-active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
