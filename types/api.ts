export type Citation = {
  title:   string;
  url:     string;
  snippet: string;
};

export type AgentResult = {
  text:      string;
  citations: Citation[];
};

export type Section = {
  text:      string;
  citations: unknown[];
};

export type EvalResult = {
  industryNews:    Section;
  competitorLinks: Section;
  synthesis:       Section;
  tamData:         Section;
  riskScore:       Section;
};
