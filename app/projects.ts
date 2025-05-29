interface Project {
  title: string;
  description: string;
  members: string[];
  tags: string[];
  image: string;
  link: string;
  status: "Ativo" | "Novo" | "Aposentado";
}

export const projects: Project[] = [
  {
    title: "Chapisco",
    description:
      "O ápice da tecnologia em mini-sumo competitivo. Robusto e resiliente, Chapisco é sinônimo de estabilidade.",
    members: ["Renan", "Gabrielzinho", "Harder", "Heitor"],
    tags: ["mini-sumo", "autônomo"],
    image: "https://picsum.photos/300/300?1",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Sumonado",
    description:
      "Design futurista e performance veloz. Sumonado é mais do que um robô, é um espetáculo.",
    members: ["Baluta", "Yuji"],
    tags: ["mini-sumo", "autônomo"],
    image: "https://picsum.photos/300/300?2",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Arthas",
    description:
      "Preciso e disciplinado, Arthas segue linhas como se fosse arte. Elegância em cada curva.",
    members: ["Milena", "Bruno", "Pedro"],
    tags: ["seguidor", "autônomo"],
    image: "https://picsum.photos/300/300?3",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Death Rattle",
    description:
      "Sinistro por natureza, este robô de combate desafia limites e aterroriza adversários.",
    members: ["Pedro", "Gustavo", "Willian"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?4",
    link: "#",
    
    status: "Aposentado",
  },
  {
    title: "Thanos",
    description:
      "Com cor roxa imponente, Thanos é referência entre os seguidores de linha.",
    members: ["Luis", "Gustavo", "Pedro"],
    tags: ["seguidor", "autônomo"],
    image: "https://picsum.photos/300/300?5",
    link: "#",
    
    status: "Aposentado",
  },
  {
    title: "Bola de Fogo",
    description:
      "Velocidade e impacto. Um robô de combate que não foge da luta.",
    members: ["Luis", "Gustavo", "Pedro"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?6",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Terror do Século XXI",
    description:
      "Combate insano e barulhento. Um robô que é puro caos com rodas.",
    members: ["Luis", "Gustavo", "Pedro"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?7",
    link: "#",
    
    status: "Novo",
  },
  {
    title: "Sigma",
    description:
      "Nova geração de seguidores de linha. Leve, modular e com IA embarcada.",
    members: ["Marina", "Lucas", "Tales"],
    tags: ["seguidor"],
    image: "https://picsum.photos/300/300?8",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Kronos",
    description:
      "Robô de sumô com sensores de tempo de resposta ultrarrápidos.",
    members: ["Fábio", "Igor", "Eduarda"],
    tags: ["mini-sumo", "autônomo"],
    image: "https://picsum.photos/300/300?9",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Hydra",
    description:
      "Protótipo de robô de resgate inspirado em competições da Robocup.",
    members: ["Nina", "Tiago", "Carol"],
    tags: ["seguidor", "autônomo"],
    image: "https://picsum.photos/300/300?10",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Cyclops",
    description:
      "Visão computacional de ponta em um mini-sumo. Reconhece padrões de oponentes.",
    members: ["Otávio", "Aline"],
    tags: ["mini-sumo", "autônomo"],
    image: "https://picsum.photos/300/300?11",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Blackout",
    description:
      "Combate total com sistema de interrupção eletromagnética para adversários.",
    members: ["Caio", "Isabela"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?12",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Echo",
    description:
      "Robô explorador com comunicação ultrassônica entre módulos.",
    members: ["Helena", "Matheus", "João"],
    tags: ["combate", "45kg"],
    image: "https://picsum.photos/300/300?13",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Vortex",
    description:
      "Design circular que gira para desestabilizar adversários no combate.",
    members: ["Bruna", "Renan", "Guilherme"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?14",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Specter",
    description:
      "Autônomo, leve e quase invisível aos sensores. Um fantasma da arena.",
    members: ["Davi", "Luan"],
    tags: ["mini-sumo", "autônomo"],
    image: "https://picsum.photos/300/300?15",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Titan",
    description:
      "Um colosso de 2kg. Projetado para lutas de resistência extrema.",
    members: ["Gabriela", "Enzo"],
    tags: ["combate", "2kg"],
    image: "https://picsum.photos/300/300?16",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Aegis",
    description:
      "Robô defensor com escudos rotativos e sensores de impacto.",
    members: ["Vitor", "Sofia", "André"],
    tags: ["combate", "45kg"],
    image: "https://picsum.photos/300/300?17",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Nimbus",
    description:
      "Projeto experimental de levitação magnética para robôs de corrida.",
    members: ["Felipe", "Joana"],
    tags: ["seguidor"],
    image: "https://picsum.photos/300/300?18",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Phoenix",
    description:
      "Renascido após falhas críticas, agora mais forte e resiliente.",
    members: ["Tatiane", "Edu", "Vivi"],
    tags: ["combate", "500g"],
    image: "https://picsum.photos/300/300?19",
    link: "#",
    
    status: "Ativo",
  },
  {
    title: "Nullbyte",
    description:
      "Combina lógica fuzzy e sensores digitais para navegação em labirintos.",
    members: ["Alex", "Rafa"],
    tags: ["micro-mouse"],
    image: "https://picsum.photos/300/300?20",
    link: "#",
    
    status: "Novo",
  }
];
