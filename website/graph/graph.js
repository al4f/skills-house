(() => {
  const raw = document.getElementById("graph-data").textContent;
  const { graph, skills, scripts } = JSON.parse(raw);
  const root = document.getElementById("graph-root");
  const detail = document.getElementById("graph-detail");
  const detailTitle = document.getElementById("graph-detail-title");
  const detailList = document.getElementById("graph-detail-list");

  const nodes = [];
  skills.forEach((s) => nodes.push({ id: s.id, type: "skill", label: s.name }));
  scripts.forEach((s) => nodes.push({ id: s.id, type: "script", label: s.name }));

  const edges = [];
  Object.entries(graph.skillsToScripts).forEach(([skill, scriptList]) => {
    scriptList.forEach((script) => edges.push({ from: skill, to: script, kind: "uses" }));
  });
  Object.entries(graph.skillsToSkills).forEach(([skill, deps]) => {
    deps.forEach((dep) => edges.push({ from: skill, to: dep, kind: "depends" }));
  });

  function showDetail(node) {
    detail.hidden = false;
    detailTitle.textContent = node.label + " (" + node.type + ")";
    detailList.innerHTML = "";
    const items = node.type === "skill"
      ? (graph.skillsToScripts[node.id] || []).map((id) => ({ type: "script", id }))
          .concat((graph.skillsToSkills[node.id] || []).map((id) => ({ type: "skill", id })))
      : (graph.scriptsToSkills[node.id] || []).map((id) => ({ type: "skill", id }));
    if (!items.length) {
      const li = document.createElement("li");
      li.textContent = "No connections.";
      detailList.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.type === "skill" ? "../skills/" + item.id + "/" : "../scripts/" + item.id + "/";
      a.textContent = item.id;
      li.appendChild(a);
      detailList.appendChild(li);
    });
  }

  const cols = 4;
  const cellW = 180;
  const cellH = 56;
  root.innerHTML = '<div class="graph-grid"></div>';
  const grid = root.querySelector(".graph-grid");
  nodes.forEach((node, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "graph-node graph-node-" + node.type;
    btn.textContent = node.label;
    btn.style.gridColumn = (index % cols) + 1;
    btn.style.gridRow = Math.floor(index / cols) + 1;
    btn.addEventListener("click", () => showDetail(node));
    grid.appendChild(btn);
  });

  const edgeList = document.createElement("div");
  edgeList.className = "graph-edges";
  edges.forEach((edge) => {
    const p = document.createElement("p");
    const fromType = skills.some((s) => s.id === edge.from) ? "skill" : "script";
    const toType = skills.some((s) => s.id === edge.to) ? "skill" : "script";
    p.innerHTML = '<a href="../' + fromType + 's/' + edge.from + '/">' + edge.from + '</a> → <a href="../' + toType + 's/' + edge.to + '/">' + edge.to + '</a> <span class="edge-kind">' + edge.kind + '</span>';
    edgeList.appendChild(p);
  });
  root.appendChild(edgeList);
})();