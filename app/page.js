"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Clipboard,
  Crown,
  Heart,
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

const defaultCommunityRankings = {
  voters: {
    first: "TopVoter1",
    second: "TopVoter2",
    third: "TopVoter3"
  },
  submitters: {
    first: "TopSubmitter1",
    second: "TopSubmitter2",
    third: "TopSubmitter3"
  }
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
  { key: "topVoters", label: "Top Voters", icon: Heart },
  { key: "topSubmitters", label: "Top Submitters", icon: Library },
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

const themeSoundMap = {
  automotive: "deep engine revs, tire whooshes, gear shifts, speed-ramp wind, subtle chrome impacts",
  car: "deep engine revs, tire whooshes, gear shifts, speed-ramp wind, subtle chrome impacts",
  vehicle: "deep engine revs, tire whooshes, gear shifts, speed-ramp wind, subtle chrome impacts",
  cake: "soft bakery ambience, frosting swirls, gentle whisk taps, sprinkle sparkles, warm oven chimes",
  bakery: "soft bakery ambience, frosting swirls, gentle whisk taps, sprinkle sparkles, warm oven chimes",
  food: "light kitchen ambience, sizzling accents, plating taps, soft garnish swishes, warm celebratory chimes",
  fashion: "runway bass pulses, camera shutter clicks, fabric swishes, heel steps, glossy UI chimes",
  game: "arcade power-up tones, controller clicks, score chimes, bass hits, digital whooshes",
  gaming: "arcade power-up tones, controller clicks, score chimes, bass hits, digital whooshes",
  space: "cinematic low drones, orbital whooshes, starfield shimmer, soft radio beeps, deep trailer hits",
  garden: "gentle outdoor ambience, leaf rustles, water droplets, soft wind, bright magical chimes",
  music: "beat-synced risers, speaker pulses, crowd swells, vinyl scratches, stage-light whooshes",
  art: "brush strokes, paint splashes, gallery ambience, canvas taps, soft creative sparkle sounds"
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
    body: "Create an LTX 2.3 video prompt for a 9-second square 1:1 cinematic social video for {{challengeName}} using the {{presetName}} brand. Do not write the preset name as visible text. Animate neon purple light sweeps, floating {{themeObjects}}, tiny robots assembling a winner board, glossy 3D CHALLENGE RESULTS text reveals, and a final square-framed title lockup. Sound design: {{themeSounds}} with punchy premium competition hits."
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

function getThemeSounds(theme, name, description) {
  const source = `${theme} ${name} ${description}`.toLowerCase();
  const match = Object.keys(themeSoundMap).find((keyword) => source.includes(keyword));
  if (match) return themeSoundMap[match];

  return "theme-matched ambience, soft cinematic whooshes, subtle object sounds, neon UI chimes, punchy winner-reveal hits";
}

function formatHandle(handle) {
  if (!handle) return "";
  return handle.replace(/^@+/, "");
}

function buildCommunityRankingPrompt(title, rankings, challenge, themeObjects) {
  const first = formatHandle(rankings.first);
  const second = formatHandle(rankings.second);
  const third = formatHandle(rankings.third);

  return `Create a winners board with a premium three-level podium composition. The main headline must read "${title}" only, with "${challenge.name}" shown as the smaller challenge title. First place: ${first}. Second place: ${second}. Third place: ${third}. Put the large rank numbers 1, 2, and 3 on the front faces of the podium/platform blocks only. Keep rank badges away from faces, heads, torsos, and usernames. Use neon rails, celebratory particles, tiny robot mascots, and ${themeObjects}. Only render these text elements: "${title}", "${challenge.name}", ${first}, ${second}, ${third}, rank numbers 1, 2, 3, and the dates ${challenge.startDate} to ${challenge.endDate}. Do not render the words Challenge, Theme, Description, or any paragraph text.`;
}

function buildPrompt(type, challenge, winners, communityRankings) {
  const themeObjects = getThemeObjects(challenge.theme, challenge.name, challenge.description);
  const themeSounds = getThemeSounds(challenge.theme, challenge.name, challenge.description);
  const baseStyle =
    "Maintain the Neon Purple Challenge Results visual system as the art direction only: dark purple futuristic background, large glossy 3D title text, neon glow effects, tiny robot mascots, floating challenge-related icons, premium gaming competition look, consistent visual branding, square 1:1 social media format. Do not write the preset name or the words Neon Purple as visible text in the image.";

  const context = `Reference info only, do not render this as body text in the image: Challenge name ${challenge.name}. Theme ${challenge.theme}. Description ${challenge.description}. Dates ${challenge.startDate} to ${challenge.endDate}. Theme objects ${themeObjects}.`;

  const placementPrompts = {
    first: `Use the attached image as the main artwork for ${winners.first}. Preserve the attached image content, layout, and subject exactly. Do not add new characters, mascots, props, headline text, challenge details, dates, or a new background.\n\nAdd only one medal token overlay. All winner tokens must use the exact same size and placement across 1st, 2nd, and 3rd place graphics. Token placement: lower-right corner, inset 5% from the right edge and 5% from the bottom edge. Token size: exactly 150px wide by 150px tall on a 1024px square image, or exactly 14.5% of the image width on other image sizes. Do not make any rank token larger or smaller than the others.\n\nUse the same circular coin/token design for every rank: glossy beveled rim, soft outer neon glow, engraved text, small crown icon at the top of the token, and premium gaming-polished lighting. Only the token color and rank text should change. For this version, make the token gold and clearly write "1st Place". Keep the token away from faces and important subject details.`,
    second: `Use the attached image as the main artwork for ${winners.second}. Preserve the attached image content, layout, and subject exactly. Do not add new characters, mascots, props, headline text, challenge details, dates, or a new background.\n\nAdd only one medal token overlay. All winner tokens must use the exact same size and placement across 1st, 2nd, and 3rd place graphics. Token placement: lower-right corner, inset 5% from the right edge and 5% from the bottom edge. Token size: exactly 150px wide by 150px tall on a 1024px square image, or exactly 14.5% of the image width on other image sizes. Do not make any rank token larger or smaller than the others.\n\nUse the same circular coin/token design for every rank: glossy beveled rim, soft outer neon glow, engraved text, small crown icon at the top of the token, and premium gaming-polished lighting. Only the token color and rank text should change. For this version, make the token silver and clearly write "2nd Place". Keep the token away from faces and important subject details.`,
    third: `Use the attached image as the main artwork for ${winners.third}. Preserve the attached image content, layout, and subject exactly. Do not add new characters, mascots, props, headline text, challenge details, dates, or a new background.\n\nAdd only one medal token overlay. All winner tokens must use the exact same size and placement across 1st, 2nd, and 3rd place graphics. Token placement: lower-right corner, inset 5% from the right edge and 5% from the bottom edge. Token size: exactly 150px wide by 150px tall on a 1024px square image, or exactly 14.5% of the image width on other image sizes. Do not make any rank token larger or smaller than the others.\n\nUse the same circular coin/token design for every rank: glossy beveled rim, soft outer neon glow, engraved text, small crown icon at the top of the token, and premium gaming-polished lighting. Only the token color and rank text should change. For this version, make the token bronze and clearly write "3rd Place". Keep the token away from faces and important subject details.`
  };

  if (placementPrompts[type]) {
    return placementPrompts[type];
  }

  const communityPrompts = {
    topVoters: buildCommunityRankingPrompt("TOP VOTERS", communityRankings.voters, challenge, themeObjects),
    topSubmitters: buildCommunityRankingPrompt("TOP SUBMITTERS", communityRankings.submitters, challenge, themeObjects)
  };

  if (communityPrompts[type]) {
    return `${baseStyle}\n\n${context}\n\n${communityPrompts[type]}`;
  }

  const variants = {
    poster: `Create the main challenge poster. Place "${challenge.name}" as the dominant glossy 3D headline, add readable start and end dates, and surround the title with ${themeObjects}.`,
    winners: `Create a winners board with a premium three-level podium composition. The main headline must read "CHALLENGE RESULTS" only, with "${challenge.name}" shown as the smaller challenge title. First place: ${winners.first}. Second place: ${winners.second}. Third place: ${winners.third}. Put the large rank numbers 1, 2, and 3 on the front faces of the podium/platform blocks only. Keep rank badges away from faces, heads, torsos, and usernames. Use neon rails, celebratory particles, tiny robot mascots, and ${themeObjects}. Only render these text elements: "CHALLENGE RESULTS", "${challenge.name}", ${winners.first}, ${winners.second}, ${winners.third}, rank numbers 1, 2, 3, and the dates ${challenge.startDate} to ${challenge.endDate}. Do not render the words Challenge, Theme, Description, or any paragraph text.`,
    instagram: `Create an Instagram-ready announcement post with the challenge title, short description, dates, and a callout for community participation. Keep the layout bold, legible, and square. Do not use "Neon Purple" as visible headline text.`,
    video: `Create an LTX 2.3 video prompt for a 9-second square 1:1 motion graphic.\n\nTiming:\n0-2s: Camera pushes through dark purple neon fog while ${themeObjects} drift past with soft motion trails.\n2-5s: Tiny robot mascots activate glowing panels and assemble glossy 3D "CHALLENGE RESULTS" title letters. Keep the challenge title "${challenge.name}" readable as supporting text.\n5-7s: Winners flash in with premium gaming competition energy: 1st ${winners.first}, 2nd ${winners.second}, 3rd ${winners.third}.\n7-9s: Final hero lockup holds on the square ChallengeForge branded results layout with neon rails, polished highlights, and clean readable text.\n\nCamera and motion: smooth cinematic push-in, subtle parallax, glowing particles, premium social media reveal, no shaky camera, no distorted text.\n\nAttached sound direction / audio prompt: ${themeSounds}. Layer these with neon risers, clean bass hits, soft robot beeps, celebratory winner stingers, and a final polished impact on the results lockup.`
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
    "{{themeObjects}}": getThemeObjects(challenge.theme, challenge.name, challenge.description),
    "{{themeSounds}}": getThemeSounds(challenge.theme, challenge.name, challenge.description)
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
  const [communityRankings, setCommunityRankings] = useState(defaultCommunityRankings);
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
    () => buildPrompt(activeType, challenge, winners, communityRankings),
    [activeType, challenge, winners, communityRankings]
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

  function updateCommunityRanking(group, key, value) {
    setCommunityRankings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value
      }
    }));
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

            <Section title="Community Rankings" icon={Heart}>
              <div className="rankings-layout">
                <div>
                  <h3>Top Voters</h3>
                  <div className="winner-grid">
                    <Field label="Top Voter #1" value={communityRankings.voters.first} onChange={(value) => updateCommunityRanking("voters", "first", value)} />
                    <Field label="Top Voter #2" value={communityRankings.voters.second} onChange={(value) => updateCommunityRanking("voters", "second", value)} />
                    <Field label="Top Voter #3" value={communityRankings.voters.third} onChange={(value) => updateCommunityRanking("voters", "third", value)} />
                  </div>
                </div>
                <div>
                  <h3>Top Submitters</h3>
                  <div className="winner-grid">
                    <Field label="Top Submitter #1" value={communityRankings.submitters.first} onChange={(value) => updateCommunityRanking("submitters", "first", value)} />
                    <Field label="Top Submitter #2" value={communityRankings.submitters.second} onChange={(value) => updateCommunityRanking("submitters", "second", value)} />
                    <Field label="Top Submitter #3" value={communityRankings.submitters.third} onChange={(value) => updateCommunityRanking("submitters", "third", value)} />
                  </div>
                </div>
              </div>
            </Section>

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
                  {["{{challengeName}}", "{{challengeTheme}}", "{{themeObjects}}", "{{themeSounds}}", "{{firstPlace}}"].map((token) => (
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
