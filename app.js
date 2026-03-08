const STORY = {
  start: {
    id: "start",
    title: "02:13 | Slab District Roofline",
    text: "Rain hisses off neon signage while your stolen shard warms in your palm. The city grid is splitting into blackout zones. If you crack the shard, you might save Sector Nine or sell it and disappear.",
    choices: [
      {
        label: "Jack into the shard and trace its source",
        nextSceneId: "trace",
        effects: { cred: -1, heat: 1, humanity: 1 }
      },
      {
        label: "Contact broker Nyx and negotiate a sale",
        nextSceneId: "broker",
        effects: { cred: 2, heat: 0, humanity: -1 }
      },
      {
        label: "Take it to the free-clinic netrunner",
        nextSceneId: "clinic",
        effects: { cred: 0, heat: 0, humanity: 2 }
      }
    ]
  },
  trace: {
    id: "trace",
    title: "Ghost Signal",
    text: "The shard maps to an orbital relay and pings your location to corporate hunters. You can burn your identity or lure them into gang territory.",
    choices: [
      {
        label: "Burn your identity and vanish into the undercity",
        nextSceneId: "ending_rebel",
        effects: { cred: -1, heat: -1, humanity: 1 }
      },
      {
        label: "Lead hunters into the Maelstrom market",
        nextSceneId: "ending_chaos",
        effects: { cred: 1, heat: 2, humanity: -1 }
      }
    ]
  },
  broker: {
    id: "broker",
    title: "Night Bazaar",
    text: "Nyx offers hard cash, no questions, but whispers that the shard contains emergency protocols for city life support. You can seal the deal or steal Nyx's decrypt key.",
    choices: [
      {
        label: "Take the payment and leave the city behind",
        nextSceneId: "ending_wealth",
        effects: { cred: 3, heat: 1, humanity: -2 }
      },
      {
        label: "Steal Nyx's decrypt key and expose the protocol",
        nextSceneId: "ending_truth",
        effects: { cred: 0, heat: 2, humanity: 2 }
      }
    ]
  },
  clinic: {
    id: "clinic",
    title: "Basement Sanctuary",
    text: "The clinic confirms the shard can reboot failing filtration towers. But deploying it publicly puts a bounty on your head. You can activate it now or hand it to a resistance cell.",
    choices: [
      {
        label: "Broadcast activation code to every tower",
        nextSceneId: "ending_savior",
        effects: { cred: 0, heat: 3, humanity: 3 }
      },
      {
        label: "Give it to the resistance and disappear",
        nextSceneId: "ending_shadow",
        effects: { cred: 1, heat: 1, humanity: 2 }
      }
    ]
  },
  ending_rebel: {
    id: "ending_rebel",
    title: "Ending: Signal In The Dark",
    text: "You erase your old name and begin leaking corporate kill-switch maps one district at a time. The blackout stops spreading. No one knows who saved them.",
    choices: [],
    ending: true
  },
  ending_chaos: {
    id: "ending_chaos",
    title: "Ending: Market Fire",
    text: "Gunfire and drone smoke swallow the bazaar. The hunters are gone, but so are hundreds of civilians. You survive richer, infamous, and alone.",
    choices: [],
    ending: true
  },
  ending_wealth: {
    id: "ending_wealth",
    title: "Ending: Golden Exile",
    text: "You leave Night City on a silent aero-rail with enough credits for a lifetime. Weeks later, Sector Nine loses power and vanishes from the newsfeed.",
    choices: [],
    ending: true
  },
  ending_truth: {
    id: "ending_truth",
    title: "Ending: Open Source Revolt",
    text: "You publish the protocol and ignite city-wide protests. Corps cannot bury the data anymore. The streets are unstable, but people finally have leverage.",
    choices: [],
    ending: true
  },
  ending_savior: {
    id: "ending_savior",
    title: "Ending: Neon Saint",
    text: "The towers reboot, clean water returns, and bounty boards flood with your face. Kids paint your tag on every station wall while you run forever.",
    choices: [],
    ending: true
  },
  ending_shadow: {
    id: "ending_shadow",
    title: "Ending: Quiet Network",
    text: "The resistance deploys the fix in secret, district by district. Life gets better slowly, invisibly. You become a rumor used to recruit the next generation.",
    choices: [],
    ending: true
  }
};

const STORAGE_KEY = "neon-divide-save-v1";

const titleEl = document.getElementById("scene-title");
const textEl = document.getElementById("scene-text");
const choiceListEl = document.getElementById("choice-list");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

const statCredEl = document.getElementById("stat-cred");
const statHeatEl = document.getElementById("stat-heat");
const statHumanityEl = document.getElementById("stat-humanity");

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved);
    if (!parsed.currentSceneId || !STORY[parsed.currentSceneId]) return createInitialState();
    return {
      currentSceneId: parsed.currentSceneId,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      stats: {
        cred: Number(parsed.stats?.cred || 0),
        heat: Number(parsed.stats?.heat || 0),
        humanity: Number(parsed.stats?.humanity || 0)
      }
    };
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  return {
    currentSceneId: "start",
    history: [],
    stats: { cred: 0, heat: 0, humanity: 0 }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyEffects(effects = {}) {
  state.stats.cred += Number(effects.cred || 0);
  state.stats.heat += Number(effects.heat || 0);
  state.stats.humanity += Number(effects.humanity || 0);
}

function render() {
  const scene = STORY[state.currentSceneId];
  if (!scene) return;

  titleEl.textContent = scene.title;
  textEl.textContent = scene.text;

  statCredEl.textContent = state.stats.cred;
  statHeatEl.textContent = state.stats.heat;
  statHumanityEl.textContent = state.stats.humanity;

  choiceListEl.innerHTML = "";

  if (scene.ending) {
    const endingNote = document.createElement("p");
    endingNote.className = "ending-note";
    endingNote.textContent = "Transmission complete.";
    choiceListEl.appendChild(endingNote);
  }

  scene.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.type = "button";
    button.textContent = `${index + 1}. ${choice.label}`;
    button.addEventListener("click", () => {
      state.history.push({
        previousSceneId: state.currentSceneId,
        effects: choice.effects || {}
      });
      applyEffects(choice.effects);
      state.currentSceneId = choice.nextSceneId;
      saveState();
      render();
    });
    choiceListEl.appendChild(button);
  });

  backBtn.disabled = state.history.length === 0;
}

function subtractEffects(effects = {}) {
  state.stats.cred -= Number(effects.cred || 0);
  state.stats.heat -= Number(effects.heat || 0);
  state.stats.humanity -= Number(effects.humanity || 0);
}

backBtn.addEventListener("click", () => {
  if (state.history.length === 0) return;
  const last = state.history.pop();
  subtractEffects(last.effects);
  state.currentSceneId = last.previousSceneId;
  saveState();
  render();
});

restartBtn.addEventListener("click", () => {
  state = createInitialState();
  saveState();
  render();
});

render();
