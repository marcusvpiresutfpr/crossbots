import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { competitions } from "../app/competitions";
import Image from "next/image";

const lastEvents = [...competitions]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

const Competiotions = () => (
  <VerticalTimeline>
    {lastEvents.map((event) => (
      <VerticalTimelineElement
        key={event.title}
        date={new Date(event.date).toLocaleDateString("pt-BR")}
        icon={
          <div className="rounded-full">
            <Image src={event.image} alt={event.title} width={40} height={40} className="rounded-full" />
          </div>
        }
        iconStyle={{ background: "--color-primary-content", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <h3 className="text-lg font-bold">{event.title}</h3>
        <p className="text-sm">{event.description}</p>
        <div className="flex items-center mt-2">
          {event.tags.map((tag) => (
            <span key={tag} className="badge badge-outline mr-2">
              {tag}
            </span>
          ))}
        </div>
      </VerticalTimelineElement>
    ))}
  </VerticalTimeline>
);

export default Competiotions;
