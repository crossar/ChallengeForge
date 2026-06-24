"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Clipboard,
  Crown,
  Edit3,
  Film,
  Image,
  Library,
  Medal,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Trophy,
  Wand2
} from "lucide-react";

const defaultChallenge = {
  name: "Automotive Locomotion",
  theme: "Automotive",
  description: "A community contest focused on imaginative vehicle motion, mechanical style, and high-speed visual storytelling.",
  startDate: "2026-07-01",
  endDate: "2026-07-15"
};

const defaultWinners = {
  first: "TurboMuse",
  second: "PixelPiston",
  third: "ChromeCaster"
};

const preset = {
  name: "Neon Purple Challenge Results",
  traits: [
    "Dark purple futuristic background",
    "Large glossy 3D title text",
    "Neon glow effects",
    "Tiny robot mascots",
    "Floating challenge-related icons",
    "Premium gaming competition look",
    "Consistent visual branding",
    "Square 1:1 social media format"
  ]
};

const promptTypes = [
  { key: "poster", label: "Main Challenge Poster", icon: Image },
  { key: "winners", label: "Winners Board", icon: Trophy },
  { key: "first", label: "First Place Graphic", icon: Crown },
  { key: "second", label: "Second Place Graphic", icon: Medal },
  { key: "third", label: "Third Place Graphic", icon: Award },
  { key: "instagram", label: "Instagram Post", icon: Sparkles },
  { key: "video", label: "Video Prompt", icon: Film }
];

const themeObjectMap = {
  automotive: "cars, engines, wheels, speed effects, motion trails, chrome parts, neon-lit dashboards",
  car: "cars, engines, wheels, speed effects, motion trails, chrome parts, neon-lit dashboards",
  vehicle: "cars, engines, wheels, speed effects, motion trails, chrome parts, neon-lit dashboards",
  cake: "cakes, frosting, bakery elements, piping bags, sprinkles, glossy icing, display stands",
  bakery: "cakes, frosting, bakery elements, piping bags, sprinkles, glossy icing, display stands",
  food: "plated creations, ingredients, garnish, steam, cutting boards, styled kitchen tools",
  fashion: "fabric swatches, runway lights, accessories, stitching details, glossy display tags",
  game: "controllers, tokens, score icons, pixel effects, power-ups, glowing UI badges",
  gaming: "controllers, tokens, score icons, pixel effects, power-ups, glowing UI badges",
  space: "planets, stars, spacecraft silhouettes, orbital rings, nebula particles",
  garden: "leaves, flowers, soil textures, plant markers, greenhouse glass, water droplets",
  music: "notes, speakers, waveforms, microphones, vinyl records, stage lights",
  art: "brushes, paint splashes, palettes, canvas textures, gallery lighting"
};

const initialTemplates = [
  {
    id: "template-poster",
    name: "Poster Template",
    type: "Main Challenge Poster",
    body: "Create a square 1:1 main contest poster for {{challengeName}} using the visual branding from {{presetName}}. Do not write the preset name as visible text. Feature {{themeObjects}} around a glossy 3D title, include the theme {{challengeTheme}}, dates {{startDate}} to {{endDate}}, and a polished community competition mood."
  },
  {
    id: "template-winners",
    name: "Winners Template",
    type: "Winners Board",
    body: "Create a square 1:1 winners board for {{challengeName}} using the visual branding from {{presetName}}. Do not write the preset name as visible text. The main headline text should say CHALLENGE RESULTS, with {{challengeName}} as the challenge title. Show first place {{firstPlace}}, second place {{secondPlace}}, and third place {{thirdPlace}} on a three-level podium. Put the large rank numbers 1, 2, and 3 on the front faces of the podium/platform blocks only, not over the winners' faces or bodies. Use premium podium lighting, tiny robot mascots, neon accents, and {{themeObjects}}."
  },
  {
    id: "template-video",
    name: "Motion Video Template",
    type: "Video Prompt",
    body: "Create a short cinematic social video concept for {{challengeName}} using the {{presetName}} brand. Do not write the preset name as visible text. Animate neon purple light sweeps, floating {{themeObjects}}, tiny robots assembling a winner board, glossy 3D CHALLENGE RESULTS text reveals, and a final square-framed title lockup."
  }
];

const defaultTemplateIds = new Set(initialTemplates.map((template) => template.id));

function mergeSavedTemplates(savedTemplates) {
  const customTemplates = savedTemplates.filter((template) => !defaultTemplateIds.has(template.id));
  return [...initialTemplates, ...customTemplates];
}

function getThemeObjects(theme, name, description) {
  const source = `${theme} ${name} ${description}`.toLowerCase();
  const match = Object.keys(themeObjectMap).find((keyword) => source.includes(keyword));
  if (match) return themeObjectMap[match];

  const words = theme
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");

  return words
    ? `${words}, symbolic icons, themed props, stylized particles, floating visual motifs`
    : "symbolic icons, themed props, stylized particles, floating visual motifs";
}

function buildPrompt(type, challenge, winners) {
  const themeObjects = getThemeObjects(challenge.theme, challenge.name, challenge.description);
  const baseStyle =
    "Maintain the Neon Purple Challenge Results visual system as the art direction only: dark purple futuristic background, large glossy 3D title text, neon glow effects, tiny robot mascots, floating challenge-related icons, premium gaming competition look, consistent visual branding, square 1:1 social media format. Do not write the preset name or the words Neon Purple as visible text in the image.";

  const context = `Challenge: ${challenge.name}. Theme: ${challenge.theme}. Description: ${challenge.description}. Dates: ${challenge.startDate} to ${challenge.endDate}. Theme objects: ${themeObjects}.`;

  const variants = {
    poster: `Create the main challenge poster. Place "${challenge.name}" as the dominant glossy 3D headline, add readable start and end dates, and surround the title with ${themeObjects}.`,
    winners: `Create a winners board with a premium three-level podium composition. The main headline must read "CHALLENGE RESULTS" only, with "${challenge.name}" shown as the smaller challenge title. First place: ${winners.first}. Second place: ${winners.second}. Third place: ${winners.third}. Put the large rank numbers 1, 2, and 3 on the front faces of the podium/platform blocks only. Keep rank badges away from faces, heads, torsos, and usernames. Use neon rails, celebratory particles, tiny robot mascots, and ${themeObjects}.`,
    first: `Create a first place winner graphic for ${winners.first}. Make the username heroic and centered with a gold neon crown, intense glow, and ${themeObjects} orbiting the frame. If a rank number appears, place it on a trophy base or platform plaque only, not over the winner's face or body.`,
    second: `Create a second place winner graphic for ${winners.second}. Use a silver neon medal treatment, polished 3D typography, and balanced ${themeObjects} around the winner name. If a rank number appears, place it on a platform plaque only, not over the winner's face or body.`,
    third: `Create a third place winner graphic for ${winners.third}. Use a bronze neon award treatment, compact trophy lighting, and energetic ${themeObjects} in the background. If a rank number appears, place it on a platform plaque only, not over the winner's face or body.`,
    instagram: `Create an Instagram-ready announcement post with the challenge title, short description, dates, and a callout for community participation. Keep the layout bold, legible, and square. Do not use "Neon Purple" as visible headline text.`,
    video: `Create a video generation prompt for a 10-second motion graphic: camera pushes through purple neon fog, tiny robot mascots assemble glossy 3D "CHALLENGE RESULTS" title letters, ${themeObjects} float past with motion trails, winners flash in a premium gaming results reveal, ending on the ChallengeForge branded square layout.`
  };

  return `${baseStyle}\n\n${context}\n\n${variants[type]}`;
}

function fillTemplate(template, challenge, winners) {
  const replacements = {
    "{{challengeName}}": challenge.name,
    "{{challengeTheme}}": challenge.theme,
    "{{challengeDescription}}": challenge.description,
    "{{startDate}}": challenge.startDate,
    "{{endDate}}": challenge.endDate,
    "{{firstPlace}}": winners.first,
    "{{secondPlace}}": winners.second,
    "{{thirdPlace}}": winners.third,
    "{{presetName}}": preset.name,
    "{{themeObjects}}": getThemeObjects(challenge.theme, challenge.name, challenge.description)
  };

  return Object.entries(replacements).reduce(
    (text, [token, value]) => text.replaceAll(token, value || ""),
    template.body
  );
}

function Field({ label, value, onChange, type = "text", textarea = false }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {textarea ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function Section({ title, icon: Icon, children, aside }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <Icon size={18} />
          <h2>{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [challenge, setChallenge] = useState(defaultChallenge);
  const [winners, setWinners] = useState(defaultWinners);
  const [activeType, setActiveType] = useState("poster");
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingId, setEditingId] = useState(null);
  const [draftTemplate, setDraftTemplate] = useState({ name: "", type: "Custom", body: "" });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("challengeforge.templates");
    if (saved) {
      try {
        setTemplates(mergeSavedTemplates(JSON.parse(saved)));
      } catch {
        setTemplates(initialTemplates);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("challengeforge.templates", JSON.stringify(templates));
  }, [templates]);

  const generatedPrompt = useMemo(
    () => buildPrompt(activeType, challenge, winners),
    [activeType, challenge, winners]
  );

  const themeObjects = useMemo(
    () => getThemeObjects(challenge.theme, challenge.name, challenge.description),
    [challenge]
  );

  function updateChallenge(key, value) {
    setChallenge((current) => ({ ...current, [key]: value }));
  }

  function updateWinner(key, value) {
    setWinners((current) => ({ ...current, [key]: value }));
  }

  async function copyText(text, label) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function saveTemplate() {
    if (!draftTemplate.name.trim() || !draftTemplate.body.trim()) return;

    if (editingId) {
      setTemplates((current) =>
        current.map((template) =>
          template.id === editingId ? { ...template, ...draftTemplate } : template
        )
      );
    } else {
      setTemplates((current) => [
        ...current,
        { ...draftTemplate, id: `template-${Date.now()}` }
      ]);
    }

    setEditingId(null);
    setDraftTemplate({ name: "", type: "Custom", body: "" });
  }

  function editTemplate(template) {
    setEditingId(template.id);
    setDraftTemplate({ name: template.name, type: template.type, body: template.body });
  }

  function deleteTemplate(id) {
    setTemplates((current) => current.filter((template) => template.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraftTemplate({ name: "", type: "Custom", body: "" });
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Wand2 size={24} />
          </div>
          <div>
            <p>ChallengeForge</p>
            <span>Prompt studio</span>
          </div>
        </div>

        <nav className="nav-stack" aria-label="Dashboard sections">
          <a href="#challenge">Challenge</a>
          <a href="#winners">Winners</a>
          <a href="#presets">Style Presets</a>
          <a href="#generator">Generator</a>
          <a href="#library">Prompt Library</a>
        </nav>

        <div className="future-box">
          <span>Ready for later</span>
          <p>OpenAI image generation, saved challenge history, automatic winner graphics, and social export workflows.</p>
        </div>
      </aside>

      <div className="workspace">
        <header className="hero">
          <div>
            <p className="eyebrow">Recurring community contests</p>
            <h1>Build consistent challenge prompts and result graphics.</h1>
          </div>
          <div className="hero-preview" aria-label="Neon purple challenge results preview">
            <div className="preview-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="robot robot-left">CF</div>
            <div className="robot robot-right">01</div>
            <p>{challenge.name}</p>
            <strong>RESULTS</strong>
            <small>{themeObjects}</small>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="primary-column">
            <div id="challenge">
              <Section title="Challenge Information" icon={Calendar}>
                <div className="form-grid">
                  <Field label="Challenge Name" value={challenge.name} onChange={(value) => updateChallenge("name", value)} />
                  <Field label="Challenge Theme" value={challenge.theme} onChange={(value) => updateChallenge("theme", value)} />
                  <Field label="Start Date" value={challenge.startDate} onChange={(value) => updateChallenge("startDate", value)} type="date" />
                  <Field label="End Date" value={challenge.endDate} onChange={(value) => updateChallenge("endDate", value)} type="date" />
                  <div className="wide">
                    <Field label="Challenge Description" value={challenge.description} onChange={(value) => updateChallenge("description", value)} textarea />
                  </div>
                </div>
              </Section>
            </div>

            <div id="winners">
              <Section title="Winners" icon={Trophy}>
                <div className="winner-grid">
                  <Field label="First Place Username" value={winners.first} onChange={(value) => updateWinner("first", value)} />
                  <Field label="Second Place Username" value={winners.second} onChange={(value) => updateWinner("second", value)} />
                  <Field label="Third Place Username" value={winners.third} onChange={(value) => updateWinner("third", value)} />
                </div>
              </Section>
            </div>

            <div id="generator">
              <Section
                title="Generate Prompt Buttons"
                icon={Sparkles}
                aside={<button className="icon-button" onClick={() => copyText(generatedPrompt, "generated")} title="Copy generated prompt"><Clipboard size={17} /></button>}
              >
                <div className="prompt-button-grid">
                  {promptTypes.map(({ key, label, icon: Icon }) => (
                    <button
                      className={activeType === key ? "prompt-type active" : "prompt-type"}
                      key={key}
                      onClick={() => setActiveType(key)}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="generated-output">
                  <div className="output-topline">
                    <span>{promptTypes.find((type) => type.key === activeType)?.label}</span>
                    {copied === "generated" && <em><Check size={14} /> Copied</em>}
                  </div>
                  <pre>{generatedPrompt}</pre>
                </div>
              </Section>
            </div>
          </div>

          <div className="secondary-column">
            <div id="presets">
              <Section title="Style Presets" icon={Award}>
                <div className="preset-card">
                  <div className="preset-title">
                    <span />
                    <h3>{preset.name}</h3>
                  </div>
                  <div className="trait-list">
                    {preset.traits.map((trait) => (
                      <span key={trait}>{trait}</span>
                    ))}
                  </div>
                </div>
              </Section>
            </div>

            <Section title="Theme Object Logic" icon={BookOpen}>
              <p className="logic-copy">
                Current objects: <strong>{themeObjects}</strong>
              </p>
            </Section>
          </div>
        </div>

        <div id="library">
          <Section
            title="Prompt Library"
            icon={Library}
            aside={<button className="action-button" onClick={saveTemplate}><Save size={16} /> Save Template</button>}
          >
            <div className="library-layout">
              <div className="template-editor">
                <div className="editor-row">
                  <Field label="Template Name" value={draftTemplate.name} onChange={(value) => setDraftTemplate((current) => ({ ...current, name: value }))} />
                  <Field label="Template Type" value={draftTemplate.type} onChange={(value) => setDraftTemplate((current) => ({ ...current, type: value }))} />
                </div>
                <Field label="Template Body" value={draftTemplate.body} onChange={(value) => setDraftTemplate((current) => ({ ...current, body: value }))} textarea />
                <div className="token-row">
                  {["{{challengeName}}", "{{challengeTheme}}", "{{themeObjects}}", "{{firstPlace}}"].map((token) => (
                    <button
                      key={token}
                      onClick={() => setDraftTemplate((current) => ({ ...current, body: `${current.body}${current.body ? " " : ""}${token}` }))}
                    >
                      <Plus size={13} />
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              <div className="template-list">
                {templates.map((template) => {
                  const preview = fillTemplate(template, challenge, winners);
                  return (
                    <article className="template-card" key={template.id}>
                      <div>
                        <span>{template.type}</span>
                        <h3>{template.name}</h3>
                      </div>
                      <p>{preview}</p>
                      <div className="card-actions">
                        <button onClick={() => copyText(preview, template.id)} title="Copy template output"><Clipboard size={15} /></button>
                        <button onClick={() => editTemplate(template)} title="Edit template"><Edit3 size={15} /></button>
                        <button onClick={() => deleteTemplate(template.id)} title="Delete template"><Trash2 size={15} /></button>
                        {copied === template.id && <em><Check size={13} /> Copied</em>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
